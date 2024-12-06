import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IRoleRepository } from "../../../core/repositories/irole.repository";
import { RoleNotFoundException } from "../../../core/exceptions/role.exception";

export class ActivateRoleCommand {
    roleId: string;

    constructor(request: Partial<ActivateRoleCommand> = {}) {
        Object.assign(this, request);
    }
}

const activateRoleValidations = Joi.object({
    roleId: Joi.string().required(),
});


@CommandHandler(ActivateRoleCommand)
export class ActivateRoleHandler implements ICommandHandler<ActivateRoleCommand> {
    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    ) { }

    public async execute(command: ActivateRoleCommand): Promise<void> {

        await activateRoleValidations.validateAsync(command);

        let role = await this.roleRepository.getByIdAsync(command.roleId)
            ?? (() => { throw new RoleNotFoundException('', command.roleId) })();


        if (!role.isDisabled) {
            return;
        }

        role.isDisabled = false;
        role.disabledUntil = null;

        await this.roleRepository.updateAsync(role);
        //TODO: send email notification to all users in role 
    }
}   