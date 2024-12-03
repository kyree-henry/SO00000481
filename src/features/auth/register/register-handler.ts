import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "../../../domain/enums";
import { UserModel } from "../../user/userModel";
import { password } from "../../../core/utils/validation";
import { User } from "../../../domain/entities/user.entity";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserAlreadyExistsException } from "../../../core/errors/userErrors";
import { IUserRepository } from "../../../core/repositories/iuser.repository";

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
 
 
        return new UserModel({ ...user }); 
    }
} 