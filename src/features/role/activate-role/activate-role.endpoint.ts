import { Response } from "express";
import { CommandBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ActivateRoleCommand } from "./activate-role.handler";
 import { PermissionsGuard } from "../../../core/passport/permissions.guard";
import { Query, Controller, Patch, HttpStatus, Res, UseGuards } from "@nestjs/common";

@ApiTags('Roles')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/role`,
    version: '1',
})
export class ActivateRoleController {

    constructor(private readonly commandBus: CommandBus) { }

    @Patch('activate')
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiResponse({ status: 204, description: 'NO_CONTENT' })
    public async Activate(@Query('roleId') roleId: string, @Res() res: Response
    ): Promise<void> {

        await this.commandBus.execute(new ActivateRoleCommand({ roleId }));

        res.status(HttpStatus.NO_CONTENT).send(null);
    }
}