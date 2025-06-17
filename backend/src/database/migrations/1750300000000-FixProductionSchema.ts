import { MigrationInterface, QueryRunner } from "typeorm";

export class FixProductionSchema1750300000000 implements MigrationInterface {
    name = 'FixProductionSchema1750300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('🚀 Iniciando corrección del esquema de producción...');

        // ================================
        // CORREGIR TABLA USERS
        // ================================
        
        // Verificar si phone_number existe, si no, renombrar phone
        const hasPhoneNumber = await queryRunner.hasColumn('users', 'phone_number');
        const hasPhone = await queryRunner.hasColumn('users', 'phone');
        
        if (!hasPhoneNumber && hasPhone) {
            await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "phone" TO "phone_number"`);
        } else if (!hasPhoneNumber && !hasPhone) {
            await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "phone_number" character varying`);
        }

        // Agregar columnas faltantes en users
        const hasEmailVerified = await queryRunner.hasColumn('users', 'email_verified');
        if (!hasEmailVerified) {
            await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "email_verified" boolean NOT NULL DEFAULT false`);
        }

        const hasIsActive = await queryRunner.hasColumn('users', 'is_active');
        if (!hasIsActive) {
            await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "is_active" boolean NOT NULL DEFAULT true`);
        }

        // ================================
        // CORREGIR TABLA CLIENTS
        // ================================
        
        const hasEmergencyContact = await queryRunner.hasColumn('clients', 'emergency_contact');
        if (!hasEmergencyContact) {
            await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN "emergency_contact" character varying`);
        }

        const hasEmergencyPhone = await queryRunner.hasColumn('clients', 'emergency_phone');
        if (!hasEmergencyPhone) {
            await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN "emergency_phone" character varying`);
        }

        const hasClientNotes = await queryRunner.hasColumn('clients', 'notes');
        if (!hasClientNotes) {
            await queryRunner.query(`ALTER TABLE "clients" ADD COLUMN "notes" text`);
        }

        // ================================
        // CORREGIR TABLA VETERINARIANS
        // ================================
        
        const hasExperienceYears = await queryRunner.hasColumn('veterinarians', 'experience_years');
        if (!hasExperienceYears) {
            await queryRunner.query(`ALTER TABLE "veterinarians" ADD COLUMN "experience_years" integer`);
        }

        const hasEducation = await queryRunner.hasColumn('veterinarians', 'education');
        if (!hasEducation) {
            await queryRunner.query(`ALTER TABLE "veterinarians" ADD COLUMN "education" text`);
        }

        const hasConsultationFee = await queryRunner.hasColumn('veterinarians', 'consultation_fee');
        if (!hasConsultationFee) {
            await queryRunner.query(`ALTER TABLE "veterinarians" ADD COLUMN "consultation_fee" numeric(10,2)`);
        }

        // Verificar si availability_hours es jsonb y convertir a json
        const availabilityColumn = await queryRunner.query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'veterinarians' AND column_name = 'availability_hours'
        `);
        
        if (availabilityColumn.length > 0 && availabilityColumn[0].data_type === 'jsonb') {
            await queryRunner.query(`
                ALTER TABLE "veterinarians" 
                ALTER COLUMN "availability_hours" TYPE json USING "availability_hours"::json
            `);
        }

        // ================================
        // CORREGIR TABLA APPOINTMENTS
        // ================================
        
        // Verificar si date_time existe y renombrar a scheduled_at
        const hasDateTime = await queryRunner.hasColumn('appointments', 'date_time');
        const hasScheduledAt = await queryRunner.hasColumn('appointments', 'scheduled_at');
        
        if (hasDateTime && !hasScheduledAt) {
            await queryRunner.query(`ALTER TABLE "appointments" RENAME COLUMN "date_time" TO "scheduled_at"`);
        }

        // Verificar que type sea varchar y no enum
        const typeColumn = await queryRunner.query(`
            SELECT data_type, udt_name
            FROM information_schema.columns 
            WHERE table_name = 'appointments' AND column_name = 'type'
        `);
        
        if (typeColumn.length > 0 && typeColumn[0].udt_name === 'appointments_type_enum') {
            // Convertir de enum a varchar
            await queryRunner.query(`
                ALTER TABLE "appointments" 
                ALTER COLUMN "type" TYPE character varying USING "type"::text
            `);
        }

        // Verificar que priority sea varchar(20) y no enum
        const priorityColumn = await queryRunner.query(`
            SELECT data_type, character_maximum_length, udt_name
            FROM information_schema.columns 
            WHERE table_name = 'appointments' AND column_name = 'priority'
        `);
        
        if (priorityColumn.length > 0 && priorityColumn[0].udt_name === 'appointments_priority_enum') {
            // Convertir de enum a varchar(20)
            await queryRunner.query(`
                ALTER TABLE "appointments" 
                ALTER COLUMN "priority" TYPE character varying(20) USING "priority"::text
            `);
        }

        // Agregar columna images si no existe
        const hasImages = await queryRunner.hasColumn('appointments', 'images');
        if (!hasImages) {
            await queryRunner.query(`ALTER TABLE "appointments" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb`);
        }

        // ================================
        // CORREGIR TABLA MEDICAL_RECORDS
        // ================================
        
        // Restaurar columnas eliminadas incorrectamente
        const hasObservations = await queryRunner.hasColumn('medical_records', 'observations');
        if (!hasObservations) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "observations" text`);
        }

        const hasHeartRate = await queryRunner.hasColumn('medical_records', 'heart_rate');
        if (!hasHeartRate) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "heart_rate" integer`);
        }

        const hasRespiratoryRate = await queryRunner.hasColumn('medical_records', 'respiratory_rate');
        if (!hasRespiratoryRate) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "respiratory_rate" integer`);
        }

        const hasBloodPressure = await queryRunner.hasColumn('medical_records', 'blood_pressure');
        if (!hasBloodPressure) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "blood_pressure" character varying`);
        }

        const hasFollowUpNotes = await queryRunner.hasColumn('medical_records', 'follow_up_notes');
        if (!hasFollowUpNotes) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "follow_up_notes" text`);
        }

        // Agregar columnas adicionales que están en el esquema local
        const hasTitle = await queryRunner.hasColumn('medical_records', 'title');
        if (!hasTitle) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "title" character varying(200)`);
        }

        const hasMedicalNotes = await queryRunner.hasColumn('medical_records', 'notes');
        if (!hasMedicalNotes) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "notes" text`);
        }

        const hasSymptoms = await queryRunner.hasColumn('medical_records', 'symptoms');
        if (!hasSymptoms) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "symptoms" text`);
        }

        const hasNextVisitRecommendations = await queryRunner.hasColumn('medical_records', 'next_visit_recommendations');
        if (!hasNextVisitRecommendations) {
            await queryRunner.query(`ALTER TABLE "medical_records" ADD COLUMN "next_visit_recommendations" text`);
        }

        // Asegurar que pet_id existe
        const hasPetId = await queryRunner.hasColumn('medical_records', 'pet_id');
        if (!hasPetId) {
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
        }

        // ================================
        // CORREGIR TABLA AI_DIAGNOSES
        // ================================
        
        // Restaurar columnas eliminadas incorrectamente
        const hasAiSymptoms = await queryRunner.hasColumn('ai_diagnoses', 'symptoms');
        if (!hasAiSymptoms) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD COLUMN "symptoms" text`);
        }

        const hasPossibleConditions = await queryRunner.hasColumn('ai_diagnoses', 'possible_conditions');
        if (!hasPossibleConditions) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD COLUMN "possible_conditions" text`);
        }

        const hasRecommendations = await queryRunner.hasColumn('ai_diagnoses', 'recommendations');
        if (!hasRecommendations) {
            await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD COLUMN "recommendations" text`);
        }

        // Verificar que results sea json, no jsonb
        const resultsColumn = await queryRunner.query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'ai_diagnoses' AND column_name = 'results'
        `);
        
        if (resultsColumn.length > 0 && resultsColumn[0].data_type === 'jsonb') {
            await queryRunner.query(`
                ALTER TABLE "ai_diagnoses" 
                ALTER COLUMN "results" TYPE json USING "results"::json
            `);
        }

        // ================================
        // CORREGIR TABLA NOTIFICATIONS
        // ================================
        
        // Restaurar columnas eliminadas incorrectamente
        const hasMessage = await queryRunner.hasColumn('notifications', 'message');
        if (!hasMessage) {
            await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "message" text NOT NULL DEFAULT ''`);
        }

        const hasData = await queryRunner.hasColumn('notifications', 'data');
        if (!hasData) {
            await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN "data" json`);
        }

        // Eliminar columnas que no deben existir según el esquema local
        const hasContent = await queryRunner.hasColumn('notifications', 'content');
        if (hasContent) {
            await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "content"`);
        }

        const hasReadAt = await queryRunner.hasColumn('notifications', 'read_at');
        if (hasReadAt) {
            await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "read_at"`);
        }

        const hasMetadata = await queryRunner.hasColumn('notifications', 'metadata');
        if (hasMetadata) {
            await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "metadata"`);
        }

        const hasExpiresAt = await queryRunner.hasColumn('notifications', 'expires_at');
        if (hasExpiresAt) {
            await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "expires_at"`);
        }

        // ================================
        // CORREGIR TABLA PETS
        // ================================
        
        // Agregar columnas adicionales del esquema local
        const hasMedicalAlerts = await queryRunner.hasColumn('pets', 'medical_alerts');
        if (!hasMedicalAlerts) {
            await queryRunner.query(`ALTER TABLE "pets" ADD COLUMN "medical_alerts" text`);
        }

        const hasPhotoUrl = await queryRunner.hasColumn('pets', 'photo_url');
        if (!hasPhotoUrl) {
            await queryRunner.query(`ALTER TABLE "pets" ADD COLUMN "photo_url" character varying`);
        }

        // ================================
        // CREAR FOREIGN KEYS FALTANTES
        // ================================
        
        // Verificar y crear foreign key para medical_records.pet_id
        try {
            await queryRunner.query(`
                ALTER TABLE "medical_records" 
                ADD CONSTRAINT "FK_medical_records_pet_id" 
                FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        } catch (error) {
            // La constraint ya existe, continuar
        }

        // ================================
        // RESTAURAR CONSTRAINT ÚNICO
        // ================================
        
        // Verificar y restaurar constraint único en medical_records.appointment_id
        try {
            await queryRunner.query(`
                ALTER TABLE "medical_records" 
                ADD CONSTRAINT "UQ_medical_records_appointment_id" UNIQUE ("appointment_id")
            `);
        } catch (error) {
            // La constraint ya existe, continuar
        }

        console.log('✅ Corrección del esquema de producción completada exitosamente');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('⚠️ Iniciando rollback de la corrección del esquema...');
        
        // Este rollback es complejo y podría causar pérdida de datos
        // Se recomienda hacer backup antes de ejecutar
        
        // Eliminar constraint único
        await queryRunner.query(`ALTER TABLE "medical_records" DROP CONSTRAINT IF EXISTS "UQ_medical_records_appointment_id"`);
        
        // Eliminar foreign key
        await queryRunner.query(`ALTER TABLE "medical_records" DROP CONSTRAINT IF EXISTS "FK_medical_records_pet_id"`);
        
        // Nota: No se revierten todas las columnas para evitar pérdida de datos
        console.log('⚠️ Rollback parcial completado - Se recomienda restaurar desde backup');
    }
} 