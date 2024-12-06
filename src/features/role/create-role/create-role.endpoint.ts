import { Response } from "express";
import { CommandBus } from "@nestjs/cqrs";
import { RoleModel } from "../role.model";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateRoleCommand, CreateRoleModel } from "./create-role.handler";
import { PermissionsGuard } from "../../../core/passport/permissions.guard";
import { Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";

@ApiTags('Roles')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/role`,
    version: '1',
})
export class CreateRoleController {

    constructor(private readonly commandBus: CommandBus) { }

    @Post()
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiResponse({ status: 201, description: 'CREATED' })
    public async Create(@Body() request: CreateRoleModel, @Res() res: Response
    ): Promise<RoleModel> {

        const result = await this.commandBus.execute(new CreateRoleCommand({
            model: request
        }));

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}