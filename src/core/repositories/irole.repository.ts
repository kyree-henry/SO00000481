import { Role } from "../../domain/entities/role";
import { User } from "../../domain/entities/user";

export interface IRoleRepository {

    createAsync(role: Role): Promise<Role>;
    updateAsync(role: Role): Promise<void>;
    deleteAsync(role: Role): Promise<void>;
    
    getByUserAsync(user: User): Promise<Role[]>;

    getRoleByIdAsync(roleId: string): Promise<Role | null>;
    getRoleByNameAsync(roleName: string): Promise<Role | null>;

}