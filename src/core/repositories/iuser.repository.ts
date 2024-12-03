import { User } from "../../domain/entities/user.entity";
import { UserRole } from "../../domain/entities/userRole.entity";

export interface IUserRepository {

    getAsync(): Promise<User[]>;
    updateAsync(user: User): Promise<void>;
    deleteAsync(user: User): Promise<User>;
    getUserByIdAsync(id: string): Promise<User | null>;
    createAysnc(user: User, password: string): Promise<User>; 
    getUserByEmailAsync(email: string): Promise<User | null>; 
    checkPasswordAsync(user: User, password: string): Promise<boolean>;

    getRolesAsync(user: User): Promise<string[]>;
    isInRoleAsync(user: User, roleName: string): Promise<UserRole | null>;
    addToRoleAsync(user: User, roleName: string): Promise<UserRole | null>;
    
    getEntries(
        page: number,
        pageSize: number,
        orderBy: string,
        order: "ASC" | "DESC",
        searchTerm?: string
      ): Promise<[User[], number]>;
 
}