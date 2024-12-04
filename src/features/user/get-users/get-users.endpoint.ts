import { UserModel } from "../user.model";
import { CommandBus } from "@nestjs/cqrs";
import { GetUsersQuery } from "./get-users.handler";
import { Controller, Get, Query } from "@nestjs/common";
import { PagedResult } from "domain/pagination/pagedResult";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Users')
@Controller({
    path: `/user`,
    version: '1',
})
export class GetUsersController {

    constructor(private readonly queryBus: CommandBus) {
    }

    @Get('getentries')
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
    @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
    @ApiResponse({ status: 403, description: 'FORBIDDEN' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'order', required: false, type: 'ASC', example: 'ASC' })
    @ApiQuery({ name: 'orderBy', required: false, type: '', example: 'id' })
    @ApiQuery({ name: 'searchTerm', required: false, type: '' })
    public async GetEntries(
        @Query('pageSize') pageSize: number = 10,
        @Query('page') page: number = 1,
        @Query('order') order: 'ASC' | 'DESC' = 'ASC',
        @Query('orderBy') orderBy: string = 'id',
        @Query('searchTerm') searchTerm?: string
    ): Promise<PagedResult<UserModel[]>> {
        const result = await this.queryBus.execute(new GetUsersQuery({
            page: page,
            pageSize: pageSize,
            searchTerm: searchTerm,
            order: order,
            orderBy: orderBy
        }));
        
         return result;
    }
}