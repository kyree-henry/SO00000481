import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { RoleModel } from "../role.model";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IRoleRepository } from "../../../core/repositories/irole.repository";
import { RoleNotFoundException } from "../../../core/exceptions/role.exception";


export class GetRoleByIdQuery {
    roleId: string;
 
    constructor(request: Partial<GetRoleByIdQuery> = {}) {
        Object.assign(this, request);
    }
}

const getRoleByIdQueryValidations = {
    params: Joi.object().keys({
        roleId: Joi.string().required()
    })
};
 
@CommandHandler(GetRoleByIdQuery)
export class GetRoleByIdHandler implements ICommandHandler<GetRoleByIdQuery> {
    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    ) { }

    public async execute(query: GetRoleByIdQuery): Promise<RoleModel> {

        await getRoleByIdQueryValidations.params.validateAsync(query);

        const role = await this.roleRepository.getByIdAsync(query.roleId);

        if (!role) {
            throw new RoleNotFoundException(query.roleId);
        }

        const result = new RoleModel({
            id: role.id,
            name: role.name,
            type: role.type,
            description: role.description,
            permissionsCount: role.roleClaims?.length,
        });

        return result;
    }
}  