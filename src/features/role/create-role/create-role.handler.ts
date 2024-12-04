import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { RoleModel } from "../role.model";
import { ApiProperty } from "@nestjs/swagger";
import { RoleType } from "../../../domain/enums";
import { Role } from "../../../domain/entities/role.entity";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IRoleRepository } from "../../../core/repositories/irole.repository";
import { RoleAlreadyExistsException } from "../../../core/exceptions/role.exception";


export class CreateRoleModel {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    constructor(request: Partial<CreateRoleModel> = {}) {
        Object.assign(this, request);
    }
}

export class CreateRoleCommand {
    model: CreateRoleModel

    constructor(request: Partial<CreateRoleCommand> = {}) {
        Object.assign(this, request);
    }
}

const createRoleValidations = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
});

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand, RoleModel> {
    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    ) { }

    public async execute(command: CreateRoleCommand): Promise<RoleModel> {

        await createRoleValidations.validateAsync(command.model);

        let role = await this.roleRepository.getByNameAsync(command.model.name);

        if (role) {
            throw new RoleAlreadyExistsException(command.model.name);
        }

        role = await this.roleRepository.createAsync(
            new Role({
                name: command.model.name,
                description: command.model.description,
                type: RoleType.Regular,
            }));


        const result = new RoleModel({
            id: role.id,
            name: role.name,
            type: role.type,
        });

        return result;
    }
} 