export class UserModel {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    gender: string;
    phoneNumber: string;

    constructor(partial?: Partial<UserModel>) {
        Object.assign(this, partial);
    }
}