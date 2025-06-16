import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageSupport1749000005000 implements MigrationInterface {
    name = 'AddImageSupport1749000005000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Añadir columna image_url a ai_diagnoses (nullable para funcionalidad futura)
        const hasImageUrlColumn = await queryRunner.hasColumn("ai_diagnoses", "image_url");
        if (!hasImageUrlColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "image_url" character varying NULL`);
        }

        // 2. Modificar symptoms para que sea nullable (para casos donde solo hay imagen) - si existe
        const hasSymptomsColumn = await queryRunner.hasColumn("ai_diagnoses", "symptoms");
        if (hasSymptomsColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "symptoms" DROP NOT NULL`);
        }

        // 3. Añadir columnas para descripción y mensaje de error si no existen
        const hasDescriptionColumn = await queryRunner.hasColumn("ai_diagnoses", "description");
        if (!hasDescriptionColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "description" text NULL`);
        }

        const hasErrorMessageColumn = await queryRunner.hasColumn("ai_diagnoses", "error_message");
        if (!hasErrorMessageColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "error_message" text NULL`);
        }

        const hasProcessedAtColumn = await queryRunner.hasColumn("ai_diagnoses", "processed_at");
        if (!hasProcessedAtColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "processed_at" timestamp NULL`);
        }

        // 4. Mapear campos antiguos a nuevos nombres si es necesario
        // Renombrar ai_response a results si existe ai_response
        const hasAiResponseColumn = await queryRunner.hasColumn("ai_diagnoses", "ai_response");
        const hasResultsColumn = await queryRunner.hasColumn("ai_diagnoses", "results");
        
        if (hasAiResponseColumn && !hasResultsColumn) {
            await queryRunner.renameColumn("ai_diagnoses", "ai_response", "results");
        } else if (!hasResultsColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "results" jsonb NULL`);
        }

        // Renombrar confidence_score a confidence si existe confidence_score
        const hasConfidenceScoreColumn = await queryRunner.hasColumn("ai_diagnoses", "confidence_score");
        const hasConfidenceColumn = await queryRunner.hasColumn("ai_diagnoses", "confidence");
        
        if (hasConfidenceScoreColumn && !hasConfidenceColumn) {
            await queryRunner.renameColumn("ai_diagnoses", "confidence_score", "confidence");
        } else if (!hasConfidenceColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "confidence" decimal(3,2) NULL`);
        }

        // 5. Añadir soporte para imágenes en appointments (para adjuntar imágenes a las citas)
        const hasAppointmentImagesColumn = await queryRunner.hasColumn("appointments", "images");
        if (!hasAppointmentImagesColumn) {
            await queryRunner.query(`ALTER TABLE "appointments" ADD "images" jsonb NULL DEFAULT '[]'`);
        }

        // 6. Añadir índices para mejorar búsquedas
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ai_diagnoses_appointment_id" ON "ai_diagnoses" ("appointment_id")`);
        
        // 7. Hacer columnas opcionales que podrían estar como NOT NULL
        const hasPossibleConditionsColumn = await queryRunner.hasColumn("ai_diagnoses", "possible_conditions");
        if (hasPossibleConditionsColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "possible_conditions" DROP NOT NULL`);
        }
        
        const hasRecommendationsColumn = await queryRunner.hasColumn("ai_diagnoses", "recommendations");
        if (hasRecommendationsColumn) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "recommendations" DROP NOT NULL`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios en orden inverso
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ai_diagnoses_appointment_id"`);
        
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "images"`);
        
        // Revertir renombres de columnas
        const hasResultsColumn = await queryRunner.hasColumn("ai_diagnoses", "results");
        if (hasResultsColumn) {
            await queryRunner.renameColumn("ai_diagnoses", "results", "ai_response");
        }
        
        const hasConfidenceColumn = await queryRunner.hasColumn("ai_diagnoses", "confidence");
        if (hasConfidenceColumn) {
            await queryRunner.renameColumn("ai_diagnoses", "confidence", "confidence_score");
        }
        
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN IF EXISTS "processed_at"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN IF EXISTS "error_message"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN IF EXISTS "description"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN IF EXISTS "image_url"`);
    }
} 