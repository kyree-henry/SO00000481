import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../core/repositories/iuser.repository';
import { User } from '../../domain/entities/user';

@Injectable()
export class DataSeeder {
    constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {
    }

    async seedAsync(): Promise<void> {
        await this.seedUser();
    }

    private async seedUser(): Promise<void> {

        const SYSTEM_ADMIN = new User({
            firstName: 'System',
            lastName: 'Admin',
            email: 'systemadmin@basicstore.com',
            emailConfirmed: true,
            createdBy: 'systemadmin@basicstore.com',
        });

        if (!(await this.userRepository.getUserByEmailAsync(SYSTEM_ADMIN.email))) {
            await this.userRepository.createAysnc(SYSTEM_ADMIN, "@Admin@123");
        }
    }
} 