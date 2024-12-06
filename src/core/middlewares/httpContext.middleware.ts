import {IncomingHttpHeaders} from "http";
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class HttpContext {
  static request: Request;
  static response: Response;
  static headers: IncomingHttpHeaders;
}


export class HttpContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

      HttpContext.request = req;

      HttpContext.response = res;

      HttpContext.headers = req.headers;

      next();
  }
} 