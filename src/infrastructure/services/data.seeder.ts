import configs from '../../configs';
import { Globals } from '../../core/globals';
import { Injectable, Inject } from '@nestjs/common';
import { RoleType, UserType } from '../../domain/enums';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import { Permissions } from '../../core/utils/permissions.util'; 
import { RoleClaim } from '../../domain/entities/roleClaim.entity';
import { IUserRepository } from '../../core/repositories/iuser.repository';
import { IRoleRepository } from '../../core/repositories/irole.repository';
import { IRoleClaimRepository } from '../../core/repositories/iroleClaim.repository';

@Injectable()
export class DataSeeder {
    constructor(
        private readonly permissions: Permissions, 
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository, 
        @Inject('IRoleClaimRepository') private readonly roleClaimRepository: IRoleClaimRepository, 
    ) { }

    async initializeAsync(): Promise<void> {
        await this.addAdministratorUserAndRoleAsync();

        if (configs.env === 'development') {

            await this.addGuestUserAsync();
        }
    }

    private async addAdministratorUserAndRoleAsync(): Promise<void> {

        await this.addAdministratorRoleAsync();

        const SYSTEM_ADMIN = new User({
            firstName: 'System',
            lastName: 'Admin',
            email: 'systemadmin@basicstore.com',
            emailConfirmed: true,
            type: UserType.Admin,
            createdBy: 'systemadmin@basicstore.com',
        });

        if (!(await this.userRepository.getUserByEmailAsync(SYSTEM_ADMIN.email))) {

            await this.userRepository.createAsync(SYSTEM_ADMIN, "@Admin@123");

            await this.userRepository.addToRoleAsync(SYSTEM_ADMIN, Globals.Roles.Admin);
        }
    }

    private async addGuestUserAsync(): Promise<void> {

        const JOHN_DOE = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@basicstore.com',
            emailConfirmed: true,
            createdBy: 'systemadmin@basicstore.com',
        });

        if (!(await this.userRepository.getUserByEmailAsync(JOHN_DOE.email))) {
            await this.userRepository.createAsync(JOHN_DOE, "@Abc@123");
        }
    }

    private async addAdministratorRoleAsync() {

        let adminRoleInDb = await this.roleRepository.getByNameAsync(Globals.Roles.Admin);

        if (!adminRoleInDb) {
            adminRoleInDb = await this.roleRepository.createAsync(new Role({
                name: "Admin",
                type: RoleType.System,
                createdBy:'systemadmin@basicstore.com',
                description: "Administrator role with full permissions",
            }));
        }
 
        /// TODO: add all system permissions to this role.
        this.permissions.discoverControllerPermissions().map(async (permission) => {
            const hasClaim = adminRoleInDb.roleClaims?.some(claim => claim.claimValue === permission);
            if (!hasClaim) {
                await this.roleClaimRepository.createAsync(new RoleClaim({
                    claimValue: permission,
                    roleId: adminRoleInDb.id,
                    claimType: Globals.ClaimTypes.Permission
                }));
            } 
        });

    }
} 