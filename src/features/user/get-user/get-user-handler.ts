import { CommandHandler, ICommandHandler } from "cqrs";
import { UserModel } from "../userModel";
import Joi from "joi";
import { IUserRepository } from "src/core/repositories/iuser.repository";
import { Inject } from "@nestjs/common";
import { UserNotFoundException } from "src/core/errors/userErrors";


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


@CommandHandler(GetUserQuery)
export class GetUserHandler implements ICommandHandler<GetUserQuery> {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) { }

     public async execute(query: GetUserQuery): Promise<UserModel> {
 
        await getUserQueryValidations.params.validateAsync(query);

        const user = await this.userRepository.getUserByIdAsync(query.userId);

        if (!user) {
            throw new UserNotFoundException(query.userId);
        }
 
        const result = new UserModel({ 
            ...user,
            isEmailVerified: user.emailConfirmed,
        });

        return result;
    }
}  