import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreate1733242542827 implements MigrationInterface {
    name = 'InitialCreate1733242542827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedBy" character varying, "lastModifiedOn" TIMESTAMP DEFAULT now(), "lastRefreshed" TIMESTAMP NOT NULL, "userId" character varying NOT NULL, "roleId" character varying NOT NULL, CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_type_enum" AS ENUM('Admin', 'User', 'Guest')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedBy" character varying, "lastModifiedOn" TIMESTAMP DEFAULT now(), "lastRefreshed" TIMESTAMP NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "registeredOn" TIMESTAMP, "userName" character varying, "email" character varying NOT NULL, "gender" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "normalizedEmail" character varying, "emailConfirmed" boolean NOT NULL DEFAULT false, "passwordHash" character varying, "isLockedOut" boolean NOT NULL DEFAULT false, "lockoutEnd" TIMESTAMP, "accessFailedCount" integer NOT NULL DEFAULT '0', "type" "public"."user_type_enum" NOT NULL DEFAULT 'User', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_claim" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "claimType" character varying NOT NULL, "claimValue" character varying NOT NULL, CONSTRAINT "PK_5ff49a19789bb8f27f8e4091334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_type_enum" AS ENUM('System', 'Regular')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedBy" character varying, "lastModifiedOn" TIMESTAMP DEFAULT now(), "lastRefreshed" TIMESTAMP NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "normalizedName" character varying NOT NULL, "type" "public"."role_type_enum" NOT NULL DEFAULT 'Regular', CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jwt" character varying NOT NULL, "userId" character varying NOT NULL, "tokenValue" character varying NOT NULL, "userAgent" character varying NOT NULL, "ipAddress" character varying NOT NULL, "deviceId" character varying NOT NULL, "addedDateUtc" TIMESTAMP NOT NULL, "expiryDateUtc" TIMESTAMP NOT NULL, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "role_claim" ADD CONSTRAINT "FK_dc07e78748a2097fd55ac25b2fe" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_claim" DROP CONSTRAINT "FK_dc07e78748a2097fd55ac25b2fe"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_type_enum"`);
        await queryRunner.query(`DROP TABLE "role_claim"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
    }

}
