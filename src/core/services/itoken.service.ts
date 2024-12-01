import { User } from "src/domain/entities/user";
import { JwtPayload } from "../utils/jwtPayload";
  
  
export interface ITokenService { 
    generateJwtAsync(user: User): Promise<string>; 
    getPrincipalFromToken(token: string): Promise<JwtPayload>;   
}