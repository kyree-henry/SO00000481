import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "cqrs";
import { LoginCommand, TokenRequestModel } from "./login-handler";
import { TokenResponseModel } from "../tokenResponseModel";
 
@ApiBearerAuth()
@ApiTags('Identities')
@Controller({
    path: `/identity`,
    version: '1',
})
export class LoginController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('login')
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    public async login(@Body() request: TokenRequestModel): Promise<TokenResponseModel> {

        const result = await this.commandBus.execute(new LoginCommand({ model: request }));

        return result;
    }
}