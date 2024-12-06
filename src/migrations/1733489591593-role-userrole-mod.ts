import { MigrationInterface, QueryRunner } from "typeorm";

export class RoleUserroleMod1733489591593 implements MigrationInterface {
    name = 'RoleUserroleMod1733489591593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" ADD "isDisabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "disabledUntil" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "role" ADD "isDisabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "disabledUntil" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "disabledUntil"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "isDisabled"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "disabledUntil"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "isDisabled"`);
    }

}
