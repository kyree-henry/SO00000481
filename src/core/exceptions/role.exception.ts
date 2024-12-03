import {
    BadRequestException,
    ConflictException,
      NotFoundException,
} from '@nestjs/common';

export class RoleAlreadyExistsException extends ConflictException {
    constructor(roleName: string) {
        super(`A role with the name "${roleName}" already exists.`);
        this.name = 'RoleAlreadyExistsException';
    }
}

export class RoleNotFoundException extends NotFoundException {
    constructor(name: string, id: string = '') {
        if (name) {
            super(`Role with name ${name} could not be found!`);
        } else {
            super(`Role with id ${id} could not be found!`);
        }

        this.name = 'RoleNotFoundException';
    }
}