import { Response } from 'express';
import configs from '../../configs';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();

        const access_token = this.extractTokenFromHeader(request);

        if (!access_token) {
            throw new UnauthorizedException('Unauthorized: You need to log in to access this resource.');
        }

        let user;
        try {
            user = await this.jwtService.verifyAsync(access_token, {
                secret: configs.jwt.secret,
                issuer: configs.jwt.issuer,
                audience: configs.jwt.audience
            });

            request.user = user;

        } catch (error) {
            if (error instanceof TokenExpiredError) { 
                response.setHeader('Token-Expired', 'true');
            }
            console.log(error)
            throw new UnauthorizedException('Unauthorized: Invalid or expired token.');
        }

        const handler = context.getHandler();
        const controller = context.getClass();
        const requiredPermission = `${controller.name}.${handler.name}`;

        console.log(user)
        console.log(user.permissions)
        const hasPermission = user.permission?.some((permission: string) => requiredPermission.includes(permission));
        if (hasPermission) {
            return true;
        } else {
            throw new ForbiddenException('Forbidden: You do not have permission to access this resource.');
        }
    }

    private extractTokenFromHeader(request: any): string | null {
        const token = request.headers.authorization?.split(' ')[1];
        return token || null;
    }
} 