import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { RoleModel } from "../role.model";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IRoleRepository } from "../../../core/repositories/irole.repository";
import { RoleNotFoundException } from "../../../core/exceptions/role.exception";


export class GetRoleByNameQuery {
    roleName: string;
 
    constructor(request: Partial<GetRoleByNameQuery> = {}) {
        Object.assign(this, request);
    }
}

const getRoleByNameQueryValidations = {
    params: Joi.object().keys({
        roleName: Joi.string().required()
    })
};
 
@CommandHandler(GetRoleByNameQuery)
export class GetRoleByNameHandler implements ICommandHandler<GetRoleByNameQuery> {
    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    ) { }

    public async execute(query: GetRoleByNameQuery): Promise<RoleModel> {

        await getRoleByNameQueryValidations.params.validateAsync(query);

        const role = await this.roleRepository.getByNameAsync(query.roleName);

        if (!role) {
            throw new RoleNotFoundException('', query.roleName);
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