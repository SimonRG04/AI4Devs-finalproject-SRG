import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1748847005322 implements MigrationInterface {
    name = 'InitialSchema1748847005322'

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
        await queryRunner.query(`ALTER TABLE "veterinarians" ALTER COLUMN "availability_hours" SET DEFAULT '{
      "monday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "tuesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "wednesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "thursday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "friday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "saturday": {"start": "09:00", "end": "13:00", "isAvailable": false},
      "sunday": {"start": "09:00", "end": "13:00", "isAvailable": false}
    }'`);
        await queryRunner.query(`ALTER TYPE "public"."attachment_type_enum" RENAME TO "attachment_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."attachments_file_type_enum" AS ENUM('IMAGE', 'PDF', 'DOC', 'VIDEO', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "attachments" ALTER COLUMN "file_type" TYPE "public"."attachments_file_type_enum" USING "file_type"::"text"::"public"."attachments_file_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."attachment_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."diagnosis_status_enum" RENAME TO "diagnosis_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ai_diagnoses_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "status" TYPE "public"."ai_diagnoses_status_enum" USING "status"::"text"::"public"."ai_diagnoses_status_enum"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."diagnosis_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."appointment_status_enum" RENAME TO "appointment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "public"."appointments_status_enum" USING "status"::"text"::"public"."appointments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED'`);
        await queryRunner.query(`DROP TYPE "public"."appointment_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."pet_species_enum" RENAME TO "pet_species_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pets_species_enum" AS ENUM('DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'GUINEA_PIG', 'FERRET', 'REPTILE', 'FISH', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "species" TYPE "public"."pets_species_enum" USING "species"::"text"::"public"."pets_species_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pet_species_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."pet_gender_enum" RENAME TO "pet_gender_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pets_gender_enum" AS ENUM('MALE', 'FEMALE', 'UNKNOWN')`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "gender" TYPE "public"."pets_gender_enum" USING "gender"::"text"::"public"."pets_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pet_gender_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('CLIENT', 'VET', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('APPOINTMENT_REMINDER', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'PRESCRIPTION_REMINDER', 'VACCINATION_DUE', 'DIAGNOSIS_READY', 'MEDICAL_RECORD_UPDATED', 'SYSTEM_ALERT')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notifications_type_enum" USING "type"::"text"::"public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_priority_enum" RENAME TO "notification_priority_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "priority" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "priority" TYPE "public"."notifications_priority_enum" USING "priority"::"text"::"public"."notifications_priority_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "priority" SET DEFAULT 'MEDIUM'`);
        await queryRunner.query(`DROP TYPE "public"."notification_priority_enum_old"`);
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
        await queryRunner.query(`CREATE TYPE "public"."notification_priority_enum_old" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "priority" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "priority" TYPE "public"."notification_priority_enum_old" USING "priority"::"text"::"public"."notification_priority_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "priority" SET DEFAULT 'MEDIUM'`);
        await queryRunner.query(`DROP TYPE "public"."notifications_priority_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_priority_enum_old" RENAME TO "notification_priority_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum_old" AS ENUM('APPOINTMENT_REMINDER', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'PRESCRIPTION_REMINDER', 'VACCINATION_DUE', 'DIAGNOSIS_READY', 'MEDICAL_RECORD_UPDATED', 'SYSTEM_ALERT')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('CLIENT', 'VET', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."pet_gender_enum_old" AS ENUM('MALE', 'FEMALE', 'UNKNOWN')`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "gender" TYPE "public"."pet_gender_enum_old" USING "gender"::"text"::"public"."pet_gender_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."pets_gender_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pet_gender_enum_old" RENAME TO "pet_gender_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."pet_species_enum_old" AS ENUM('DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'GUINEA_PIG', 'FERRET', 'REPTILE', 'FISH', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "species" TYPE "public"."pet_species_enum_old" USING "species"::"text"::"public"."pet_species_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."pets_species_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pet_species_enum_old" RENAME TO "pet_species_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_status_enum_old" AS ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "public"."appointment_status_enum_old" USING "status"::"text"::"public"."appointment_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED'`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."appointment_status_enum_old" RENAME TO "appointment_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."diagnosis_status_enum_old" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "status" TYPE "public"."diagnosis_status_enum_old" USING "status"::"text"::"public"."diagnosis_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnoses" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."ai_diagnoses_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."diagnosis_status_enum_old" RENAME TO "diagnosis_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."attachment_type_enum_old" AS ENUM('IMAGE', 'PDF', 'DOC', 'VIDEO', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "attachments" ALTER COLUMN "file_type" TYPE "public"."attachment_type_enum_old" USING "file_type"::"text"::"public"."attachment_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."attachments_file_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."attachment_type_enum_old" RENAME TO "attachment_type_enum"`);
        await queryRunner.query(`ALTER TABLE "veterinarians" ALTER COLUMN "availability_hours" SET DEFAULT '{"friday": {"end": "17:00", "start": "09:00", "isAvailable": true}, "monday": {"end": "17:00", "start": "09:00", "isAvailable": true}, "sunday": {"end": "13:00", "start": "09:00", "isAvailable": false}, "tuesday": {"end": "17:00", "start": "09:00", "isAvailable": true}, "saturday": {"end": "13:00", "start": "09:00", "isAvailable": false}, "thursday": {"end": "17:00", "start": "09:00", "isAvailable": true}, "wednesday": {"end": "17:00", "start": "09:00", "isAvailable": true}}'`);
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
