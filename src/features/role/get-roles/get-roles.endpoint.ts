import { RoleModel } from "../role.model";
import { CommandBus } from "@nestjs/cqrs";
import { GetRolesQuery } from "./get-roles.handler";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PermissionsGuard } from "../../../core/passport/permissions.guard";

@ApiBearerAuth()
@ApiTags('Roles')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/roles`,
    version: '1',
})
export class GetRolesController {
    constructor(
        private readonly queryBus: CommandBus
    ) { }

    @Get()
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    public async GetAll(): Promise<RoleModel[]> {

        const result = await this.queryBus.execute(new GetRolesQuery());

        return result;
    }
}