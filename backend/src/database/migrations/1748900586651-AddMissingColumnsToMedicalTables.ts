import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingColumnsToMedicalTables1748900586651 implements MigrationInterface {
    name = 'AddMissingColumnsToMedicalTables1748900586651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."prescriptions_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'DISCONTINUED', 'SUSPENDED')`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "status" "public"."prescriptions_status_enum" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "quantity" integer`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "unit" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ALTER COLUMN "availability_hours" SET DEFAULT '{
      "monday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "tuesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "wednesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "thursday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "friday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "saturday": {"start": "09:00", "end": "13:00", "isAvailable": false},
      "sunday": {"start": "09:00", "end": "13:00", "isAvailable": false}
    }'`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "frequency"`);
        await queryRunner.query(`CREATE TYPE "public"."prescriptions_frequency_enum" AS ENUM('ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'EVERY_6_HOURS', 'AS_NEEDED', 'WEEKLY', 'MONTHLY')`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "frequency" "public"."prescriptions_frequency_enum" NOT NULL DEFAULT 'TWICE_DAILY'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "frequency"`);
        await queryRunner.query(`DROP TYPE "public"."prescriptions_frequency_enum"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "frequency" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ALTER COLUMN "availability_hours" SET DEFAULT '{"friday": {"end": "17:00", "start": "09:00", "isAvailable": true}, "monday": {"end": "17:00", "start": "09:00", "isAvailable": true}, "sunday": {"end": "13:00", "start": "09:00", "isAvailable": false}, "tuesday": {"end": "17:00", "start": "09:00", "isAvailable": true}, "saturday": {"end": "13:00", "start": "09:00", "isAvailable": false}, "thursday": {"end": "17:00", "start": "09:00", "isAvailable": true}, "wednesday": {"end": "17:00", "start": "09:00", "isAvailable": true}}'`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."prescriptions_status_enum"`);
    }

}
