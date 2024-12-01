import { CqrsModule } from "cqrs";
import {Module} from '@nestjs/common'; 
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/domain/entities/role";
import { User } from "src/domain/entities/user";
import { CreateUserController } from "src/features/user/create-user/create-user-endpoint";
import { CreateUserHandler } from "src/features/user/create-user/create-user-handler";
import { GetUserController } from "src/features/user/get-user/get-user-endpoint";
import { GetUserHandler } from "src/features/user/get-user/get-user-handler";
import { GetUsersController } from "src/features/user/get-users/get-users-endpoint";
import { GetUsersHandler } from "src/features/user/get-users/get-users-handler";
import { UserRepository } from "src/infrastructure/repositories/user.repository";

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([User, Role])],
    controllers: [CreateUserController, GetUsersController, GetUserController],
    providers: [CreateUserHandler, GetUsersHandler, GetUserHandler,
      {
        provide: 'IUserRepository',
        useClass: UserRepository,
      } 
      ],
    exports: [],
  })
  
  export class UserModule {}