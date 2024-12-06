import { Response } from "express";
import { CommandBus } from "@nestjs/cqrs";
 import { ApiResponse, ApiTags } from "@nestjs/swagger";
 import { PermissionsGuard } from "../../../core/passport/permissions.guard";
import { Body, Controller, HttpStatus, Patch, Res, UseGuards } from "@nestjs/common";
import { DeactivateRoleCommand, DeactivateRoleRequestModel } from "./deactivate-role.handler";

@ApiTags('Roles')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/role`,
    version: '1',
})
export class DeactivateRoleController {

    constructor(private readonly commandBus: CommandBus) { }

    @Patch('deactivate')
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiResponse({ status: 204, description: 'NO_CONTENT' })
    public async Deactivate(@Body() request: DeactivateRoleRequestModel, @Res() res: Response
    ): Promise<void> {

        await this.commandBus.execute(new DeactivateRoleCommand({
            model: request
        }));

        res.status(HttpStatus.NO_CONTENT).send(null); 
     }
}