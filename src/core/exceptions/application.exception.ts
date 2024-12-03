import { HttpStatus } from '@nestjs/common';

export class ApplicationException extends Error {

    statusCode: number;
    isOperational: boolean;
    errors: any;

    constructor(
        message: string | undefined,
        statusCode: number = HttpStatus.BAD_REQUEST,
        error: any = {}
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = error;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApplicationException; 