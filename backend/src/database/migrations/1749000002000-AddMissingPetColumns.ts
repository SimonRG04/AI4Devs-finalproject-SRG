import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingPetColumns1749000002000 implements MigrationInterface {
    name = 'AddMissingPetColumns1749000002000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar y añadir columnas faltantes en la tabla pets
        const hasMedicalAlertsColumn = await queryRunner.hasColumn("pets", "medical_alerts");
        if (!hasMedicalAlertsColumn) {
            await queryRunner.query(`ALTER TABLE "pets" ADD "medical_alerts" text`);
        }

        const hasPhotoUrlColumn = await queryRunner.hasColumn("pets", "photo_url");
        if (!hasPhotoUrlColumn) {
            await queryRunner.query(`ALTER TABLE "pets" ADD "photo_url" character varying`);
        }

        const hasColorColumn = await queryRunner.hasColumn("pets", "color");
        if (!hasColorColumn) {
            await queryRunner.query(`ALTER TABLE "pets" ADD "color" character varying`);
        }

        const hasMicrochipIdColumn = await queryRunner.hasColumn("pets", "microchip_id");
        if (!hasMicrochipIdColumn) {
            await queryRunner.query(`ALTER TABLE "pets" ADD "microchip_id" character varying`);
        }

        const hasIsNeuteredColumn = await queryRunner.hasColumn("pets", "is_neutered");
        if (!hasIsNeuteredColumn) {
            await queryRunner.query(`ALTER TABLE "pets" ADD "is_neutered" boolean DEFAULT false`);
        }

        const hasMedicalConditionsColumn = await queryRunner.hasColumn("pets", "medical_conditions");
        if (!hasMedicalConditionsColumn) {
            await queryRunner.query(`ALTER TABLE "pets" ADD "medical_conditions" text`);
        }

        const hasAllergiesColumn = await queryRunner.hasColumn("pets", "allergies");
        if (!hasAllergiesColumn) {
            await queryRunner.query(`ALTER TABLE "pets" ADD "allergies" text`);
        }

        const hasNotesColumn = await queryRunner.hasColumn("pets", "notes");
        if (!hasNotesColumn) {
            await queryRunner.query(`ALTER TABLE "pets" ADD "notes" text`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las columnas añadidas
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN IF EXISTS "notes"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN IF EXISTS "allergies"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN IF EXISTS "medical_conditions"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN IF EXISTS "is_neutered"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN IF EXISTS "microchip_id"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN IF EXISTS "color"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN IF EXISTS "photo_url"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN IF EXISTS "medical_alerts"`);
    }
} 