import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { UserModel } from "../userModel";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserNotFoundException } from "../../../core/errors/userErrors";
import { IUserRepository } from "../../../core/repositories/iuser.repository";


export class GetUserQuery {
    userId: string;
    

    constructor(request: Partial<GetUserQuery> = {}) {
        Object.assign(this, request);
    }
}

const getUserQueryValidations = {
    params: Joi.object().keys({
        userId: Joi.string().required()
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
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            isEmailVerified: user.emailConfirmed,
        });

        return result;
    }
}  