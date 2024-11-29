import { IQueryHandler, QueryHandler } from "cqrs";
import { UserModel } from "../userModel";
import Joi from "joi";
import { IUserRepository } from "src/core/repositories/interfaces/iuser.repository";
import { Inject } from "@nestjs/common";
import { UserNotFoundError } from "src/core/errors/userErrors";


export class GetUserQuery {
    userId: string;
    

    constructor(request: Partial<GetUserQuery> = {}) {
        Object.assign(this, request);
    }
}

const getUserQueryValidations = {
    params: Joi.object().keys({
        id: Joi.string().uuid().required()
    })
};


@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery, UserModel> {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) { }

    //@ts-ignore
    public async execute(query: GetUserQuery): Promise<UserModel> {
 
        await getUserQueryValidations.params.validateAsync(query);

        const user = await this.userRepository.getUserByIdAsync(query.userId);

        if (!user) {
            throw new UserNotFoundError(query.userId);
        }
 
        const result = new UserModel({
            // id: user.id,
            // firstName: user.firstName,
            // lastName: user.lastName,
            // email: user.email, 
            ...user,
            isEmailVerified: user.emailConfirmed,
        });

        return result;
    }
}  