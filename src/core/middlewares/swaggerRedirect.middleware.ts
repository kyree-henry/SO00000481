import configs from '../../configs';
import { Request, Response, NextFunction } from 'express';

export function SwaggerRedirectMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const isDevelopment = configs.env === 'development';

    if (req.originalUrl === '/' || req.originalUrl.includes('favicon.ico')) {
        if (isDevelopment) {
            return res.redirect('/swagger');
        } else {
            return res.send(configs.projectName);
        }
    }

    return next();
}