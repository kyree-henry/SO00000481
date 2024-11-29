/* eslint-disable @typescript-eslint/no-explicit-any */
export class AppError extends Error {

    statusCode: number;
    isOperational: boolean;
    errors: any;

    constructor(message: string, statusCode: number, error: any = {}) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = error;
        Error.captureStackTrace(this, this.constructor);
    }
}