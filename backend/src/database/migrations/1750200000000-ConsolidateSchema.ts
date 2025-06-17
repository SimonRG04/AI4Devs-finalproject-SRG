import { MigrationInterface, QueryRunner } from "typeorm";

export class ConsolidateSchema1750200000000 implements MigrationInterface {
    name = 'ConsolidateSchema1750200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar si la tabla ai_diagnoses ya existe
        const aiDiagnosesExists = await queryRunner.hasTable('ai_diagnoses');
        
        if (!aiDiagnosesExists) {
            // Crear tabla ai_diagnoses con la estructura correcta
            await queryRunner.query(`
                CREATE TABLE "ai_diagnoses" (
                    "id" SERIAL NOT NULL,
                    "pet_id" integer NOT NULL,
                    "appointment_id" integer,
                    "image_url" character varying,
                    "results" jsonb,
                    "confidence" decimal(3,2),
                    "status" "public"."ai_diagnoses_status_enum" NOT NULL DEFAULT 'PENDING',
                    "description" text,
                    "error_message" text,
                    "processed_at" TIMESTAMP,
                    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT "PK_ai_diagnoses_id" PRIMARY KEY ("id")
                )
            `);

            // Crear índices para ai_diagnoses
            await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_pet_id" ON "ai_diagnoses" ("pet_id")`);
            await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_appointment_id" ON "ai_diagnoses" ("appointment_id")`);
            await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_status" ON "ai_diagnoses" ("status")`);
            await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_created_at" ON "ai_diagnoses" ("created_at")`);

            // Crear foreign keys para ai_diagnoses
            await queryRunner.query(`
                ALTER TABLE "ai_diagnoses" 
                ADD CONSTRAINT "FK_ai_diagnoses_pet_id" 
                FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE
            `);

            await queryRunner.query(`
                ALTER TABLE "ai_diagnoses" 
                ADD CONSTRAINT "FK_ai_diagnoses_appointment_id" 
                FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL
            `);
        } else {
            // Si la tabla existe, verificar y actualizar estructura si es necesario
            const hasImageUrl = await queryRunner.hasColumn('ai_diagnoses', 'image_url');
            if (!hasImageUrl) {
                await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD COLUMN "image_url" character varying`);
            }

            const hasErrorMessage = await queryRunner.hasColumn('ai_diagnoses', 'error_message');
            if (!hasErrorMessage) {
                await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD COLUMN "error_message" text`);
            }

            const hasProcessedAt = await queryRunner.hasColumn('ai_diagnoses', 'processed_at');
            if (!hasProcessedAt) {
                await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD COLUMN "processed_at" TIMESTAMP`);
            }

            // Verificar si results es jsonb, si no, convertir
            const resultsColumn = await queryRunner.query(`
                SELECT data_type 
                FROM information_schema.columns 
                WHERE table_name = 'ai_diagnoses' AND column_name = 'results'
            `);
            
            if (resultsColumn.length > 0 && resultsColumn[0].data_type === 'json') {
                // Convertir de json a jsonb de forma segura
                await queryRunner.query(`
                    ALTER TABLE "ai_diagnoses" 
                    ALTER COLUMN "results" TYPE jsonb USING "results"::jsonb
                `);
            }
        }

        // Verificar y agregar pet_id a medical_records si no existe
        const hasPetIdInMedicalRecords = await queryRunner.hasColumn('medical_records', 'pet_id');
        if (!hasPetIdInMedicalRecords) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "pet_id" integer`);
            
            // Poblar pet_id basado en appointment
            await queryRunner.query(`
                UPDATE "medical_records" 
                SET "pet_id" = (
                    SELECT "pet_id" 
                    FROM "appointments" 
                    WHERE "appointments"."id" = "medical_records"."appointment_id"
                )
                WHERE "appointment_id" IS NOT NULL
            `);

            // Crear foreign key para pet_id en medical_records
            await queryRunner.query(`
                ALTER TABLE "medical_records" 
                ADD CONSTRAINT "FK_medical_records_pet_id" 
                FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE
            `);
        }

        // Actualizar triggers para updated_at
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Aplicar trigger a ai_diagnoses
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS update_ai_diagnoses_updated_at ON ai_diagnoses;
            CREATE TRIGGER update_ai_diagnoses_updated_at 
                BEFORE UPDATE ON ai_diagnoses 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log('✅ Migración de consolidación completada exitosamente');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar triggers
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_ai_diagnoses_updated_at ON ai_diagnoses`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);

        // Eliminar foreign keys de ai_diagnoses
        const aiDiagnosesExists = await queryRunner.hasTable('ai_diagnoses');
        if (aiDiagnosesExists) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP CONSTRAINT IF EXISTS "FK_ai_diagnoses_appointment_id"`);
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP CONSTRAINT IF EXISTS "FK_ai_diagnoses_pet_id"`);
            
            // Eliminar índices
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ai_diagnoses_created_at"`);
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ai_diagnoses_status"`);
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ai_diagnoses_appointment_id"`);
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ai_diagnoses_pet_id"`);
        }

        // Eliminar foreign key de medical_records
        await queryRunner.query(`ALTER TABLE "medical_records" DROP CONSTRAINT IF EXISTS "FK_medical_records_pet_id"`);
        
        console.log('⚠️ Rollback de consolidación completado');
    }
} 