import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Role } from "../../domain/entities/role.entity";
import { User } from "../../domain/entities/user.entity";
import { RoleAlreadyExistsException } from "../../core/errors/roleError";
import { IRoleRepository } from "../../core/repositories/irole.repository";
import { IUserRepository } from "../../core/repositories/iuser.repository";

@Injectable()
export class RoleRepository implements IRoleRepository {

    constructor(
        @InjectRepository(Role) private readonly roleContext: Repository<Role>,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository) {
    }
 
    public async createAsync(role: Role): Promise<Role> {
        if (await this.getRoleByNameAsync(role.name)) {
            throw new RoleAlreadyExistsException(role.name);
        }

        return await this.roleContext.save(role);
    }

    public async updateAsync(role: Role): Promise<void> {
        await this.roleContext.save(role);
    }

    public async deleteAsync(role: Role): Promise<void> {
        await this.roleContext.remove(role); 
    }

    public async getRoleByIdAsync(roleId: string): Promise<Role | null> {
        return await this.roleContext.findOne({ where: { id: roleId } });
    }

    public async getRoleByNameAsync(roleName: string): Promise<Role | null> {
        const normalizedName = roleName.toUpperCase();
        return await this.roleContext.findOne({ where: { normalizedName: normalizedName } });
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
}