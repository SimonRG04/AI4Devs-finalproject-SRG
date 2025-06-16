import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAppointmentsTable1750032503315 implements MigrationInterface {
    name = 'UpdateAppointmentsTable1750032503315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP CONSTRAINT "FK_vaccinations_pet_id"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP CONSTRAINT "FK_vaccinations_administered_by"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" DROP CONSTRAINT "FK_veterinarians_user_id"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP CONSTRAINT "FK_prescriptions_medical_record_id"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_attachments_medical_record_id"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP CONSTRAINT "FK_medical_records_appointment_id"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP CONSTRAINT "FK_ai_diagnoses_pet_id"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP CONSTRAINT "FK_ai_diagnoses_appointment_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_pet_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_veterinarian_id"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_pets_client_id"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_clients_user_id"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_medical_records_appointment_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ai_diagnoses_pet_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ai_diagnoses_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_pet_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_veterinarian_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_date_time"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_pets_client_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_notifications_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_notifications_read"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP COLUMN "date_administered"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP COLUMN "next_due_date"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" DROP COLUMN "experience_years"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" DROP COLUMN "education"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" DROP COLUMN "consultation_fee"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "medication_name"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "file_path"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "uploaded_at"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "observations"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "temperature"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "heart_rate"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "respiratory_rate"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "blood_pressure"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "follow_up_notes"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "symptoms"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "ai_response"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "confidence_score"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "possible_conditions"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "recommendations"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "date_time"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "duration_minutes"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "reason"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "emergency_contact"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "emergency_phone"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_verified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD "administration_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD "expiration_date" date`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "medication" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "start_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "end_date" date`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD "file_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "symptoms" text`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "next_visit_recommendations" text`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "image_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "results" jsonb`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "confidence" numeric(3,2)`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "error_message" text`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "processed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "scheduled_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_type_enum" AS ENUM('CONSULTATION', 'VACCINATION', 'SURGERY', 'EMERGENCY', 'CHECKUP', 'GROOMING', 'DENTAL', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "type" "public"."appointments_type_enum" NOT NULL DEFAULT 'CONSULTATION'`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_priority_enum" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT')`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "priority" "public"."appointments_priority_enum" NOT NULL DEFAULT 'NORMAL'`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "duration" integer NOT NULL DEFAULT '30'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "read_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "expires_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "veterinarians" DROP COLUMN "availability_hours"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ADD "availability_hours" jsonb NOT NULL DEFAULT '{
      "monday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "tuesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "wednesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "thursday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "friday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "saturday": {"start": "09:00", "end": "13:00", "isAvailable": false},
      "sunday": {"start": "09:00", "end": "13:00", "isAvailable": false}
    }'`);
        await queryRunner.query(`ALTER TABLE "attachments" ALTER COLUMN "file_size" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP CONSTRAINT "UQ_medical_records_appointment_id"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "follow_up_date"`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "follow_up_date" date`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "birth_date"`);
        await queryRunner.query(`ALTER TABLE "pets" ADD "birth_date" date`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "is_neutered" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD CONSTRAINT "FK_2441ddbfe02a92e11a974aa1f81" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD CONSTRAINT "FK_cbf2aee90ab3bc7ac03bf5c7938" FOREIGN KEY ("administered_by") REFERENCES "veterinarians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ADD CONSTRAINT "FK_a3ec466590c5768534b34a5a9e4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD CONSTRAINT "FK_c08f4e7ba1be3af7cf50e4d2eae" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_303452509312330b58b0511288b" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD CONSTRAINT "FK_4185307f688fcdf88d700b23631" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "FK_c20324737da0346ab441940e216" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "FK_55db2b25d07377093036e76d113" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_47439f4739409e7e27f2e5444d5" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_928986ec679d42f78b139bff0f5" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_988587d509b683ec72fca9f16fa" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_07a7a09b04e7b035c9d90cf4984" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_07a7a09b04e7b035c9d90cf4984"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_988587d509b683ec72fca9f16fa"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_928986ec679d42f78b139bff0f5"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_47439f4739409e7e27f2e5444d5"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP CONSTRAINT "FK_55db2b25d07377093036e76d113"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP CONSTRAINT "FK_c20324737da0346ab441940e216"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP CONSTRAINT "FK_4185307f688fcdf88d700b23631"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_303452509312330b58b0511288b"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP CONSTRAINT "FK_c08f4e7ba1be3af7cf50e4d2eae"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" DROP CONSTRAINT "FK_a3ec466590c5768534b34a5a9e4"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP CONSTRAINT "FK_cbf2aee90ab3bc7ac03bf5c7938"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP CONSTRAINT "FK_2441ddbfe02a92e11a974aa1f81"`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "is_neutered" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "birth_date"`);
        await queryRunner.query(`ALTER TABLE "pets" ADD "birth_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "follow_up_date"`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "follow_up_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD CONSTRAINT "UQ_medical_records_appointment_id" UNIQUE ("appointment_id")`);
        await queryRunner.query(`ALTER TABLE "attachments" ALTER COLUMN "file_size" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "veterinarians" DROP COLUMN "availability_hours"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ADD "availability_hours" json DEFAULT '{
                "monday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                "tuesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                "wednesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                "thursday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                "friday": {"start": "09:00", "end": "17:00", "isAvailable": true},
                "saturday": {"start": "09:00", "end": "13:00", "isAvailable": false},
                "sunday": {"start": "09:00", "end": "13:00", "isAvailable": false}
            }'`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "read_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "priority"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_priority_enum"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_type_enum"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "scheduled_at"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "processed_at"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "error_message"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "confidence"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "results"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" DROP COLUMN "image_url"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "next_visit_recommendations"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "symptoms"`);
        await queryRunner.query(`ALTER TABLE "medical_records" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "file_url"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN "medication"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP COLUMN "expiration_date"`);
        await queryRunner.query(`ALTER TABLE "vaccinations" DROP COLUMN "administration_date"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "data" json`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "emergency_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "emergency_contact" character varying`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "reason" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "duration_minutes" integer NOT NULL DEFAULT '30'`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "date_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "recommendations" text`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "possible_conditions" text`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "confidence_score" numeric(3,2)`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "ai_response" json`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD "symptoms" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "follow_up_notes" text`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "blood_pressure" character varying`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "respiratory_rate" integer`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "heart_rate" integer`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "temperature" numeric(4,2)`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "weight" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD "observations" text`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD "uploaded_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD "file_path" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "duration" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD "medication_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ADD "consultation_fee" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ADD "education" text`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ADD "experience_years" integer`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD "next_due_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD "date_administered" TIMESTAMP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_read" ON "notifications" ("read") `);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_user_id" ON "notifications" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_pets_client_id" ON "pets" ("client_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_status" ON "appointments" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_date_time" ON "appointments" ("date_time") `);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_veterinarian_id" ON "appointments" ("veterinarian_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_pet_id" ON "appointments" ("pet_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_status" ON "ai_diagnoses" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_ai_diagnoses_pet_id" ON "ai_diagnoses" ("pet_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_medical_records_appointment_id" ON "medical_records" ("appointment_id") `);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_clients_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_pets_client_id" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_veterinarian_id" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "FK_ai_diagnoses_appointment_id" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "FK_ai_diagnoses_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medical_records" ADD CONSTRAINT "FK_medical_records_appointment_id" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_attachments_medical_record_id" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prescriptions" ADD CONSTRAINT "FK_prescriptions_medical_record_id" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ADD CONSTRAINT "FK_veterinarians_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD CONSTRAINT "FK_vaccinations_administered_by" FOREIGN KEY ("administered_by") REFERENCES "veterinarians"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vaccinations" ADD CONSTRAINT "FK_vaccinations_pet_id" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
