import { UserModel } from "../userModel";
import { CommandBus } from "@nestjs/cqrs";
import { GetUserQuery } from "./get-user-handler";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards()
@Controller({
    path: `/user`,
    version: '1',
})
export class GetUserController {
    constructor(
        private readonly queryBus: CommandBus
    ) { }

    @Get()
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    public async getUser(@Query('id') id: string): Promise<UserModel> {

        const result = await this.queryBus.execute(new GetUserQuery({
            userId: id
        }));

        return result;
    }
}