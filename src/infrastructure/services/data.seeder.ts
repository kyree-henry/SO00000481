import configs from '../../configs';
import { Globals } from '../../core/globals';
import { RoleType } from '../../domain/enums';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../core/repositories/iuser.repository';
import { IRoleRepository } from '../../core/repositories/irole.repository';

@Injectable()
export class DataSeeder {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
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
            createdBy: 'systemadmin@basicstore.com',
        });

        if (!(await this.userRepository.getUserByEmailAsync(SYSTEM_ADMIN.email))) {

            await this.userRepository.createAysnc(SYSTEM_ADMIN, "@Admin@123");

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
            await this.userRepository.createAysnc(JOHN_DOE, "@Abc@123");
        }
    }

    private async addAdministratorRoleAsync() {

        let adminRoleInDb = await this.roleRepository.getRoleByNameAsync(Globals.Roles.Admin);

        if (!adminRoleInDb) {
            adminRoleInDb = await this.roleRepository.createAsync(new Role({
                name: "Admin",
                type: RoleType.System,
                description: "Administrator role with full permissions",
            }));
        }

        /// TODO: add all system permissions to this role.
    }
} 