import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from 'cqrs';
import { RefreshToken } from 'src/domain/entities/refreshToken';
import { Role } from 'src/domain/entities/role';
import { User } from 'src/domain/entities/user';
import { LoginController } from 'src/features/auth/login/login-endpoint';
import { LoginHandler } from 'src/features/auth/login/login-handler';
import { RefreshTokenController } from 'src/features/auth/refresh-token/refresh-token-endpoint';
import { RefreshTokenHandler } from 'src/features/auth/refresh-token/refresh-token-handler';
import { RegisterController } from 'src/features/auth/register/register-endpoint';
import { RegisterHandler } from 'src/features/auth/register/register-handler';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { TokenService } from 'src/infrastructure/services/token.service';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([RefreshToken, User, Role])],
    providers: [RegisterHandler, LoginHandler, RefreshTokenHandler,
        {
            provide: 'ITokenService',
            useClass: TokenService,
        },
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        }
    ],
    controllers: [RegisterController, LoginController, RefreshTokenController],
    exports: [JwtModule],
})
export class AuthModule { }