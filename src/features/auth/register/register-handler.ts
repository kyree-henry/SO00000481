import { ApiProperty } from "@nestjs/swagger";
import { CommandHandler, ICommandHandler } from "cqrs";
import Joi from "joi";
import { password } from "src/core/utils/validation";
import { Inject } from "@nestjs/common";
import { UserModel } from "src/features/user/userModel";
import { IUserRepository } from "src/core/repositories/iuser.repository";
import { UserAlreadyExistsException } from "src/core/errors/userErrors";
import { User } from "src/domain/entities/user";
import { UserType } from "src/domain/enums";

export class RegisterModel {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    phoneNumber: string;

    constructor(request: Partial<RegisterModel> = {}) {
        Object.assign(this, request);
    }
}

export class RegisterCommand {
    model: RegisterModel

    constructor(request: Partial<RegisterCommand> = {}) {
        Object.assign(this, request);
    }
}

const createUserValidations = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().required()
});

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) { }

    public async execute(command: RegisterCommand): Promise<UserModel> {

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
                type: UserType.Guest,
            }), command.model.password);
 
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