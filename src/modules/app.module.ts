import { MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap } from '@nestjs/common';
import { PassportModule, Type } from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import configs from '../configs';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { RouterModule } from '@nestjs/core';
import { DataSeeder } from '../infrastructure/services/data.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from 'src/infrastructure/persistence/data.source';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configs.jwt.secret,
      signOptions: { expiresIn: `${configs.jwt.accessTokenExpiration}m` },
    }),
    TypeOrmModule.forRoot(postgresOptions), 
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
  providers: [DataSeeder],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  constructor(
      private readonly dataSeeder: DataSeeder
  ) {}

  configure(consumer: MiddlewareConsumer) {
       
  }

  async onApplicationBootstrap(): Promise<void> {
      await this.dataSeeder.seedAsync();
  }
}
