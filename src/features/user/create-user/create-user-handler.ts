import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { UserModel } from "../userModel";
import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "../../../domain/enums";
import { User } from "../../../domain/entities/user.entity";
import { password } from "../../../core/utils/validation";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserAlreadyExistsException } from "../../../core/errors/userErrors";
import { IUserRepository } from "../../../core/repositories/iuser.repository";

export class CreateUserModel {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    type: UserType;

    constructor(request: Partial<CreateUserModel> = {}) {
        Object.assign(this, request);
    }
}

export class CreateUserCommand {
    model: CreateUserModel

    constructor(request: Partial<CreateUserCommand> = {}) {
        Object.assign(this, request);
    }
}

const createUserValidations = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
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
            throw new UserAlreadyExistsException(command.model.email);
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