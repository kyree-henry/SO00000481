import { CommandBus } from "@nestjs/cqrs";
import { PermissionModel } from "../role.model";
import { GetPermissionsQuery } from "./get-permissions.handler";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PermissionsGuard } from "../../../core/passport/permissions.guard";

@ApiBearerAuth()
@ApiTags('Roles')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/role`,
    version: '1',
})
export class GetPermissionsController {
    constructor(
        private readonly queryBus: CommandBus
    ) { }

    @Get('get-permissions')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    public async GetPermissions(@Query('roleId') roleId: string): Promise<PermissionModel> {

        const result = await this.queryBus.execute(new GetPermissionsQuery({ roleId }));

        return result;
    }
}