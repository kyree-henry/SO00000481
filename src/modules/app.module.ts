import configs from '../configs';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from "@nestjs/passport";
import { Role } from '../domain/entities/role.entity';
import { User } from '../domain/entities/user.entity';
import { UserRole } from '../domain/entities/userRole.entity';
import { RoleClaim } from '../domain/entities/roleClaim.entity';
import { DataSeeder } from '../infrastructure/services/data.seeder';
import { postgresOptions } from '../infrastructure/persistence/data.source';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { RoleRepository } from '../infrastructure/repositories/role.repository';
import { MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap } from '@nestjs/common';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configs.jwt.secret,
      signOptions: { expiresIn: configs.jwt.accessTokenExpiration },
    }),
    TypeOrmModule.forRoot(postgresOptions),
    TypeOrmModule.forFeature([User, Role, RoleClaim, UserRole]),
    UserModule,
    AuthModule,
    RouterModule.register([
      {
        path: '/',
        module: UserModule,
      },
      {
        path: '/',
        module: AuthModule,
      },
    ]),
  ],
  providers: [DataSeeder,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository,
    }
  ],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  constructor(
    private readonly dataSeeder: DataSeeder
  ) { }

  configure(consumer: MiddlewareConsumer) {
    
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.dataSeeder.initializeAsync();
  }
}
