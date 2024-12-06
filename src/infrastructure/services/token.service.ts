import configs from '../../configs';
import { JwtService } from '@nestjs/jwt';
import { Globals } from '../../core/globals';
import { Inject, Injectable } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { JwtPayload } from '../../core/passport/jwtPayload';
import { ITokenService } from "../../core/services/itoken.service";
import { IRoleRepository } from "../../core/repositories/irole.repository";

@Injectable()
export class TokenService implements ITokenService {

    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
        private readonly jwtService: JwtService,
    ) { }

    public async generateJwtAsync(user: User): Promise<string> {
        const claims = await this.getClaimsAsync(user);
        return this.generateEncryptedToken(claims);
    }

    public async getPrincipalFromToken(token: string): Promise<JwtPayload> {
        try {
            const payload: JwtPayload = this.jwtService.decode(token);
            if (!payload) {
                throw new Error('Invalid token: Decoding failed');
            }
            return payload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    private generateEncryptedToken(claims: any): string {
        const token = this.jwtService.sign(claims, {
            secret: configs.jwt.secret,
            expiresIn: configs.jwt.accessTokenExpiration,
            issuer: configs.jwt.issuer,
            audience: configs.jwt.audience,
        });
        return token;
    }

    private async getClaimsAsync(user: User): Promise<any> {
        const roles = await this.roleRepository.getByUserAsync(user);
        const roleClaims = roles.map((role) => role.name);

        const permissionClaims = roles.flatMap((role) =>
            role.roleClaims.map((claim) => claim.claimValue)
        );

        const claims = {
            [Globals.ClaimTypes.UserId]: user.id,
            [Globals.ClaimTypes.Email]: user.email,
            [Globals.ClaimTypes.GivenName]: user.firstName,
            [Globals.ClaimTypes.FamilyName]: user.lastName,
            [Globals.ClaimTypes.FullName]: `${user.lastName} ${user.firstName}`,
            [Globals.ClaimTypes.UserType]: user.type,
            [Globals.ClaimTypes.Role]: roleClaims,
            [Globals.ClaimTypes.Permission]: permissionClaims,
        };

        return claims;
    }

}