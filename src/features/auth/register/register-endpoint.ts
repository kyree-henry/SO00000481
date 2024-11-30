import { Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { UserModel } from "../../user/userModel";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommandBus } from "cqrs";
 import { Response} from "express";
import { RegisterCommand, RegisterModel } from "./register-handler";



@Controller({
    path: `/identity`,
    version: '1',
})
export class RegisterController {

    constructor(private readonly commandBus: CommandBus) { }

    @Post('register')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    public async register(@Body() request: RegisterModel, @Res() res: Response
    ): Promise<UserModel> {

        const result = await this.commandBus.execute(new RegisterCommand({
            model: request
        }));

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}