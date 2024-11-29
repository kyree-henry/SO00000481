export class TokenResponseModel {

    access_token: string;
    refresh_token: string;

    message: string;
    userImage: string;
    succeeded: boolean;
    isLockedOut: boolean;
    refreshTokenExpiryTime: string;

    constructor(request: Partial<TokenResponseModel> = {}) {
        Object.assign(this, request);
    }
}