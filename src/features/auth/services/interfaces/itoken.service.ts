import { User } from "src/domain/entities/user";
  
  
export interface ITokenService { 
    generateJwtAsync(user: User): Promise<string>;    
}