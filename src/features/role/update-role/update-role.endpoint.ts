import { Response } from "express";
import { CommandBus } from "@nestjs/cqrs";
import { RoleModel } from "../role.model";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Put, Res, UseGuards } from "@nestjs/common";
import { UpdateRoleModel, UpdateRoleCommand } from "./update-role.handler";
import { PermissionsGuard } from "../../../core/passport/permissions.guard";

@ApiTags('Roles')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/role`,
    version: '1',
})
export class UpdateRoleController {

    constructor(private readonly commandBus: CommandBus) { }

    @Put()
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiResponse({ status: 200, description: 'OK' })
    public async Update(@Body() request: UpdateRoleModel, @Res() res: Response
    ): Promise<RoleModel> {

        const result = await this.commandBus.execute(new UpdateRoleCommand({
            model: request
        }));
 
        return result;
    }
}