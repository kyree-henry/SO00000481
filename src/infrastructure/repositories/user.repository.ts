import bcrypt from 'bcrypt';
import { User } from "src/domain/entities/user";
import { IUserRepository } from "../../core/repositories/iuser.repository";
import { Inject, Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { UserAlreadyExistsException, UserAlreadyInRoleException } from "src/core/errors/userErrors";
import { UserRole } from 'src/domain/entities/userRole';
import { RoleNotFoundException } from 'src/core/errors/roleError';
import { IRoleRepository } from 'src/core/repositories/irole.repository';

@Injectable()
export class UserRepository implements IUserRepository {

    constructor(
        @InjectRepository(User) private readonly userContext: Repository<User>,
        @InjectRepository(UserRole) private readonly userRoleContext: Repository<UserRole>,
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository
    ) { }

    public async getAsync(): Promise<User[]> {
        return await this.userContext.find();
    }

    public async createAysnc(user: User, password: string): Promise<User> {

        if (await this.getUserByEmailAsync(user.email)) {
            throw new UserAlreadyExistsException(user.email);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.passwordHash = hashedPassword;
        }

        return await this.userContext.save(user);
    }

    public async updateAsync(user: User): Promise<void> {
        await this.userContext.update(user.id, user);
    }

    // TODO: Carry out checks before proceeding.
    public async deleteAsync(user: User): Promise<User> {
        
        return await this.userContext.remove(user);
    }

    public async getUserByIdAsync(id: string): Promise<User | null> {
        return await this.userContext.findOne({ where: { id } });
    }

    public async getUserByEmailAsync(email: string): Promise<User | null> {
        const normalizedEmail = email.toUpperCase();
        return await this.userContext.findOne({ where: { normalizedEmail } });
    }

    public async getEntries(
        page: number, 
        pageSize: number, 
        orderBy: string, 
        order: "ASC" | "DESC", 
        searchTerm?: string
    ): Promise<[User[], number]> {

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const queryBuilder: SelectQueryBuilder<User> = this.userContext
            .createQueryBuilder("user")
            .orderBy(`user.${orderBy}`, order)
            .skip(skip)
            .take(take);

        // Apply filter criteria to the query
        if (searchTerm) {
            queryBuilder.andWhere("user.email LIKE :email", { email: `%${searchTerm}%` });
        }

        return await queryBuilder.getManyAndCount();

    }

    public async checkPasswordAsync(user: User, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.passwordHash!);
    }

    public async getRolesAsync(user: User): Promise<string[]> {
        const userRoles = await this.userRoleContext.find({ where: { userId: user.id } });
        if (!userRoles || userRoles.length === 0) {
            return [];
        }

        const roleNames = await Promise.all(
            userRoles.map(async (userRole: UserRole) => {
                const role = await this.roleRepository.getRoleByIdAsync(userRole.roleId);
                return role?.name;
            })
        );

        return roleNames.filter(name => name !== null) as string[];
    }

    public async addToRoleAsync(user: User, roleName: string): Promise<UserRole | null> {

        if (await this.isInRoleAsync(user, roleName)) {
            throw new UserAlreadyInRoleException(user.email, '', roleName);
        }

        const role = await this.roleRepository.getRoleByNameAsync(roleName);
        const userRole = new UserRole({ 
            userId: user.id,
            roleId: role.id
         });

        return await this.userRoleContext.save(userRole); 
    }

    public async isInRoleAsync(user: User, roleName: string): Promise<UserRole | null> {
        
        const role = await this.roleRepository.getRoleByNameAsync(roleName) 
        ?? (() => { throw new RoleNotFoundException('', roleName); })();

        return await this.userRoleContext.findOne({ where: { userId: user.id, roleId: role?.id } }); 
    }
}