import { RefreshToken } from "../../domain/entities/refreshToken";

export interface IRefreshTokenRepository {

    createAysnc(
        jwt: string,
        userId: string,
        deviceId: string,
        userAgent: string,
        ipAddress: string
    ): Promise<RefreshToken>;

    getByTokenValueAndDeviceId(
        tokenValue: string, 
        deviceId: string
    ) : Promise<RefreshToken>;

    GenerateToken(): string;
    updateAsync(refreshToken: RefreshToken) : Promise<void>;
}