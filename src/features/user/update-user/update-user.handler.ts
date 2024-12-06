import * as Joi from "joi";
import { Inject } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "../../../domain/enums";
import { password } from "../../../core/utils/validation.util";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IUserRepository } from "../../../core/repositories/iuser.repository";
import { UserNotFoundException } from "../../../core/exceptions/user.exception";

export class UpdateUserModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    type: UserType;

    constructor(request: Partial<UpdateUserModel> = {}) {
        Object.assign(this, request);
    }
}

export class UpdateUserCommand {
    model: UpdateUserModel

    constructor(request: Partial<UpdateUserCommand> = {}) {
        Object.assign(this, request);
    }
}

const createUserValidations = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string().required(),
    type: Joi.string().valid(...Object.values(UserType)).required(),
});

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) { }

    public async execute(command: UpdateUserCommand): Promise<void> {

        await createUserValidations.validateAsync(command.model);

        let user = await this.userRepository.getUserByIdAsync(command.model.id)
            ?? (() => { throw new UserNotFoundException('', command.model.id) })();


        user.firstName = command.model.firstName;
        user.lastName = command.model.lastName;
        user.gender = command.model.gender;
        user.type = command.model.type;
        user.phoneNumber = command.model.phoneNumber;
        
        await this.userRepository.updateAsync(user);
    }
} 