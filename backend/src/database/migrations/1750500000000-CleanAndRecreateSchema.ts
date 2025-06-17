import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanAndRecreateSchema1750500000000 implements MigrationInterface {
  name = 'CleanAndRecreateSchema1750500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🧹 Iniciando limpieza completa de la base de datos...');

    // 1. DROP todas las tablas existentes (en orden para respetar foreign keys)
    console.log('📋 Eliminando todas las tablas existentes...');
    
    await queryRunner.query(`DROP TABLE IF EXISTS "vaccinations" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prescriptions" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "attachments" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ai_diagnoses" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "medical_records" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pets" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clients" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "veterinarians" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "migrations" CASCADE;`);

    // 2. DROP todos los enums existentes
    console.log('🔧 Eliminando todos los tipos ENUM...');
    
    await queryRunner.query(`DROP TYPE IF EXISTS "ai_diagnoses_status_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "appointments_priority_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "appointments_status_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "appointments_type_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "attachments_file_type_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notifications_priority_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notifications_type_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "pets_gender_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "pets_species_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "prescriptions_frequency_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "prescriptions_status_enum" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum" CASCADE;`);

    // 3. DROP todas las secuencias existentes
    console.log('🔢 Eliminando secuencias...');
    
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "ai_diagnoses_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "appointments_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "attachments_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "clients_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "medical_records_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "notifications_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "pets_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "prescriptions_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "users_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "vaccinations_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "veterinarians_id_seq" CASCADE;`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "migrations_id_seq" CASCADE;`);

    console.log('✨ Limpieza completada. Creando estructura nueva...');

    // 4. Crear todos los tipos ENUM
    console.log('🎨 Creando tipos ENUM...');
    
    await queryRunner.query(`
      CREATE TYPE "ai_diagnoses_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "appointments_priority_enum" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "appointments_status_enum" AS ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "appointments_type_enum" AS ENUM('CONSULTATION', 'VACCINATION', 'CHECKUP', 'SURGERY', 'EMERGENCY', 'FOLLOW_UP', 'GROOMING');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "attachments_file_type_enum" AS ENUM('IMAGE', 'PDF', 'DOC', 'VIDEO', 'OTHER');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "notifications_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "notifications_type_enum" AS ENUM('APPOINTMENT_REMINDER', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'PRESCRIPTION_REMINDER', 'VACCINATION_DUE', 'DIAGNOSIS_READY', 'MEDICAL_RECORD_UPDATED', 'SYSTEM_ALERT');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "pets_gender_enum" AS ENUM('MALE', 'FEMALE', 'UNKNOWN');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "pets_species_enum" AS ENUM('DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'GUINEA_PIG', 'FERRET', 'REPTILE', 'FISH', 'OTHER');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "prescriptions_frequency_enum" AS ENUM('ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'EVERY_6_HOURS', 'AS_NEEDED', 'WEEKLY', 'MONTHLY');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "prescriptions_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'DISCONTINUED', 'SUSPENDED');
    `);
    
    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM('CLIENT', 'VET', 'ADMIN');
    `);

    // 5. Crear tabla users (primera para foreign keys)
    console.log('👥 Creando tabla users...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "phone_number" character varying,
        "role" "users_role_enum" NOT NULL DEFAULT 'CLIENT',
        "email_verified" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      );
    `);

    // 6. Crear tabla clients
    console.log('🏠 Creando tabla clients...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "clients" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "address" character varying,
        "emergency_contact" character varying,
        "emergency_phone" character varying,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_clients_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_clients_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_clients_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 7. Crear tabla veterinarians
    console.log('👨‍⚕️ Creando tabla veterinarians...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "veterinarians" (
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
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_veterinarians_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_veterinarians_license_number" UNIQUE ("license_number"),
        CONSTRAINT "UQ_veterinarians_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_veterinarians_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 8. Crear tabla pets
    console.log('🐕 Creando tabla pets...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pets" (
        "id" SERIAL NOT NULL,
        "client_id" integer NOT NULL,
        "name" character varying NOT NULL,
        "species" "pets_species_enum" NOT NULL,
        "breed" character varying,
        "gender" "pets_gender_enum" NOT NULL,
        "birth_date" TIMESTAMP,
        "weight" numeric(5,2),
        "color" character varying,
        "microchip_id" character varying,
        "is_neutered" boolean DEFAULT false,
        "medical_conditions" text,
        "allergies" text,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "medical_alerts" text,
        "photo_url" character varying,
        CONSTRAINT "PK_pets_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pets_client_id" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE
      );
    `);

    // 9. Crear tabla appointments
    console.log('📅 Creando tabla appointments...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "appointments" (
        "id" SERIAL NOT NULL,
        "pet_id" integer NOT NULL,
        "veterinarian_id" integer NOT NULL,
        "scheduled_at" TIMESTAMP NOT NULL,
        "duration" integer NOT NULL DEFAULT 30,
        "type" character varying NOT NULL,
        "status" "appointments_status_enum" NOT NULL DEFAULT 'SCHEDULED',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "notes" text,
        "priority" character varying(20) DEFAULT 'NORMAL',
        "images" jsonb DEFAULT '[]',
        CONSTRAINT "PK_appointments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_appointments_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_appointments_veterinarian_id" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("id") ON DELETE CASCADE
      );
    `);

    // 10. Crear tabla medical_records
    console.log('📋 Creando tabla medical_records...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "medical_records" (
        "id" SERIAL NOT NULL,
        "appointment_id" integer NOT NULL,
        "diagnosis" text NOT NULL,
        "treatment" text,
        "observations" text,
        "weight" numeric(5,2),
        "temperature" numeric(4,2),
        "heart_rate" integer,
        "respiratory_rate" integer,
        "blood_pressure" character varying,
        "follow_up_date" TIMESTAMP,
        "follow_up_notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "title" character varying(200),
        "notes" text,
        "symptoms" text,
        "next_visit_recommendations" text,
        "pet_id" integer,
        CONSTRAINT "PK_medical_records_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_medical_records_appointment_id" UNIQUE ("appointment_id"),
        CONSTRAINT "FK_medical_records_appointment_id" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_medical_records_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION
      );
    `);

    // 11. Crear tabla ai_diagnoses
    console.log('🤖 Creando tabla ai_diagnoses...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ai_diagnoses" (
        "id" SERIAL NOT NULL,
        "pet_id" integer NOT NULL,
        "appointment_id" integer,
        "symptoms" text,
        "results" json,
        "confidence" numeric(3,2),
        "possible_conditions" text,
        "recommendations" text,
        "status" "ai_diagnoses_status_enum" NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "image_url" character varying,
        "description" text,
        "error_message" text,
        "processed_at" TIMESTAMP,
        CONSTRAINT "PK_ai_diagnoses_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ai_diagnoses_appointment_id" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_ai_diagnoses_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE
      );
    `);

    // 12. Crear tabla attachments
    console.log('📎 Creando tabla attachments...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "attachments" (
        "id" SERIAL NOT NULL,
        "medical_record_id" integer NOT NULL,
        "file_name" character varying NOT NULL,
        "file_path" character varying NOT NULL,
        "file_size" integer,
        "file_type" "attachments_file_type_enum" NOT NULL,
        "mime_type" character varying,
        "description" text,
        "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_attachments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_attachments_medical_record_id" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE
      );
    `);

    // 13. Crear tabla prescriptions
    console.log('💊 Creando tabla prescriptions...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "prescriptions" (
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
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_prescriptions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_prescriptions_medical_record_id" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE
      );
    `);

    // 14. Crear tabla vaccinations
    console.log('💉 Creando tabla vaccinations...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vaccinations" (
        "id" SERIAL NOT NULL,
        "pet_id" integer NOT NULL,
        "vaccine_name" character varying NOT NULL,
        "administration_date" TIMESTAMP NOT NULL,
        "expiration_date" TIMESTAMP,
        "batch_number" character varying,
        "administered_by" integer NOT NULL,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_vaccinations_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_vaccinations_administered_by" FOREIGN KEY ("administered_by") REFERENCES "veterinarians"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_vaccinations_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE
      );
    `);

    // 15. Crear tabla notifications
    console.log('🔔 Creando tabla notifications...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "title" character varying NOT NULL,
        "message" text NOT NULL,
        "type" "notifications_type_enum" NOT NULL,
        "priority" "notifications_priority_enum" NOT NULL DEFAULT 'MEDIUM',
        "read" boolean NOT NULL DEFAULT false,
        "data" json,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 16. Crear tabla migrations
    console.log('📊 Creando tabla migrations...');
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "id" SERIAL NOT NULL,
        "timestamp" bigint NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
      );
    `);

    // 17. Crear índices
    console.log('🗂️ Creando índices...');
    
    // Índices para users
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_users_role" ON "users" ("role");`);

    // Índices para pets
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_pets_client_id" ON "pets" ("client_id");`);

    // Índices para appointments
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_date_time" ON "appointments" ("scheduled_at");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_pet_id" ON "appointments" ("pet_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_scheduled_at" ON "appointments" ("scheduled_at");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_status" ON "appointments" ("status");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_appointments_veterinarian_id" ON "appointments" ("veterinarian_id");`);

    // Índices para medical_records
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_medical_records_appointment_id" ON "medical_records" ("appointment_id");`);

    // Índices para ai_diagnoses
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ai_diagnoses_appointment_id" ON "ai_diagnoses" ("appointment_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ai_diagnoses_pet_id" ON "ai_diagnoses" ("pet_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ai_diagnoses_status" ON "ai_diagnoses" ("status");`);

    // Índices para notifications
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_notifications_read" ON "notifications" ("read");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_notifications_user_id" ON "notifications" ("user_id");`);

    console.log('✅ Base de datos recreada completamente con estructura limpia!');
    console.log('🎯 Estructura idéntica a DatabaseTables.sql aplicada correctamente');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('⚠️ Reversión de migración CleanAndRecreateSchema no implementada');
    console.log('🔄 Para revertir, elimine manualmente todas las tablas y tipos');
  }
}