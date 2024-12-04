import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { RoleClaimModel } from "../role.model";
import { Globals } from "../../../core/globals";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RoleClaim } from "../../../domain/entities/roleClaim.entity";
import { IRoleRepository } from "../../../core/repositories/irole.repository";
import { RoleNotFoundException } from "../../../core/exceptions/role.exception";
import { IRoleClaimRepository } from "../../../core/repositories/iroleClaim.repository";


export class UpdatePermissionsModel {
    @ApiProperty()
    roleId: string;

    @ApiProperty()
    roleName: string;

    @ApiProperty()
    roleClaims: RoleClaimModel[];

    constructor(request: Partial<UpdatePermissionsModel> = {}) {
        Object.assign(this, request);
    }
}

export class UpdatePermissionsCommand {
    model: UpdatePermissionsModel

    constructor(request: Partial<UpdatePermissionsCommand> = {}) {
        Object.assign(this, request);
    }
}

const updatePermissionsValidations = Joi.object({
    roleId: Joi.string().required(),
    roleName: Joi.string().required()
});

@CommandHandler(UpdatePermissionsCommand)
export class UpdatePermissionsHandler implements ICommandHandler<UpdatePermissionsCommand> {
    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
        @Inject('IRoleClaimRepository') private readonly roleClaimRepository: IRoleClaimRepository,
    ) { }

    public async execute(command: UpdatePermissionsCommand): Promise<void> {

        await updatePermissionsValidations.validateAsync(command.model);

        const role = await this.roleRepository.getByIdAsync(command.model.roleId)
            ?? (() => { throw new RoleNotFoundException(command.model.roleId) })();

        if (role.name === Globals.Roles.Admin) {

            //TODO: check if user current loggedIn user is in admin role, if not 
            // throw new BadRequestException("Not allowed to modify Permissions for this Role."); 

            // also check if the removed permission has to do with roles and permissions if so,
            // throw new BadRequestException(`Not allowed to deselect #permissions for this role.`); // replace #permissions with actuall permissions name 
        }

        const selectedClaims = command.model.roleClaims
            .filter((roleClaim: RoleClaimModel) => roleClaim.selected)
            .map((roleClaim: RoleClaimModel) => {
                return new RoleClaim({
                    claimType: roleClaim.claimType,
                    claimValue: roleClaim.claimValue,
                    roleId: role.id,
                });
            });

        //TODO: handle failure 
        selectedClaims.forEach(async (roleClaim) => {
            await this.roleClaimRepository.createAsync(roleClaim);
        });

     }
} 