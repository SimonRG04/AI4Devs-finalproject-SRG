import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabaseSchema1749000000000 implements MigrationInterface {
    name = 'InitialDatabaseSchema1749000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear enums
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('CLIENT', 'VET', 'ADMIN')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_species_enum" AS ENUM('DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'GUINEA_PIG', 'FERRET', 'REPTILE', 'FISH', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_gender_enum" AS ENUM('MALE', 'FEMALE', 'UNKNOWN')`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED')`);
        await queryRunner.query(`CREATE TYPE "public"."ai_diagnoses_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`CREATE TYPE "public"."attachments_file_type_enum" AS ENUM('IMAGE', 'PDF', 'DOC', 'VIDEO', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('APPOINTMENT_REMINDER', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'PRESCRIPTION_REMINDER', 'VACCINATION_DUE', 'DIAGNOSIS_READY', 'MEDICAL_RECORD_UPDATED', 'SYSTEM_ALERT')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TYPE "public"."prescriptions_frequency_enum" AS ENUM('ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'EVERY_6_HOURS', 'AS_NEEDED', 'WEEKLY', 'MONTHLY')`);
        await queryRunner.query(`CREATE TYPE "public"."prescriptions_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'DISCONTINUED', 'SUSPENDED')`);

        // Crear tabla users
        await queryRunner.query(`CREATE TABLE "users" (
            "id" SERIAL NOT NULL,
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "first_name" character varying NOT NULL,
            "last_name" character varying NOT NULL,
            "phone" character varying,
            "role" "public"."users_role_enum" NOT NULL DEFAULT 'CLIENT',
            "email_verified" boolean NOT NULL DEFAULT false,
            "is_active" boolean NOT NULL DEFAULT true,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_users_email" UNIQUE ("email"),
            CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla clients
        await queryRunner.query(`CREATE TABLE "clients" (
            "id" SERIAL NOT NULL,
            "user_id" integer NOT NULL,
            "address" character varying,
            "emergency_contact" character varying,
            "emergency_phone" character varying,
            "notes" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_clients_user_id" UNIQUE ("user_id"),
            CONSTRAINT "PK_clients_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla veterinarians
        await queryRunner.query(`CREATE TABLE "veterinarians" (
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
            "consultation_fee" decimal(10,2),
            "bio" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_veterinarians_user_id" UNIQUE ("user_id"),
            CONSTRAINT "UQ_veterinarians_license_number" UNIQUE ("license_number"),
            CONSTRAINT "PK_veterinarians_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla pets
        await queryRunner.query(`CREATE TABLE "pets" (
            "id" SERIAL NOT NULL,
            "client_id" integer NOT NULL,
            "name" character varying NOT NULL,
            "species" "public"."pets_species_enum" NOT NULL,
            "breed" character varying,
            "gender" "public"."pets_gender_enum" NOT NULL,
            "birth_date" TIMESTAMP,
            "weight" decimal(5,2),
            "color" character varying,
            "microchip_id" character varying,
            "is_neutered" boolean DEFAULT false,
            "medical_conditions" text,
            "allergies" text,
            "notes" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_pets_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla appointments
        await queryRunner.query(`CREATE TABLE "appointments" (
            "id" SERIAL NOT NULL,
            "pet_id" integer NOT NULL,
            "veterinarian_id" integer NOT NULL,
            "date_time" TIMESTAMP NOT NULL,
            "duration" integer NOT NULL DEFAULT 30,
            "reason" character varying NOT NULL,
            "status" "public"."appointments_status_enum" NOT NULL DEFAULT 'SCHEDULED',
            "notes" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_appointments_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla medical_records
        await queryRunner.query(`CREATE TABLE "medical_records" (
            "id" SERIAL NOT NULL,
            "appointment_id" integer NOT NULL,
            "diagnosis" text NOT NULL,
            "treatment" text,
            "observations" text,
            "weight" decimal(5,2),
            "temperature" decimal(4,2),
            "heart_rate" integer,
            "respiratory_rate" integer,
            "blood_pressure" character varying,
            "follow_up_date" TIMESTAMP,
            "follow_up_notes" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_medical_records_appointment_id" UNIQUE ("appointment_id"),
            CONSTRAINT "PK_medical_records_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla prescriptions
        await queryRunner.query(`CREATE TABLE "prescriptions" (
            "id" SERIAL NOT NULL,
            "medical_record_id" integer NOT NULL,
            "medication_name" character varying NOT NULL,
            "dosage" character varying NOT NULL,
            "frequency" "public"."prescriptions_frequency_enum" NOT NULL DEFAULT 'TWICE_DAILY',
            "quantity" integer,
            "unit" character varying(50),
            "status" "public"."prescriptions_status_enum" NOT NULL DEFAULT 'ACTIVE',
            "duration" integer NOT NULL,
            "instructions" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_prescriptions_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla vaccinations
        await queryRunner.query(`CREATE TABLE "vaccinations" (
            "id" SERIAL NOT NULL,
            "pet_id" integer NOT NULL,
            "vaccine_name" character varying NOT NULL,
            "date_administered" TIMESTAMP NOT NULL,
            "next_due_date" TIMESTAMP,
            "batch_number" character varying,
            "administered_by" integer NOT NULL,
            "notes" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_vaccinations_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla ai_diagnoses
        await queryRunner.query(`CREATE TABLE "ai_diagnoses" (
            "id" SERIAL NOT NULL,
            "pet_id" integer NOT NULL,
            "appointment_id" integer,
            "symptoms" text NOT NULL,
            "ai_response" json,
            "confidence_score" decimal(3,2),
            "possible_conditions" text,
            "recommendations" text,
            "status" "public"."ai_diagnoses_status_enum" NOT NULL DEFAULT 'PENDING',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_ai_diagnoses_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla attachments
        await queryRunner.query(`CREATE TABLE "attachments" (
            "id" SERIAL NOT NULL,
            "medical_record_id" integer NOT NULL,
            "file_name" character varying NOT NULL,
            "file_path" character varying NOT NULL,
            "file_size" integer,
            "file_type" "public"."attachments_file_type_enum" NOT NULL,
            "mime_type" character varying,
            "description" text,
            "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_attachments_id" PRIMARY KEY ("id")
        )`);

        // Crear tabla notifications
        await queryRunner.query(`CREATE TABLE "notifications" (
            "id" SERIAL NOT NULL,
            "user_id" integer NOT NULL,
            "title" character varying NOT NULL,
            "message" text NOT NULL,
            "type" "public"."notifications_type_enum" NOT NULL,
            "priority" "public"."notifications_priority_enum" NOT NULL DEFAULT 'MEDIUM',
            "read" boolean NOT NULL DEFAULT false,
            "data" json,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id")
        )`);

        // Crear índices
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role")`);
        await queryRunner.query(`CREATE INDEX "IDX_pets_client_id" ON "pets" ("client_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_pet_id" ON "appointments" ("pet_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_veterinarian_id" ON "appointments" ("veterinarian_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_date_time" ON "appointments" ("date_time")`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_status" ON "appointments" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_medical_records_appointment_id" ON "medical_records" ("appointment_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_pet_id" ON "ai_diagnoses" ("pet_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_status" ON "ai_diagnoses" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_user_id" ON "notifications" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_read" ON "notifications" ("read")`);

        // Crear foreign keys
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_clients_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ADD CONSTRAINT "FK_veterinarians_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_pets_client_id" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_veterinarian_id" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD CONSTRAINT "FK_medical_records_appointment_id" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD CONSTRAINT "FK_prescriptions_medical_record_id" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD CONSTRAINT "FK_vaccinations_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD CONSTRAINT "FK_vaccinations_administered_by" FOREIGN KEY ("administered_by") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "FK_ai_diagnoses_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "FK_ai_diagnoses_appointment_id" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_attachments_medical_record_id" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar foreign keys
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user_id"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_attachments_medical_record_id"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP CONSTRAINT "FK_ai_diagnoses_appointment_id"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP CONSTRAINT "FK_ai_diagnoses_pet_id"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP CONSTRAINT "FK_vaccinations_administered_by"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP CONSTRAINT "FK_vaccinations_pet_id"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP CONSTRAINT "FK_prescriptions_medical_record_id"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP CONSTRAINT "FK_medical_records_appointment_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_veterinarian_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_pet_id"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_pets_client_id"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" DROP CONSTRAINT "FK_veterinarians_user_id"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_clients_user_id"`);

        // Eliminar índices
        await queryRunner.query(`DROP INDEX "public"."IDX_notifications_read"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_notifications_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ai_diagnoses_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ai_diagnoses_pet_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_medical_records_appointment_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_date_time"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_veterinarian_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_pet_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_pets_client_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);

        // Eliminar tablas
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
        await queryRunner.query(`DROP TABLE "ai_diagnoses"`);
        await queryRunner.query(`DROP TABLE "vaccinations"`);
        await queryRunner.query(`DROP TABLE "prescriptions"`);
        await queryRunner.query(`DROP TABLE "medical_records"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TABLE "pets"`);
        await queryRunner.query(`DROP TABLE "veterinarians"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "users"`);

        // Eliminar enums
        await queryRunner.query(`DROP TYPE "public"."prescriptions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."prescriptions_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."attachments_file_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ai_diagnoses_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_species_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
} 