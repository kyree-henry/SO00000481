import configs from '../configs';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user.module';
import { RoleModule } from './role.module';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from "@nestjs/passport";
import { Role } from '../domain/entities/role.entity';
import { User } from '../domain/entities/user.entity';
import { JwtStrategy } from '../core/passport/jwt.strategy';
import { Permissions } from '../core/utils/permissions.util';
import { UserRole } from '../domain/entities/userRole.entity';
import { RoleClaim } from '../domain/entities/roleClaim.entity';
import { DataSeeder } from '../infrastructure/services/data.seeder';
import { PermissionsGuard } from '../core/passport/permissions.guard';
import { postgresOptions } from '../infrastructure/persistence/data.source';
import { DiscoveryService, MetadataScanner, RouterModule } from '@nestjs/core';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { RoleRepository } from '../infrastructure/repositories/role.repository';
import { UserRoleRepository } from '../infrastructure/repositories/userRole.repository';
import { RoleClaimRepository } from '../infrastructure/repositories/roleClaim.repository';
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
    RoleModule,
    RouterModule.register([
      {
        path: '/',
        module: UserModule,
      },
      {
        path: '/',
        module: AuthModule,
      },
      {
        path: '/',
        module: RoleModule,
      },
    ]),
  ],
  providers: [JwtStrategy, PermissionsGuard, DataSeeder, Permissions, MetadataScanner, DiscoveryService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository,
    },
    {
      provide: 'IUserRoleRepository',
      useClass: UserRoleRepository,
    },
    {
      provide: 'IRoleClaimRepository',
      useClass: RoleClaimRepository,
    },
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