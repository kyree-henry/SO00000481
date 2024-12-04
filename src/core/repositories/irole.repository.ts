import { Role } from "../../domain/entities/role.entity";
import { User } from "../../domain/entities/user.entity";
import { RoleClaim } from "../../domain/entities/roleClaim.entity";

export interface IRoleRepository {

    createAsync(role: Role): Promise<Role>;
    updateAsync(role: Role): Promise<void>;
    deleteAsync(role: Role): Promise<void>;
    
    getAsync(): Promise<Role[]>;
    getByUserAsync(user: User): Promise<Role[]>;
    getByIdAsync(roleId: string): Promise<Role | null>;
    getByNameAsync(roleName: string): Promise<Role | null>; 
}