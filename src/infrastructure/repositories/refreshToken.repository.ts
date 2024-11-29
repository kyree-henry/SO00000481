import * as crypto from 'crypto';
import { Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "src/domain/entities/refreshToken";
import { IRefreshTokenRepository } from "src/core/repositories/interfaces/irefreshtoken.repository";

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
            tokenValue: this.GenerateToken()
        });

        return await this.refreshTokenContext.save(refreshToken);
    }

    public async getByTokenValueAndDeviceId(tokenValue: string, deviceId: string) : Promise<RefreshToken> {
        return await this.refreshTokenContext.findOne({ where: { tokenValue, deviceId } }); 
    }

    public async updateAsync(refreshToken: RefreshToken) : Promise<void> {
        
    }

    public async deleteAsync(refreshToken: RefreshToken) : Promise<RefreshToken> {
        return await this.refreshTokenContext.remove(refreshToken);
    }

    public GenerateToken(): string {

        const randomBytes = crypto.randomBytes(32);

        const tokenValue = randomBytes.toString('base64');

        return tokenValue;
    }

}