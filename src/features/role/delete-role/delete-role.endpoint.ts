import { Response } from "express";
import { CommandBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeleteRoleCommand } from "./delete-role.handler";
import { PermissionsGuard } from "../../../core/passport/permissions.guard";
import { Query, Controller, Delete, HttpStatus, Res, UseGuards } from "@nestjs/common";

@ApiTags('Roles')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/role`,
    version: '1',
})
export class DeleteRoleController {

    constructor(private readonly commandBus: CommandBus) { }

    @Delete('delete')
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiResponse({ status: 204, description: 'NO_CONTENT' })
    public async Delete(@Query('roleId') roleId: string, @Res() res: Response
    ): Promise<void> {

        await this.commandBus.execute(new DeleteRoleCommand({ roleId }));

        res.status(HttpStatus.NO_CONTENT).send(null);
    }
}