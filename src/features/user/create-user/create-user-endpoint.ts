import { Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { UserModel } from "../userModel";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommandBus } from "cqrs";
import { CreateUserCommand } from "./create-user-handler";
import { UserType } from "src/domain/enums";
import { Response} from "express";


export class CreateUserRequestModel {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    type: UserType;

    constructor(request: Partial<CreateUserRequestModel> = {}) {
        Object.assign(this, request);
    }
}

@ApiTags('Users')
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
    public async createUser(@Body() request: CreateUserRequestModel, @Res() res: Response
    ): Promise<UserModel> {

        const result = await this.commandBus.execute(new CreateUserCommand({
            model: request
        }));

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}