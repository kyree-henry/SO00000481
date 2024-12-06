import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../domain/entities/role.entity";
import { User } from "../domain/entities/user.entity";
import { Permissions } from '../core/utils/permissions.util';
import { UserRole } from "../domain/entities/userRole.entity";
import { RoleClaim } from "../domain/entities/roleClaim.entity";
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { GetRolesHandler } from "../features/role/get-roles/get-roles.handler";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { RoleRepository } from '../infrastructure/repositories/role.repository';
import { GetRoleController } from "../features/role/get-role/get-role.endpoint";
import { GetRolesController } from "../features/role/get-roles/get-roles.endpoint";
import { CreateRoleHandler } from "../features/role/create-role/create-role.handler";
import { UpdateRoleHandler } from '../features/role/update-role/update-role.handler';
import { GetRoleByIdHandler } from "../features/role/get-role/get-role-by-id.handler";
import { UserRoleRepository } from '../infrastructure/repositories/userRole.repository';
import { CreateRoleController } from "../features/role/create-role/create-role.endpoint";
import { UpdateRoleController } from '../features/role/update-role/update-role.endpoint';
import { RoleClaimRepository } from '../infrastructure/repositories/roleClaim.repository';
import { GetRoleByNameHandler } from "../features/role/get-role/get-role-by-name.handler";
import { GetPermissionsHandler } from '../features/role/get-permissions/get-permissions.handler';
import { GetPermissionsController } from '../features/role/get-permissions/get-permissions.endpoint';
import { UpdatePermissionsHandler } from '../features/role/update-permissions/update-permissions.handler';
import { UpdatePermissionsController } from '../features/role/update-permissions/update-permissions.endpoint';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([User, Role, RoleClaim, UserRole])],
    controllers: [
        CreateRoleController,
        GetRolesController,
        GetRoleController,
        UpdateRoleController,
        GetPermissionsController,
        UpdatePermissionsController
    ],
    providers: [CreateRoleHandler,
        GetRolesHandler,
        GetRoleByIdHandler,
        GetRoleByNameHandler,
        UpdateRoleHandler,
        GetPermissionsHandler,
        UpdatePermissionsHandler,
        Permissions,
        JwtService,
        MetadataScanner,
        DiscoveryService,
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        {
            provide: 'IRoleRepository',
            useClass: RoleRepository,
        },
        {
            provide: 'IUserRoleRepository',
            useClass: UserRoleRepository,
        },
        {
            provide: 'IRoleClaimRepository',
            useClass: RoleClaimRepository,
        },
    ],
    exports: [],
})

export class RoleModule { }