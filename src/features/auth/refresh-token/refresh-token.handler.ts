import * as Joi from "joi";
import configs from "../../../configs";
import { Inject } from "@nestjs/common";
import { hasIpChanged } from "../../../core/utils/ip.util";
import { TokenResponseModel } from "../tokenResponse.model";
import { addDurationToNow } from "../../../core/utils/time.util";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITokenService } from "../../../core/services/itoken.service";
import { IUserRepository } from "../../../core/repositories/iuser.repository";
import { IRefreshTokenRepository } from "../../../core/repositories/irefreshtoken.repository";

export class RefreshTokenRequestModel {
    userAgent: string;
    ipAddress: string;
    deviceId: string;
    access_token: string;
    refresh_token: string;

    constructor(request: Partial<RefreshTokenRequestModel> = {}) {
        Object.assign(this, request);
    }
}

export class RefreshTokenCommand {
    model: RefreshTokenRequestModel;

    constructor(request: Partial<RefreshTokenCommand> = {}) {
        Object.assign(this, request);
    }
}

const refreshTokenValidations = Joi.object({
    userAgent: Joi.string().required().messages({'any.required': ' Prevented: Adulterated Request Received!'}),
    ipAddress: Joi.string().required().messages({'any.required': ' Prevented: Adulterated Request Received!'}),
    deviceId: Joi.string().required().messages({'any.required': ' Prevented: Adulterated Request Received!'}),
    access_token: Joi.string().required().messages({'any.required': ' Prevented: Adulterated Request Received!'}),
    refresh_token: Joi.string().required().messages({'any.required': ' Prevented: Adulterated Request Received!'}),
});

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
    constructor(
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IRefreshTokenRepository') private readonly refreshTokenRepository: IRefreshTokenRepository
    ) { }

    public async execute(command: RefreshTokenCommand): Promise<TokenResponseModel> {

        await refreshTokenValidations.validateAsync(command.model);

        const userPrincipal = await this.tokenService.getPrincipalFromToken(command.model.access_token);

        const user = await this.userRepository.getUserByEmailAsync(userPrincipal.email);
        if (!user) {
            throw new Error("User associated with the token does not exist.");
        }

        const refreshToken = await this.refreshTokenRepository.getByTokenValueAndDeviceId(
            command.model.refresh_token,
            command.model.deviceId
        );

        if (!refreshToken) {
            throw new Error("Invalid refresh token or device mismatch.");
        }

        const currentUtcDate = new Date();
        if (refreshToken.expiryDateUtc < currentUtcDate) {
            throw new Error("Refresh token has expired. Please log in again.");
        }

        refreshToken.jwt = await this.tokenService.generateJwtAsync(user);
        refreshToken.tokenValue = this.refreshTokenRepository.GenerateToken();
        refreshToken.expiryDateUtc = addDurationToNow(configs.jwt.refreshTokenExpiration);

        const hasChanged = hasIpChanged(command.model.ipAddress, refreshToken.ipAddress);

        if (hasChanged) {
            // TODO: Send email notification of account access with new ipAddress  
        }

        await this.refreshTokenRepository.updateAsync(refreshToken);

        return new TokenResponseModel({
            access_token: refreshToken.jwt,
            refresh_token: refreshToken.tokenValue,
            succeeded: true,
            refreshTokenExpiryTime: refreshToken.expiryDateUtc.toDateString(),
        });
    }
} 