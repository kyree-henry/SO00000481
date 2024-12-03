import { User } from "../../domain/entities/user.entity";
import { JwtPayload } from "../passport/jwtPayload";
  
  
export interface ITokenService { 
    generateJwtAsync(user: User): Promise<string>; 
    getPrincipalFromToken(token: string): Promise<JwtPayload>;   
}