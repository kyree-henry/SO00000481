import { User } from "src/domain/entities/user";
import { UserRole } from "src/domain/entities/userRole";
import { IUserRepository } from "../interfaces/iuser.repository";

export class CachedUserService implements IUserRepository {

    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) { }

    getAsync(): Promise<User[]> {



        throw new Error("Method not implemented.");
    }

    updateAsync(user: User): Promise<void> {
        throw new Error("Method not implemented.");

    }

    deleteAsync(user: User): Promise<User> {
        
        

        return this.userRepository.deleteAsync(user);
    }

    getUserByIdAsync(id: string): Promise<User | null> {

        throw new Error("Method not implemented.");

    }

    createAysnc(user: User, password: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    getUserByEmailAsync(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    checkPasswordAsync(user: User, password: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getRolesAsync(user: User): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

    isInRoleAsync(user: User, roleName: string): Promise<UserRole | null> {
        throw new Error("Method not implemented.");
    }

    addToRoleAsync(user: User, roleName: string): Promise<UserRole | null> {
        throw new Error("Method not implemented.");
    }
    
    getEntries(page: number, pageSize: number, orderBy: string, order: "ASC" | "DESC", searchTerm?: string): Promise<[User[], number]> {
        throw new Error("Method not implemented.");
    }
    
 
}

function Inject(arg0: string): (target: typeof CachedUserService, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error("Function not implemented.");
}
