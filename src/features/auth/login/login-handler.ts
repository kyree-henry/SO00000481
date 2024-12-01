import Joi from "joi";
import { Inject } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

import { CommandHandler, ICommandHandler } from "cqrs";
import { TokenResponseModel } from "../tokenResponseModel";
import { password } from "src/core/utils/validation";
import { ITokenService } from "../../../core/services/itoken.service";
import { IUserRepository } from "src/core/repositories/iuser.repository";
import { IRefreshTokenRepository } from "src/core/repositories/irefreshtoken.repository";
import { User } from "src/domain/entities/user";


export class TokenRequestModel {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    userAgent: string;

    @ApiProperty()
    ipAddress: string;

    @ApiProperty()
    deviceId: string;

    constructor(request: Partial<TokenRequestModel> = {}) {
        Object.assign(this, request);
    }
}

const loginValidations = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
    userAgent: Joi.string().required().message('Prevented: Adulterated Request Received!'),
    ipAddress: Joi.string().required().message('Prevented: Adulterated Request Received!'),
    deviceId: Joi.string().required().message('Prevented: Adulterated Request Received!'),
});

export class LoginCommand {
    model: TokenRequestModel;

    constructor(request: Partial<LoginCommand> = {}) {
        Object.assign(this, request);
    }
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {

    constructor(
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IRefreshTokenRepository') private readonly refreshTokenService: IRefreshTokenRepository
    ) { }

    public async execute(command: LoginCommand): Promise<TokenResponseModel> {

        await loginValidations.validateAsync(command);

        const user = await this.userRepository.getUserByEmailAsync(command.model.email);
        if (!user || !(await this.userRepository.checkPasswordAsync(user, command.model.password))) {
            await this.handleFailedLoginAttempt(user);
            return this.createErrorResponse("Invalid login attempt.");
        }

        if (this.isAccountLockedOrInactive(user)) {
            return this.handleLockedOrInactiveAccount(user);
        }

        return this.handleSuccessfulLogin(user, command.model);
    }

    private async handleSuccessfulLogin(user: User, model: TokenRequestModel): Promise<TokenResponseModel> {
        user.accessFailedCount = 0;
        await this.userRepository.updateAsync(user);

        const access_token = await this.tokenService.generateJwtAsync(user);
        const refreshToken = await this.refreshTokenService.createAysnc(
            access_token,
            user.id,
            model.deviceId,
            model.userAgent,
            model.ipAddress
        );

        // TODO: Send email notification of login with new ipAddress and deviceInfo

        return new TokenResponseModel({
            access_token,
            refresh_token: refreshToken.tokenValue,
            succeeded: true,
            refreshTokenExpiryTime: refreshToken.expiryDateUtc.toDateString(),
        });
    }

    private async handleFailedLoginAttempt(user: User | null): Promise<void> {
        if (user) {
            user.accessFailedCount += 1;
            await this.userRepository.updateAsync(user);
        }
    }

    private isAccountLockedOrInactive(user: User): boolean {
        return user.isLockedOut || !user.isActive;
    }

    private handleLockedOrInactiveAccount(user: User): TokenResponseModel {
        const message = this.getAccountLockMessage(user);
        return this.createErrorResponse(message);
    }

    private getAccountLockMessage(user: User): string {
        if (!user.isActive) {
            return "Your account has been disabled by an administrator.";
        }

        return user.accessFailedCount >= 5
            ? "Your account is locked due to too many unsuccessful login attempts."
            : "Your account has been locked due to suspicious activity.";
    }

    private createErrorResponse(message: string): TokenResponseModel {
        return new TokenResponseModel({ message, succeeded: false });
    }
}  