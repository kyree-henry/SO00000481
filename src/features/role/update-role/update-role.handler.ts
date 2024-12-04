import * as Joi from "joi";
import { BadRequestException, Inject } from "@nestjs/common";
import { RoleModel } from "../role.model";
import { ApiProperty } from "@nestjs/swagger";
import { RoleType } from "../../../domain/enums";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IRoleRepository } from "../../../core/repositories/irole.repository";
import { RoleNotFoundException } from "../../../core/exceptions/role.exception";


export class UpdateRoleModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    constructor(request: Partial<UpdateRoleModel> = {}) {
        Object.assign(this, request);
    }
}

export class UpdateRoleCommand {
    model: UpdateRoleModel

    constructor(request: Partial<UpdateRoleCommand> = {}) {
        Object.assign(this, request);
    }
}

const updateRoleValidations = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
});

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand, RoleModel> {
    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    ) { }

    public async execute(command: UpdateRoleCommand): Promise<RoleModel> {

        await updateRoleValidations.validateAsync(command.model);

        let role = await this.roleRepository.getByNameAsync(command.model.name)
            ?? (() => { throw new RoleNotFoundException(command.model.name) })();

        if (role.type === RoleType.System) {
            throw new BadRequestException(`Prevented: Not allowed to modify  "${role.name}" Role.`);
        }

        role.name = command.model.name;
        role.normalizedName = command.model.name.toUpperCase();
        role.description = command.model.description;

        await this.roleRepository.updateAsync(role);

        const result = new RoleModel({
            id: role.id,
            name: role.name,
            type: role.type,
            permissionsCount: role.roleClaims?.length
        });

        return result;
    }
} 