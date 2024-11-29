/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "./appError";

export class BadRequestError extends AppError {
    constructor(message: string, errors: any = {}) {
        super(message, 400, errors);
    }
 }