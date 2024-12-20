import { Response } from "express";
import { UserModel } from "../user.model";
import { CommandBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserCommand, CreateUserModel } from "./create-user.handler";
import { PermissionsGuard } from "../../../core/passport/permissions.guard";
import { Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";

@ApiTags('Users')
@UseGuards(PermissionsGuard)
@Controller({
    path: `/user`,
    version: '1',
})
export class CreateUserController {

    constructor(private readonly commandBus: CommandBus) { }

    @Post()
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiResponse({ status: 201, description: 'CREATED' })
    public async Create(@Body() request: CreateUserModel, @Res() res: Response
    ): Promise<UserModel> {

        const result = await this.commandBus.execute(new CreateUserCommand({
            model: request
        }));

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}