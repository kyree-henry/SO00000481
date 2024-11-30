import Joi from "joi";
import { Inject } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

import { CommandHandler, ICommandHandler } from "cqrs";
import { TokenResponseModel } from "../tokenResponseModel";
import { password } from "src/core/utils/validation";
import { ITokenService } from "../../../core/services/itoken.service";
import { IUserRepository } from "src/core/repositories/iuser.repository";
import { IRefreshTokenRepository } from "src/core/repositories/irefreshtoken.repository";


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
         @Inject('IUserRepository') private readonly userRepository: IUserRepository ,
         @Inject('IRefreshTokenRepository') private readonly refreshTokenService: IRefreshTokenRepository 
     ) {}

    async execute(command: LoginCommand): Promise<TokenResponseModel> {

        await loginValidations.validateAsync(command);

        const invalidLoginMessage = "Invalid login attempt.";

        const user = await this.userRepository.getUserByEmailAsync(command.model.email);
        if (!user || !(await this.userRepository.checkPasswordAsync(user, command.model.password))) {
            return new TokenResponseModel({ message: invalidLoginMessage, succeeded: false });
        }

        if (user.isLockedOut || !user.isActive) {
            const message = !user.isActive
                ? "Your account has been disabled by an administrator."
                : `Your account is locked due to too many login attempts.`;
            return new TokenResponseModel({ message, succeeded: false });
        }
 
        const access_token = await this.tokenService.generateJwtAsync(user);
        const refreshToken = await this.refreshTokenService.createAysnc(
            access_token, 
            user.id, 
            command.model.deviceId, 
            command.model.userAgent,
            command.model.ipAddress 
        );
 
        //TODO: Send email notification of login with new ipAddress and deviceInfo
 
        return new TokenResponseModel({
            access_token,
            refresh_token: refreshToken.tokenValue,
            succeeded: true,
            refreshTokenExpiryTime: refreshToken.expiryDateUtc.toDateString(), 
        });
    }
}  