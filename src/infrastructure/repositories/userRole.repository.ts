import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "../../domain/entities/userRole.entity";
import { IUserRoleRepository } from "../../core/repositories/iuserRole.repository";

export class UserRoleRepository implements IUserRoleRepository {

    constructor(
        @InjectRepository(UserRole) private readonly userRoleContext: Repository<UserRole>
    ){ }
     
    public async createAsync(userRole: UserRole) : Promise<UserRole> {
        return await this.userRoleContext.save(userRole);
    }

    public async getAsync(userId: string, roleId: string) : Promise<UserRole> { 
        return await this.userRoleContext.findOne({ where: { userId, roleId } });
    }

    public async getByUserId(userId: string) : Promise<UserRole[]> {
        return await this.userRoleContext.find({ where: { userId } });
    }
 
    public async getByRoleId(roleId: string) : Promise<UserRole[]> {
        return await this.userRoleContext.find({ where: { roleId } });
    }
 
    public async deleteAsync(userRole: UserRole) : Promise<UserRole> {
        return await this.userRoleContext.remove(userRole);
    }
}