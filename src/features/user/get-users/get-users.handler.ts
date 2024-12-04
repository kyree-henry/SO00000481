import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { UserModel } from "../user.model";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PagedResult } from "../../../domain/pagination/pagedResult";
import { IUserRepository } from "../../../core/repositories/iuser.repository";

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
    orderBy: Joi.string().valid('id', 'firstname', 'lastname' , 'email').default('id'),
    order: Joi.string().valid('ASC', 'DESC').default('ASC'),
    searchTerm: Joi.string().allow(null).optional()
});


@CommandHandler(GetUsersQuery)
export class GetUsersHandler implements ICommandHandler<GetUsersQuery> {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository) {
    }

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

        const users = usersEntity.map(userEntity => new UserModel(userEntity));

        return new PagedResult<UserModel[]>(users, total);
    }
} 