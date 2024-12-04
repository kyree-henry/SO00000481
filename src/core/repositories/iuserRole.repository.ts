import { UserRole } from "../../domain/entities/userRole.entity";

export interface IUserRoleRepository {

    getByUserId(userId: string) : Promise<UserRole[]>;
    getByRoleId(roleId: string) : Promise<UserRole[]>;

    createAsync(userRole: UserRole): Promise<UserRole>;
    deleteAsync(userRole: UserRole) : Promise<UserRole>;

    getAsync(userId: string, roleId: string) : Promise<UserRole>;
}