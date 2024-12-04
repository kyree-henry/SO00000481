import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { Globals } from "../../../core/globals";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PermissionModel, RoleClaimModel } from "../role.model";
import { Permissions } from "../../../core/utils/permissions.util";
import { IRoleRepository } from "../../../core/repositories/irole.repository";
import { RoleNotFoundException } from "../../../core/exceptions/role.exception";
import { IRoleClaimRepository } from "../../../core/repositories/iroleClaim.repository";

export class GetPermissionsQuery {
    roleId: string;

    constructor(request: Partial<GetPermissionsQuery> = {}) {
        Object.assign(this, request);
    }
}

const getPermissionsQueryValidations = {
    params: Joi.object().keys({
        roleId: Joi.string().required()
    })
};

@CommandHandler(GetPermissionsQuery)
export class GetPermissionsHandler implements ICommandHandler<GetPermissionsQuery> {
    constructor(
        private readonly permissions: Permissions,
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
        @Inject('IRoleClaimRepository') private readonly roleClaimRepository: IRoleClaimRepository,
    ) { }

    public async execute(query: GetPermissionsQuery): Promise<PermissionModel> {

        await getPermissionsQueryValidations.params.validateAsync(query);

        let result = new PermissionModel();

        const role = await this.roleRepository.getByNameAsync(query.roleId)
            ?? (() => { throw new RoleNotFoundException(query.roleId) })();

        result.roleId = role.id;
        result.roleName = role.name;

        const allPermissions: string[] = this.permissions.discoverControllerPermissions();
        const roleClaims = await this.roleClaimRepository.getByRoleIdAsync(role.id);
        const roleClaimsValue: string[] = roleClaims.map((roleClaim) => roleClaim.claimValue);

        allPermissions.forEach((permission) => {
            const roleClaim = new RoleClaimModel({
                claimType: Globals.ClaimTypes.Permission,
                claimValue: permission,
                selected: roleClaimsValue.includes(permission),
            });

            result.roleClaims.push(roleClaim);
        });

        return result;
    }
}  