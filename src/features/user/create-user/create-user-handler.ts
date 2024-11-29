import Joi from "joi";
import { Inject } from "@nestjs/common";
import { UserModel } from "../userModel";
import { UserType } from "src/domain/enums";
import { User } from "src/domain/entities/user";
import { CommandHandler, ICommandHandler } from "cqrs";
import { password } from "src/core/utills/validation-password";
import { CreateUserRequestModel } from "./create-user-endpoint";
import { UserAlreadyExistsError } from "src/core/errors/userErrors";
import { IUserRepository } from "src/core/repositories/interfaces/iuser.repository";
 
export class CreateUserCommand {
    model: CreateUserRequestModel

    constructor(request: Partial<CreateUserCommand> = {}) {
        Object.assign(this, request);
    }
}

const createUserValidations = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    passportNumber: Joi.string().required(),
    type: Joi.string().valid(...Object.values(UserType)).required(),
    role: Joi.string().required()
});

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserModel> {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) { }

    public async execute(command: CreateUserCommand): Promise<UserModel> {
 
        await createUserValidations.validateAsync(command.model);

        const existUser = await this.userRepository.getUserByEmailAsync(command.model.email);

        if (existUser) {
            throw new UserAlreadyExistsError(command.model.email);
        }

        const user = await this.userRepository.createAysnc(
            new User({
                firstName: command.model.firstName,
                lastName: command.model.lastName,
                email: command.model.email,
            }), command.model.password);

        await this.userRepository.addToRoleAsync(user, command.model.role)

        const result = new UserModel({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isEmailVerified: user.emailConfirmed,
        });

        return result;
    }
} 