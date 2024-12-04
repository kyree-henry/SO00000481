import { CommandBus } from "@nestjs/cqrs";
import { Body, Controller, Post } from "@nestjs/common";
import { TokenResponseModel } from "../tokenResponse.model";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RefreshTokenCommand, RefreshTokenRequestModel } from "./refresh-token.handler";

@ApiBearerAuth()
@ApiTags('Token')
@Controller({
    path: `/token`,
    version: '1',
})
export class RefreshTokenController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('refresh-access-token')
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 200, description: 'OK'})
    public async RefreshAccessToken(@Body() request: RefreshTokenRequestModel): Promise<TokenResponseModel> {

        const result = await this.commandBus.execute(new RefreshTokenCommand({
            model: request
        }));

        return result;
    }
} 