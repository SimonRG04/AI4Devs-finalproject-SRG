import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateFullSchema1750400000000 implements MigrationInterface {
    name = 'RecreateFullSchema1750400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('🚀 Iniciando recreación completa del esquema de base de datos...');

        // ================================
        // DROP TODAS LAS TABLAS (si existen)
        // ================================
        console.log('🗑️ Eliminando tablas existentes...');
        
        await queryRunner.query(`DROP TABLE IF EXISTS "attachments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "prescriptions" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "ai_diagnoses" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "medical_records" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "vaccinations" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "pets" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "clients" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "veterinarians" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);

        // ================================
        // DROP TODOS LOS ENUMS (si existen)
        // ================================
        console.log('🗑️ Eliminando enums existentes...');
        
        await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "pets_species_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "pets_gender_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "appointments_status_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "appointments_type_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "appointments_priority_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "ai_diagnoses_status_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "attachments_file_type_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "notifications_type_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "notifications_priority_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "prescriptions_frequency_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "prescriptions_status_enum" CASCADE`);

        // ================================
        // CREAR TODOS LOS ENUMS
        // ================================
        console.log('📦 Creando enums...');
        
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('CLIENT', 'VET', 'ADMIN')`);
        await queryRunner.query(`CREATE TYPE "pets_species_enum" AS ENUM('DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'GUINEA_PIG', 'FERRET', 'REPTILE', 'FISH', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "pets_gender_enum" AS ENUM('MALE', 'FEMALE', 'UNKNOWN')`);
        await queryRunner.query(`CREATE TYPE "appointments_status_enum" AS ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED')`);
        await queryRunner.query(`CREATE TYPE "appointments_type_enum" AS ENUM('CONSULTATION', 'VACCINATION', 'CHECKUP', 'SURGERY', 'EMERGENCY', 'FOLLOW_UP', 'GROOMING')`);
        await queryRunner.query(`CREATE TYPE "appointments_priority_enum" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TYPE "ai_diagnoses_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`CREATE TYPE "attachments_file_type_enum" AS ENUM('IMAGE', 'PDF', 'DOC', 'VIDEO', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "notifications_type_enum" AS ENUM('APPOINTMENT_REMINDER', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'PRESCRIPTION_REMINDER', 'VACCINATION_DUE', 'DIAGNOSIS_READY', 'MEDICAL_RECORD_UPDATED', 'SYSTEM_ALERT')`);
        await queryRunner.query(`CREATE TYPE "notifications_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TYPE "prescriptions_frequency_enum" AS ENUM('ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'EVERY_6_HOURS', 'AS_NEEDED', 'WEEKLY', 'MONTHLY')`);
        await queryRunner.query(`CREATE TYPE "prescriptions_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'DISCONTINUED', 'SUSPENDED')`);

        // ================================
        // CREAR TABLA USERS
        // ================================
        console.log('👥 Creando tabla users...');
        
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "phone_number" character varying,
                "role" "users_role_enum" NOT NULL DEFAULT 'CLIENT',
                "email_verified" boolean NOT NULL DEFAULT false,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email")
            )
        `);

        // ================================
        // CREAR TABLA CLIENTS
        // ================================
        console.log('👤 Creando tabla clients...');
        
        await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "address" character varying,
                "emergency_contact" character varying,
                "emergency_phone" character varying,
                "notes" text,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_clients_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_clients_user_id" UNIQUE ("user_id")
            )
        `);

        // ================================
        // CREAR TABLA VETERINARIANS
        // ================================
        console.log('👨‍⚕️ Creando tabla veterinarians...');
        
        await queryRunner.query(`
            CREATE TABLE "veterinarians" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "license_number" character varying NOT NULL,
                "specialization" character varying,
                "experience_years" integer,
                "education" text,
                "availability_hours" json DEFAULT '{
                    "monday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                    "tuesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                    "wednesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                    "thursday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                    "friday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                    "saturday": {"start": "09:00", "end": "13:00", "isAvailable": false},
                    "sunday": {"start": "09:00", "end": "13:00", "isAvailable": false}
                }',
                "consultation_fee" numeric(10,2),
                "bio" text,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_veterinarians_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_veterinarians_user_id" UNIQUE ("user_id"),
                CONSTRAINT "UQ_veterinarians_license_number" UNIQUE ("license_number")
            )
        `);

        // ================================
        // CREAR TABLA PETS
        // ================================
        console.log('🐕 Creando tabla pets...');
        
        await queryRunner.query(`
            CREATE TABLE "pets" (
                "id" SERIAL NOT NULL,
                "client_id" integer NOT NULL,
                "name" character varying NOT NULL,
                "species" "pets_species_enum" NOT NULL,
                "breed" character varying,
                "gender" "pets_gender_enum" NOT NULL,
                "birth_date" timestamp without time zone,
                "weight" numeric(5,2),
                "color" character varying,
                "microchip_id" character varying,
                "is_neutered" boolean DEFAULT false,
                "medical_conditions" text,
                "allergies" text,
                "notes" text,
                "medical_alerts" text,
                "photo_url" character varying,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_pets_id" PRIMARY KEY ("id")
            )
        `);

        // ================================
        // CREAR TABLA APPOINTMENTS
        // ================================
        console.log('📅 Creando tabla appointments...');
        
        await queryRunner.query(`
            CREATE TABLE "appointments" (
                "id" SERIAL NOT NULL,
                "pet_id" integer NOT NULL,
                "veterinarian_id" integer NOT NULL,
                "scheduled_at" timestamp without time zone NOT NULL,
                "duration" integer NOT NULL DEFAULT 30,
                "type" character varying NOT NULL,
                "status" "appointments_status_enum" NOT NULL DEFAULT 'SCHEDULED',
                "notes" text,
                "priority" character varying(20) DEFAULT 'NORMAL',
                "images" jsonb DEFAULT '[]',
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_appointments_id" PRIMARY KEY ("id")
            )
        `);

        // ================================
        // CREAR TABLA MEDICAL_RECORDS
        // ================================
        console.log('📋 Creando tabla medical_records...');
        
        await queryRunner.query(`
            CREATE TABLE "medical_records" (
                "id" SERIAL NOT NULL,
                "appointment_id" integer NOT NULL,
                "pet_id" integer,
                "title" character varying(200),
                "diagnosis" text NOT NULL,
                "treatment" text,
                "observations" text,
                "notes" text,
                "symptoms" text,
                "weight" numeric(5,2),
                "temperature" numeric(4,2),
                "heart_rate" integer,
                "respiratory_rate" integer,
                "blood_pressure" character varying,
                "follow_up_date" timestamp without time zone,
                "follow_up_notes" text,
                "next_visit_recommendations" text,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_medical_records_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_medical_records_appointment_id" UNIQUE ("appointment_id")
            )
        `);

        // ================================
        // CREAR TABLA AI_DIAGNOSES
        // ================================
        console.log('🤖 Creando tabla ai_diagnoses...');
        
        await queryRunner.query(`
            CREATE TABLE "ai_diagnoses" (
                "id" SERIAL NOT NULL,
                "pet_id" integer NOT NULL,
                "appointment_id" integer,
                "symptoms" text,
                "results" json,
                "confidence" numeric(3,2),
                "possible_conditions" text,
                "recommendations" text,
                "status" "ai_diagnoses_status_enum" NOT NULL DEFAULT 'PENDING',
                "image_url" character varying,
                "description" text,
                "error_message" text,
                "processed_at" timestamp without time zone,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ai_diagnoses_id" PRIMARY KEY ("id")
            )
        `);

        // ================================
        // CREAR TABLA PRESCRIPTIONS
        // ================================
        console.log('💊 Creando tabla prescriptions...');
        
        await queryRunner.query(`
            CREATE TABLE "prescriptions" (
                "id" SERIAL NOT NULL,
                "medical_record_id" integer NOT NULL,
                "medication_name" character varying NOT NULL,
                "dosage" character varying NOT NULL,
                "frequency" "prescriptions_frequency_enum" NOT NULL DEFAULT 'TWICE_DAILY',
                "quantity" integer,
                "unit" character varying(50),
                "status" "prescriptions_status_enum" NOT NULL DEFAULT 'ACTIVE',
                "duration" integer NOT NULL,
                "instructions" text,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_prescriptions_id" PRIMARY KEY ("id")
            )
        `);

        // ================================
        // CREAR TABLA VACCINATIONS
        // ================================
        console.log('💉 Creando tabla vaccinations...');
        
        await queryRunner.query(`
            CREATE TABLE "vaccinations" (
                "id" SERIAL NOT NULL,
                "pet_id" integer NOT NULL,
                "vaccine_name" character varying NOT NULL,
                "administration_date" timestamp without time zone NOT NULL,
                "expiration_date" timestamp without time zone,
                "batch_number" character varying,
                "administered_by" integer NOT NULL,
                "notes" text,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_vaccinations_id" PRIMARY KEY ("id")
            )
        `);

        // ================================
        // CREAR TABLA ATTACHMENTS
        // ================================
        console.log('📎 Creando tabla attachments...');
        
        await queryRunner.query(`
            CREATE TABLE "attachments" (
                "id" SERIAL NOT NULL,
                "medical_record_id" integer NOT NULL,
                "file_name" character varying NOT NULL,
                "file_path" character varying NOT NULL,
                "file_size" integer,
                "file_type" "attachments_file_type_enum" NOT NULL,
                "mime_type" character varying,
                "description" text,
                "uploaded_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_attachments_id" PRIMARY KEY ("id")
            )
        `);

        // ================================
        // CREAR TABLA NOTIFICATIONS
        // ================================
        console.log('🔔 Creando tabla notifications...');
        
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "title" character varying NOT NULL,
                "message" text NOT NULL,
                "type" "notifications_type_enum" NOT NULL,
                "priority" "notifications_priority_enum" NOT NULL DEFAULT 'MEDIUM',
                "read" boolean NOT NULL DEFAULT false,
                "data" json,
                "created_at" timestamp without time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id")
            )
        `);

        // ================================
        // CREAR FOREIGN KEYS
        // ================================
        console.log('🔗 Creando foreign keys...');
        
        // Clients -> Users
        await queryRunner.query(`
            ALTER TABLE "clients" 
            ADD CONSTRAINT "FK_clients_user_id" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Veterinarians -> Users
        await queryRunner.query(`
            ALTER TABLE "veterinarians" 
            ADD CONSTRAINT "FK_veterinarians_user_id" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Pets -> Clients
        await queryRunner.query(`
            ALTER TABLE "pets" 
            ADD CONSTRAINT "FK_pets_client_id" 
            FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Appointments -> Pets
        await queryRunner.query(`
            ALTER TABLE "appointments" 
            ADD CONSTRAINT "FK_appointments_pet_id" 
            FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Appointments -> Veterinarians
        await queryRunner.query(`
            ALTER TABLE "appointments" 
            ADD CONSTRAINT "FK_appointments_veterinarian_id" 
            FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Medical Records -> Appointments
        await queryRunner.query(`
            ALTER TABLE "medical_records" 
            ADD CONSTRAINT "FK_medical_records_appointment_id" 
            FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Medical Records -> Pets
        await queryRunner.query(`
            ALTER TABLE "medical_records" 
            ADD CONSTRAINT "FK_medical_records_pet_id" 
            FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // AI Diagnoses -> Pets
        await queryRunner.query(`
            ALTER TABLE "ai_diagnoses" 
            ADD CONSTRAINT "FK_ai_diagnoses_pet_id" 
            FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // AI Diagnoses -> Appointments
        await queryRunner.query(`
            ALTER TABLE "ai_diagnoses" 
            ADD CONSTRAINT "FK_ai_diagnoses_appointment_id" 
            FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Prescriptions -> Medical Records
        await queryRunner.query(`
            ALTER TABLE "prescriptions" 
            ADD CONSTRAINT "FK_prescriptions_medical_record_id" 
            FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Vaccinations -> Pets
        await queryRunner.query(`
            ALTER TABLE "vaccinations" 
            ADD CONSTRAINT "FK_vaccinations_pet_id" 
            FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Vaccinations -> Veterinarians
        await queryRunner.query(`
            ALTER TABLE "vaccinations" 
            ADD CONSTRAINT "FK_vaccinations_administered_by" 
            FOREIGN KEY ("administered_by") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Attachments -> Medical Records
        await queryRunner.query(`
            ALTER TABLE "attachments" 
            ADD CONSTRAINT "FK_attachments_medical_record_id" 
            FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Notifications -> Users
        await queryRunner.query(`
            ALTER TABLE "notifications" 
            ADD CONSTRAINT "FK_notifications_user_id" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // ================================
        // CREAR ÍNDICES
        // ================================
        console.log('📊 Creando índices...');
        
        // Users
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role")`);

        // Pets
        await queryRunner.query(`CREATE INDEX "IDX_pets_client_id" ON "pets" ("client_id")`);

        // Appointments
        await queryRunner.query(`CREATE INDEX "IDX_appointments_pet_id" ON "appointments" ("pet_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_veterinarian_id" ON "appointments" ("veterinarian_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_date_time" ON "appointments" ("scheduled_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_scheduled_at" ON "appointments" ("scheduled_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_status" ON "appointments" ("status")`);

        // Medical Records
        await queryRunner.query(`CREATE INDEX "IDX_medical_records_appointment_id" ON "medical_records" ("appointment_id")`);

        // AI Diagnoses
        await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_pet_id" ON "ai_diagnoses" ("pet_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_appointment_id" ON "ai_diagnoses" ("appointment_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_status" ON "ai_diagnoses" ("status")`);

        // Notifications
        await queryRunner.query(`CREATE INDEX "IDX_notifications_user_id" ON "notifications" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_read" ON "notifications" ("read")`);

        console.log('✅ Recreación completa del esquema completada exitosamente');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('🚨 ADVERTENCIA: Esta operación eliminará TODA la base de datos');
        
        // Drop todas las tablas
        await queryRunner.query(`DROP TABLE IF EXISTS "attachments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "prescriptions" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "ai_diagnoses" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "medical_records" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "vaccinations" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "pets" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "clients" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "veterinarians" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);

        // Drop todos los enums
        await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "pets_species_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "pets_gender_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "appointments_status_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "appointments_type_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "appointments_priority_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "ai_diagnoses_status_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "attachments_file_type_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "notifications_type_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "notifications_priority_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "prescriptions_frequency_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "prescriptions_status_enum" CASCADE`);

        console.log('💥 Base de datos completamente eliminada');
    }
} 