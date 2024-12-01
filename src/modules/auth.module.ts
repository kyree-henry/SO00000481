import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { Role } from '../domain/entities/role';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/entities/user';
import { UserRole } from '../domain/entities/userRole';
import { RoleClaim } from '../domain/entities/roleClaim';
import { RefreshToken } from '../domain/entities/refreshToken';
import { LoginHandler } from '../features/auth/login/login-handler';
import { TokenService } from '../infrastructure/services/token.service';
import { LoginController } from '../features/auth/login/login-endpoint';
import { RegisterHandler } from '../features/auth/register/register-handler';
import { RoleRepository } from '../infrastructure/repositories/role.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { RegisterController } from '../features/auth/register/register-endpoint';
import { RefreshTokenHandler } from '../features/auth/refresh-token/refresh-token-handler';
import { RefreshTokenController } from '../features/auth/refresh-token/refresh-token-endpoint';
import { RefreshTokenRepository } from '../infrastructure/repositories/refreshToken.repository';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([RefreshToken, User, Role, RoleClaim, UserRole])],
    providers: [RegisterHandler, LoginHandler, RefreshTokenHandler, JwtService,
        {
            provide: 'ITokenService',
            useClass: TokenService,
        },
        {
            provide: 'IRoleRepository',
            useClass: RoleRepository,
        },
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        {
            provide: 'IRefreshTokenRepository',
            useClass: RefreshTokenRepository,
        }
    ],
    controllers: [RegisterController, LoginController, RefreshTokenController],
    exports: [ ],
})
export class AuthModule { }