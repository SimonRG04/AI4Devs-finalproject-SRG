import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAppointmentColumns1749000003000 implements MigrationInterface {
    name = 'FixAppointmentColumns1749000003000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar si existe la columna duration_minutes
        const hasDurationMinutesColumn = await queryRunner.hasColumn("appointments", "duration_minutes");
        
        if (!hasDurationMinutesColumn) {
            // Si no existe duration_minutes, verificar si existe duration y renombrarla
            const hasDurationColumn = await queryRunner.hasColumn("appointments", "duration");
            
            if (hasDurationColumn) {
                // Renombrar la columna duration a duration_minutes
                await queryRunner.renameColumn("appointments", "duration", "duration_minutes");
            } else {
                // Si no existe ninguna, crear duration_minutes
                await queryRunner.query(`ALTER TABLE "appointments" ADD "duration_minutes" integer DEFAULT 30`);
            }
        }

        // Verificar si existe la columna notes
        const hasNotesColumn = await queryRunner.hasColumn("appointments", "notes");
        if (!hasNotesColumn) {
            await queryRunner.query(`ALTER TABLE "appointments" ADD "notes" text`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Renombrar de vuelta a duration
        const hasDurationMinutesColumn = await queryRunner.hasColumn("appointments", "duration_minutes");
        if (hasDurationMinutesColumn) {
            await queryRunner.renameColumn("appointments", "duration_minutes", "duration");
        }
        
        // Eliminar notes si existe
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "notes"`);
    }
} 