import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Role } from "../../domain/entities/role.entity";
import { User } from "../../domain/entities/user.entity";
import { IRoleRepository } from "../../core/repositories/irole.repository";
import { IUserRepository } from "../../core/repositories/iuser.repository";
import { RoleAlreadyExistsException } from "../../core/exceptions/role.exception";

@Injectable()
export class RoleRepository implements IRoleRepository {

    constructor(
        @InjectRepository(Role) private readonly roleContext: Repository<Role>,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository
    ) { }

    public async getAsync(): Promise<Role[]> {
        return await this.roleContext.find();
    }

    public async getByIdAsync(roleId: string): Promise<Role | null> {
        return await this.roleContext.findOne({ where: { id: roleId } });
    }

    public async getByNameAsync(roleName: string): Promise<Role | null> {
        const normalizedName = roleName.toUpperCase();
        return await this.roleContext.findOne(
            {
                where: { normalizedName: normalizedName },
                relations: ['roleClaims']
            });
    }

    public async getByUserAsync(user: User): Promise<Role[]> {
        const roleNames = await this.userRepository.getRolesAsync(user);

        if (roleNames.length === 0) {
            return [];
        }

        return await this.roleContext.find({
            where: { name: In(roleNames) },
            relations: ['roleClaims']
        });
    }

    public async createAsync(role: Role): Promise<Role> {
        if (await this.getByNameAsync(role.name)) {
            throw new RoleAlreadyExistsException(role.name);
        }

        return await this.roleContext.save(role);
    }

    public async updateAsync(role: Role): Promise<void> {
        await this.roleContext.update(role.id, role);
    }

    public async deleteAsync(role: Role): Promise<void> {
        await this.roleContext.remove(role);
    }
 
}