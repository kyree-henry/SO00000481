 import {
     BadRequestException,
     ConflictException,
       NotFoundException,
 } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
    constructor(email: string, id: string = '') {
        const message = email
            ? `A user with the email "${email}" already exists.`
            : `A user with the ID "${id}" already exists.`;
        super(message);
        this.name = 'UserAlreadyExistsException';
    }
}

export class UserAlreadyInRoleException extends ConflictException {
    constructor(email: string, id: string = '', roleName: string) {
        const message = email
            ? `The user with the email "${email}" is already assigned to the role "${roleName}".`
            : `The user with the ID "${id}" is already assigned to the role "${roleName}".`;
        super(message);
        this.name = 'UserAlreadyInRoleException';
    }
}

export class UserNotFoundException extends NotFoundException {
    constructor(email: string, id: string = '') {
        const message = email
            ? `No user found with the email "${email}".`
            : `No user found with the ID "${id}".`;
        super(message);
        this.name = 'UserNotFoundException';
    }
} 