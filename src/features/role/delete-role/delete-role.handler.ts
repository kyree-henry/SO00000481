import * as Joi from "joi";
import { RoleType } from "../../../domain/enums";
import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IRoleRepository } from "../../../core/repositories/irole.repository";
import { RoleNotFoundException } from "../../../core/exceptions/role.exception";
import { IUserRoleRepository } from "../../../core/repositories/iuserRole.repository";

export class DeleteRoleCommand {
    roleId: string;

    constructor(request: Partial<DeleteRoleCommand> = {}) {
        Object.assign(this, request);
    }
}

const deleteRoleValidations = Joi.object({
    roleId: Joi.string().required(),
});

@CommandHandler(DeleteRoleCommand)
export class CreateRoleHandler implements ICommandHandler<DeleteRoleCommand> {
    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
        @Inject('IUserRoleRepository') private readonly userRoleRepository: IUserRoleRepository,
    ) { }

    public async execute(command: DeleteRoleCommand): Promise<void> {

        await deleteRoleValidations.validateAsync(command);

        const role = await this.roleRepository.getByIdAsync(command.roleId)
            ?? (() => { throw new RoleNotFoundException('', command.roleId) })();

        if (role.type == RoleType.System) {
            throw new BadRequestException(`Prevented: Not allowed to delete ${role.name} role`);
        }

        const usersInRole = await this.userRoleRepository.getByRoleId(role.id);
        if (usersInRole.length > 0) {
            throw new BadRequestException(`Prevented: The role '${role.name}' cannot be deleted because it is currently assigned to ${usersInRole.length} user(s)." +
                    $" Please remove the role from all users before attempting to delete it.`)
        }

        this.roleRepository.deleteAsync(role);
    }
}   