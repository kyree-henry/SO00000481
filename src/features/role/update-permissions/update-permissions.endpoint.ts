import { Response } from "express";
import { CommandBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, HttpStatus, Patch, Res, UseGuards } from "@nestjs/common";
import { PermissionsGuard } from "../../../core/passport/permissions.guard";
import { UpdatePermissionsCommand, UpdatePermissionsModel } from "./update-permissions.handler";

@ApiTags('Roles')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/role`,
    version: '1',
})
export class UpdatePermissionsController {

    constructor(private readonly commandBus: CommandBus) { }

    @Patch('update-permissions')
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiResponse({ status: 200, description: 'OK' })
    public async UpdatePermissions(@Body() request: UpdatePermissionsModel, @Res() res: Response
    ): Promise<void> {

        await this.commandBus.execute(new UpdatePermissionsCommand({
            model: request
        }));

        res.status(HttpStatus.NO_CONTENT).send(null);
    }
}