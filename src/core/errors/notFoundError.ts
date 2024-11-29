/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "./appError";

export class NotFoundError extends AppError {
    constructor(message: string, errors: any = {}) {
        super(message, 404, errors);
    }
 }