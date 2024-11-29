import { TokenRequestModel } from "../login/login-handler";

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



