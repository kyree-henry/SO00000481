import { RoleModel } from "../role.model";
import { CommandBus } from "@nestjs/cqrs";
import { GetRoleByIdQuery } from "./get-role-by-id.handler";
import { GetRoleByNameQuery } from "./get-role-by-name.handler";
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
export class GetRoleController {
    constructor(
        private readonly queryBus: CommandBus
    ) { }

    @Get('get-by-id')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    public async GetById(@Query('roleId') roleId: string): Promise<RoleModel> {

        const result = await this.queryBus.execute(new GetRoleByIdQuery({ roleId  }));

        return result;
    }
    
    @Get('get-by-name')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    public async GetByName(@Query('roleName') roleName: string): Promise<RoleModel> {

        const result = await this.queryBus.execute(new GetRoleByNameQuery({ roleName  }));

        return result;
    }
}