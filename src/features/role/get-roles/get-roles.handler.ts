import { Inject } from "@nestjs/common";
import { RoleModel } from "../role.model";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IRoleRepository } from "../../../core/repositories/irole.repository";

export class GetRolesQuery { }

@CommandHandler(GetRolesQuery)
export class GetRolesHandler implements ICommandHandler<GetRolesQuery> {
    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository) {
    }

     async execute(query: GetRolesQuery): Promise<RoleModel[]> {
 
        const roles = await this.roleRepository.getAsync();

        if (roles?.length == 0) return [];

        return roles.map(role => new RoleModel({
            id: role.id,
            name: role.name,
            description: role.description,
            permissionsCount: role.roleClaims?.length
        })); 
    }
} 