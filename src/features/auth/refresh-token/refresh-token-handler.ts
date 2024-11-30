import { CommandHandler, ICommandHandler } from "cqrs";
import { Inject, UnauthorizedException } from "@nestjs/common";
import { TokenResponseModel } from "../tokenResponseModel";
import { IUserRepository } from "src/core/repositories/iuser.repository";
import { ITokenService } from "src/core/services/itoken.service"; 

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



@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
    constructor(
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) {
    }

    public async execute(command: RefreshTokenCommand): Promise<TokenResponseModel> {

         
 
        throw new UnauthorizedException('Please authenticate');
    }
}
