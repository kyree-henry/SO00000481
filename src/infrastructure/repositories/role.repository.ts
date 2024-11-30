import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleAlreadyExistsException } from "src/core/errors/roleError";
import { IRoleRepository } from "src/core/repositories/irole.repository";
import { IUserRepository } from "src/core/repositories/iuser.repository";
import { Role } from "src/domain/entities/role";
import { User } from "src/domain/entities/user";
import { In, Repository } from "typeorm";

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