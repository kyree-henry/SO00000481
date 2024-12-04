import configs from '../../configs';
import { JwtPayload } from './jwtPayload';
import { Injectable } from '@nestjs/common';
import { Globals } from '../../core/globals';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configs.jwt.secret,
            ignoreExpiration: false,
            issuer: configs.jwt.issuer,
            audience: configs.jwt.audience,
        });
    }

    async validate(payload: JwtPayload) {
        const roles = payload.filter((claim: { name: string; }) => claim.name === Globals.ClaimTypes.Role);
        const permissions = payload.filter((claim: { name: string; }) => claim.name === Globals.ClaimTypes.Permission);

        return {
            userId: payload[Globals.ClaimTypes.UserId],
            fullname: payload[Globals.ClaimTypes.FullName],
            firstname: payload[Globals.ClaimTypes.GivenName],
            lastname: payload[Globals.ClaimTypes.FamilyName],
            roles: roles,
            permissions: permissions,
        };
    }
}
