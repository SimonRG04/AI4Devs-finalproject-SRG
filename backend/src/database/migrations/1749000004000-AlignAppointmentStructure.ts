import { MigrationInterface, QueryRunner } from "typeorm";

export class AlignAppointmentStructure1749000004000 implements MigrationInterface {
    name = 'AlignAppointmentStructure1749000004000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Renombrar date_time a scheduled_at
        const hasDateTimeColumn = await queryRunner.hasColumn("appointments", "date_time");
        const hasScheduledAtColumn = await queryRunner.hasColumn("appointments", "scheduled_at");
        
        if (hasDateTimeColumn && !hasScheduledAtColumn) {
            await queryRunner.renameColumn("appointments", "date_time", "scheduled_at");
        }

        // 2. Verificar y ajustar la columna duration 
        const hasDurationColumn = await queryRunner.hasColumn("appointments", "duration");
        const hasDurationMinutesColumn = await queryRunner.hasColumn("appointments", "duration_minutes");
        
        // Si existe duration_minutes pero no duration, renombrar de vuelta a duration
        if (hasDurationMinutesColumn && !hasDurationColumn) {
            await queryRunner.renameColumn("appointments", "duration_minutes", "duration");
        }
        
        // Si no existe duration, crear la columna
        if (!hasDurationColumn && !hasDurationMinutesColumn) {
            await queryRunner.query(`ALTER TABLE "appointments" ADD "duration" integer DEFAULT 30`);
        }

        // 3. Verificar que existan todas las columnas requeridas
        const hasNotesColumn = await queryRunner.hasColumn("appointments", "notes");
        if (!hasNotesColumn) {
            await queryRunner.query(`ALTER TABLE "appointments" ADD "notes" text`);
        }

        // 4. Agregar tipos de cita y prioridad si no existen
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."appointments_type_enum" AS ENUM('CONSULTATION', 'VACCINATION', 'CHECKUP', 'SURGERY', 'EMERGENCY', 'FOLLOW_UP', 'GROOMING');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."appointments_priority_enum" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // 5. Agregar columnas type y priority si no existen
        const hasTypeColumn = await queryRunner.hasColumn("appointments", "type");
        if (!hasTypeColumn) {
            await queryRunner.query(`ALTER TABLE "appointments" ADD "type" "public"."appointments_type_enum" DEFAULT 'CONSULTATION'`);
        }

        const hasPriorityColumn = await queryRunner.hasColumn("appointments", "priority");
        if (!hasPriorityColumn) {
            await queryRunner.query(`ALTER TABLE "appointments" ADD "priority" "public"."appointments_priority_enum" DEFAULT 'NORMAL'`);
        }

        // 6. Hacer reason opcional si actualmente es requerido
        const hasReasonColumn = await queryRunner.hasColumn("appointments", "reason");
        if (hasReasonColumn) {
            await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "reason" DROP NOT NULL`);
        }

        // 7. Agregar índices para mejorar performance
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_scheduled_at" ON "appointments" ("scheduled_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_pet_id" ON "appointments" ("pet_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_veterinarian_id" ON "appointments" ("veterinarian_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_status" ON "appointments" ("status")`);

        // 8. Agregar foreign keys si no existen
        const foreignKeys = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'appointments' AND constraint_type = 'FOREIGN KEY'
        `);
        
        const hasPetFK = foreignKeys.some((fk: any) => fk.constraint_name.includes('pet'));
        const hasVetFK = foreignKeys.some((fk: any) => fk.constraint_name.includes('veterinarian'));

        if (!hasPetFK) {
            await queryRunner.query(`
                ALTER TABLE "appointments" 
                ADD CONSTRAINT "FK_appointments_pet_id" 
                FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE
            `);
        }

        if (!hasVetFK) {
            await queryRunner.query(`
                ALTER TABLE "appointments" 
                ADD CONSTRAINT "FK_appointments_veterinarian_id" 
                FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("id") ON DELETE CASCADE
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios en orden inverso
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_appointments_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_appointments_veterinarian_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_appointments_pet_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_appointments_scheduled_at"`);
        
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "priority"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "type"`);
        
        const hasReasonColumn = await queryRunner.hasColumn("appointments", "reason");
        if (hasReasonColumn) {
            await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "reason" SET NOT NULL`);
        }
        
        const hasScheduledAtColumn = await queryRunner.hasColumn("appointments", "scheduled_at");
        if (hasScheduledAtColumn) {
            await queryRunner.renameColumn("appointments", "scheduled_at", "date_time");
        }
    }
} 