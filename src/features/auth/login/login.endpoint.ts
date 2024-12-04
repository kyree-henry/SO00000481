import { CommandBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post } from "@nestjs/common";
import { TokenResponseModel } from "../tokenResponse.model";
import { LoginCommand, TokenRequestModel } from "./login.handler";
  
@ApiTags('Token')
@Controller({
    path: `/token`,
    version: '1',
})
export class LoginController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('get-access-token')
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    public async GetAccessToken(@Body() request: TokenRequestModel): Promise<TokenResponseModel> {

        const result = await this.commandBus.execute(new LoginCommand({ model: request }));

        return result;
    }
}