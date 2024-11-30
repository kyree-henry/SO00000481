import { Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { UserModel } from "../userModel";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommandBus } from "cqrs";
import { CreateUserCommand, CreateUserModel } from "./create-user-handler";
import { Response } from "express";

@ApiTags('Users')
@UseGuards()
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
    public async createUser(@Body() request: CreateUserModel, @Res() res: Response
    ): Promise<UserModel> {

        const result = await this.commandBus.execute(new CreateUserCommand({
            model: request
        }));

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}