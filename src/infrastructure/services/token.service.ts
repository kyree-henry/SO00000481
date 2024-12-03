import configs from '../../configs';
import { JwtService } from '@nestjs/jwt';
import { Globals } from '../../core/globals';
import { Inject, Injectable } from "@nestjs/common";
import { JwtPayload } from '../../core/utils/jwtPayload';
import { User } from "../../domain/entities/user.entity";
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
            const payload: JwtPayload = this.jwtService.verify(token, {
                secret: configs.jwt.secret,
                issuer: configs.jwt.issuer,
                audience: configs.jwt.audience
            }); 
            return payload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    private generateEncryptedToken(claims: any[]): string {
        const token = this.jwtService.sign(claims, {
            secret: configs.jwt.secret,
            expiresIn: configs.jwt.accessTokenExpiration,
            issuer: configs.jwt.issuer,
            audience: configs.jwt.audience,
        });
        return token;
    }

    private async getClaimsAsync(user: User): Promise<any[]> {
        const roles = await this.roleRepository.getByUserAsync(user);

        const roleClaims = roles.map((role) => ({
            name: Globals.ClaimTypes.Role,
            value: role.name,
        }));

        const permissionClaims = roles.flatMap((role) =>
            role.roleClaims.map((claim) => ({
                name: claim.claimType,
                value: claim.claimValue,
            })),
        );

        const claims = [
            { name: Globals.ClaimTypes.UserId, value: user.id },
            { name: Globals.ClaimTypes.Email, value: user.email },
            { name: Globals.ClaimTypes.GivenName, value: user.firstName },
            { name: Globals.ClaimTypes.FamilyName, value: user.lastName },
            { name: Globals.ClaimTypes.FullName, value: `${user.lastName} ${user.firstName}` },
            { name: Globals.ClaimTypes.UserType, value: user.type },
            ...roleClaims,
            ...permissionClaims,
        ];

        return claims;
    }

}