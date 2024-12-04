import { Injectable } from '@nestjs/common';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { PermissionsGuard } from '../../core/passport/permissions.guard';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';

@Injectable()
export class Permissions {
    constructor(
        private readonly reflector: Reflector,
        private readonly metadataScanner: MetadataScanner,
        private readonly discoveryService: DiscoveryService,
    ) { }

    discoverControllerPermissions(): string[] {
        const permissions: string[] = [];

        const controllers = this.discoveryService.getControllers();

        controllers.forEach(controllerWrapper => {
            const controller = controllerWrapper.instance;
            const controllerName = controller.constructor.name;

            const methods = this.metadataScanner.getAllMethodNames(controller);

            methods.map((method) => {
                const guards = this.reflector.get<Function[]>(GUARDS_METADATA, controller.constructor);

                if (guards?.flat().includes(PermissionsGuard)) {
                    permissions.push(`${controllerName}.${method}`);
                }
            });
        });

        console.log(permissions)
        return permissions;
    }
}
