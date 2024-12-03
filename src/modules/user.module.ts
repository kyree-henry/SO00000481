import { Module } from '@nestjs/common';
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../domain/entities/role.entity";
import { User } from "../domain/entities/user.entity";
import { UserRole } from "../domain/entities/userRole.entity";
import { RoleClaim } from "../domain/entities/roleClaim.entity";
import { GetUserHandler } from "../features/user/get-user/get-user-handler";
import { GetUsersHandler } from "../features/user/get-users/get-users-handler";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { RoleRepository } from '../infrastructure/repositories/role.repository';
import { GetUserController } from "../features/user/get-user/get-user-endpoint";
import { GetUsersController } from "../features/user/get-users/get-users-endpoint";
import { CreateUserHandler } from "../features/user/create-user/create-user-handler";
import { CreateUserController } from "../features/user/create-user/create-user-endpoint";

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Role, RoleClaim, UserRole])],
  controllers: [CreateUserController, GetUsersController, GetUserController],
  providers: [CreateUserHandler, GetUsersHandler, GetUserHandler,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository,
    }
  ],
  exports: [],
})

export class UserModule { }