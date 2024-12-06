import { Response } from "express";
import { CommandBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateUserCommand, UpdateUserModel } from "./update-user.handler";
import { PermissionsGuard } from "../../../core/passport/permissions.guard";
import { Body, Controller, HttpStatus, Put, Res, UseGuards } from "@nestjs/common";

@ApiTags('Users')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/user`,
    version: '1',
})
export class UpdateUserController {

    constructor(private readonly commandBus: CommandBus) { }

    @Put()
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiResponse({ status: 204, description: 'NO_CONTENT' })
    public async Update(@Body() request: UpdateUserModel, @Res() res: Response
    ): Promise<void> {

        await this.commandBus.execute(new UpdateUserCommand({
            model: request
        }));

        res.status(HttpStatus.NO_CONTENT).send(null);

    }
}