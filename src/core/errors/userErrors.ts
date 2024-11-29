import { BadRequestError } from "./badRequestError";
import { NotFoundError } from "./notFoundError";

export class UserAlreadyExistsError extends BadRequestError {
    constructor(email: string, id: string = '') {
        const message = email
            ? `A user with the email "${email}" already exists.`
            : `A user with the ID "${id}" already exists.`;
        super(message);
        this.name = 'UserAlreadyExistsError';
    }
}

export class UserAlreadyInRoleError extends BadRequestError {
    constructor(email: string, id: string = '', roleName: string) {
        const message = email
            ? `The user with the email "${email}" is already assigned to the role "${roleName}".`
            : `The user with the ID "${id}" is already assigned to the role "${roleName}".`;
        super(message);
        this.name = 'UserAlreadyInRoleError';
    }
}

export class UserNotFoundError extends NotFoundError {
    constructor(email: string, id: string = '') {
        const message = email
            ? `No user found with the email "${email}".`
            : `No user found with the ID "${id}".`;
        super(message);
        this.name = 'UserAlreadyExistsError';
    }
}
