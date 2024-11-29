import { JwtService } from '@nestjs/jwt';
import { User } from "src/domain/entities/user";
import { Inject, Injectable } from "@nestjs/common";
import { ITokenService } from "./interfaces/itoken.service";
import { IRoleRepository } from "src/core/repositories/interfaces/irole.repository";

@Injectable()
export class TokenService implements ITokenService {

    constructor(
        @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
        private readonly jwtService: JwtService,
    ) { }

    public async generateJwtAsync(user: User): Promise<string> {
        const claims = await this.getClaimsAsync(user);

        const signingCredentials = this.getSigningCredentials();

        return this.generateEncryptedToken(signingCredentials, claims);
    }

    private async getClaimsAsync(user: User): Promise<any[]> {
        const roles = await this.roleRepository.getByUserAsync(user);

        const roleClaims = roles.map((role) => ({
            name: 'role',
            value: role.name,
        }));

        const permissionClaims = roles.flatMap((role) =>
            role.roleClaims.map((claim) => ({
                name: claim.claimType,
                value: claim.claimValue,
            })),
        );

        const claims = [
            { name: 'sub', value: user.id.toString() },
            { name: 'email', value: user.email },
            { name: 'firstName', value: user.firstName },
            { name: 'lastName', value: user.lastName },
            { name: 'fullName', value: `${user.lastName} ${user.firstName}` },
            { name: 'accountType', value: user.type },
            ...roleClaims,
            ...permissionClaims,
        ];

        return claims;
    }

    private getSigningCredentials(): any {
        return { secret: 'yourSecretKey' };
    }

    private generateEncryptedToken(signingCredentials: any, claims: any[]): string {
        const token = this.jwtService.sign(claims, {
            secret: 'yourSecretKey',
            expiresIn: '1h',
            issuer: 'yourIssuer',
            audience: 'yourAudience',
        });
        return token;
    }

}