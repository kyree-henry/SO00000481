import * as crypto from 'crypto';
import configs from 'src/configs';
import { Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { addDurationToNow } from 'src/core/utils/time';
import { RefreshToken } from "src/domain/entities/refreshToken";
import { IRefreshTokenRepository } from "src/core/repositories/irefreshtoken.repository";

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {

    constructor(
        @InjectRepository(RefreshToken) private readonly refreshTokenContext: Repository<RefreshToken>,
    ) { }


    public async createAysnc(
        jwt: string,
        userId: string,
        deviceId: string,
        userAgent: string,
        ipAddress: string
    ): Promise<RefreshToken> {

        const refreshToken = new RefreshToken({
            jwt,
            userId,
            deviceId,
            userAgent,
            ipAddress,
            tokenValue: this.GenerateToken(),
            expiryDateUtc: addDurationToNow(configs.jwt.refreshTokenExpiration),
        });
        

        return await this.refreshTokenContext.save(refreshToken);
    }

    public async getByTokenValueAndDeviceId(tokenValue: string, deviceId: string) : Promise<RefreshToken> {
        return await this.refreshTokenContext.findOne({ where: { tokenValue, deviceId } }); 
    }

    public async updateAsync(refreshToken: RefreshToken) : Promise<void> {
        await this.refreshTokenContext.update(refreshToken.id, refreshToken);
    }

    public async deleteAsync(refreshToken: RefreshToken) : Promise<RefreshToken> {
        return await this.refreshTokenContext.remove(refreshToken);
    }

    public GenerateToken(): string { 
        const randomBytes = crypto.randomBytes(32); 
        return randomBytes.toString('base64'); 
    }

}