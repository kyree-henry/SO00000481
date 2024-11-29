import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "cqrs";
import Joi from "joi";
import { PagedResult } from "src/domain/pagination/pagedResult";
import { UserModel } from "../userModel";
import { IUserRepository } from "src/core/repositories/interfaces/iuser.repository";

export class GetUsersQuery {
    page = 1;
    pageSize = 10;
    orderBy = 'id';
    order: 'ASC' | 'DESC' = 'ASC';
    searchTerm?: string = null;

    constructor(request: Partial<GetUsersQuery> = {}) {
        Object.assign(this, request);
    }
}

const getUsersValidations = Joi.object<GetUsersQuery>({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).default(10),
    orderBy: Joi.string().valid('id', 'name', 'email').default('id'),
    order: Joi.string().valid('ASC', 'DESC').default('ASC'),
    searchTerm: Joi.string().allow(null).optional()
});


@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository) {
    }

    //@ts-ignore 
    async execute(command: GetUsersQuery): Promise<PagedResult<UserModel[]>> {
        await getUsersValidations.validateAsync(command);

        const [usersEntity, total] = await this.userRepository.getEntries(
            command.page,
            command.pageSize,
            command.orderBy,
            command.order,
            command.searchTerm
        );

        if (usersEntity?.length == 0) return new PagedResult<UserModel[]>(null, total);

        // const result = usersEntity.map((user) => mapper.map<User, UserDto>(user, new UserDto()));

        return new PagedResult<UserModel[]>(null, total);
    }
} 