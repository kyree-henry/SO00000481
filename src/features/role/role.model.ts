import { RoleType } from "../../domain/enums";

export class RoleModel {
    id: string;
    name: string;
    description: string;
    type: RoleType;
    permissionsCount: number;

    constructor(partial?: Partial<RoleModel>) {
        Object.assign(this, partial);
    }
}

export class PermissionModel {
    roleId: string;
    roleName: string;
    roleClaims: RoleClaimModel[];

    constructor(partial?: Partial<PermissionModel>) {
        Object.assign(this, partial);
        this.roleClaims = partial?.roleClaims || [];
    }
}

export class RoleClaimModel {
    roleId: string;
    claimType: string;
    claimValue: string;
    selected: boolean;

    constructor(partial?: Partial<RoleClaimModel>) {
        Object.assign(this, partial);
    }
}
