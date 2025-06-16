import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDatabaseColumns1750038234648 implements MigrationInterface {
    name = 'FixDatabaseColumns1750038234648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ===== ARREGLAR TABLA MEDICAL_RECORDS =====
        // Agregar columna title si no existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'title') THEN
                    ALTER TABLE "medical_records" ADD COLUMN "title" character varying(200);
                END IF;
            END $$;
        `);

        // Agregar columna notes si no existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'notes') THEN
                    ALTER TABLE "medical_records" ADD COLUMN "notes" text;
                END IF;
            END $$;
        `);

        // Agregar columna symptoms si no existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'symptoms') THEN
                    ALTER TABLE "medical_records" ADD COLUMN "symptoms" text;
                END IF;
            END $$;
        `);

        // Agregar columna next_visit_recommendations si no existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'next_visit_recommendations') THEN
                    ALTER TABLE "medical_records" ADD COLUMN "next_visit_recommendations" text;
                END IF;
            END $$;
        `);

        // ===== ARREGLAR TABLA VACCINATIONS =====
        // Renombrar date_administered a administration_date si existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vaccinations' AND column_name = 'date_administered') THEN
                    ALTER TABLE "vaccinations" RENAME COLUMN "date_administered" TO "administration_date";
                END IF;
            END $$;
        `);

        // Renombrar next_due_date a expiration_date si existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vaccinations' AND column_name = 'next_due_date') THEN
                    ALTER TABLE "vaccinations" RENAME COLUMN "next_due_date" TO "expiration_date";
                END IF;
            END $$;
        `);

        // ===== ARREGLAR TABLA PRESCRIPTIONS =====
        // Renombrar medication_name a medication si existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'medication_name') THEN
                    ALTER TABLE "prescriptions" RENAME COLUMN "medication_name" TO "medication";
                END IF;
            END $$;
        `);

        // Cambiar duration de integer a text para permitir "7 días", "2 semanas", etc.
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'duration' AND data_type = 'integer') THEN
                    ALTER TABLE "prescriptions" ALTER COLUMN "duration" TYPE text;
                END IF;
            END $$;
        `);

        // Agregar columnas de fecha para prescriptions
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'start_date') THEN
                    ALTER TABLE "prescriptions" ADD COLUMN "start_date" date NOT NULL DEFAULT CURRENT_DATE;
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'end_date') THEN
                    ALTER TABLE "prescriptions" ADD COLUMN "end_date" date;
                END IF;
            END $$;
        `);

        // ===== ARREGLAR TABLA ATTACHMENTS =====
        // Renombrar file_path a file_url si existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'file_path') THEN
                    ALTER TABLE "attachments" RENAME COLUMN "file_path" TO "file_url";
                END IF;
            END $$;
        `);

        // Renombrar uploaded_at a created_at si no existe created_at pero existe uploaded_at
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'uploaded_at') 
                AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'created_at') THEN
                    ALTER TABLE "attachments" RENAME COLUMN "uploaded_at" TO "created_at";
                END IF;
            END $$;
        `);

        // Agregar updated_at si no existe
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'updated_at') THEN
                    ALTER TABLE "attachments" ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT now();
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios en orden inverso
        
        // ATTACHMENTS
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN IF EXISTS "updated_at"`);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'created_at') THEN
                    ALTER TABLE "attachments" RENAME COLUMN "created_at" TO "uploaded_at";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'file_url') THEN
                    ALTER TABLE "attachments" RENAME COLUMN "file_url" TO "file_path";
                END IF;
            END $$;
        `);

        // PRESCRIPTIONS
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN IF EXISTS "end_date"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN IF EXISTS "start_date"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ALTER COLUMN "duration" TYPE integer USING duration::integer`);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'medication') THEN
                    ALTER TABLE "prescriptions" RENAME COLUMN "medication" TO "medication_name";
                END IF;
            END $$;
        `);

        // VACCINATIONS
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vaccinations' AND column_name = 'expiration_date') THEN
                    ALTER TABLE "vaccinations" RENAME COLUMN "expiration_date" TO "next_due_date";
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vaccinations' AND column_name = 'administration_date') THEN
                    ALTER TABLE "vaccinations" RENAME COLUMN "administration_date" TO "date_administered";
                END IF;
            END $$;
        `);

        // MEDICAL_RECORDS
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN IF EXISTS "next_visit_recommendations"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN IF EXISTS "symptoms"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN IF EXISTS "notes"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN IF EXISTS "title"`);
    }
}
