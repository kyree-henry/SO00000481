import Joi from "joi";
import { BadRequestError } from "../errors/badRequestError";

export const password: Joi.CustomValidator<string> = (value) => {
    if (value.length < 8) {
        throw new BadRequestError('password must be at least 8 characters');
    }
    
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new BadRequestError('password must contain at least 1 letter and 1 number');
    }
    return value;
};