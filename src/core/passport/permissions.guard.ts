import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
  
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor( ) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('Unauthorized: You need to log in to access this resource.');
        }

        const handler = context.getHandler();
        const controller = context.getClass();
        const requiredPermission = `${controller.name}.${handler.name}`;

        const hasPermission = user.permissions.some((permission: string) => requiredPermission.includes(permission));
        if (hasPermission) {
            return true;
        } else {
            throw new ForbiddenException('Forbidden: You do not have permission to access this resource.');
        }
    }
} 