import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserPhoneColumn1749000001000 implements MigrationInterface {
    name = 'FixUserPhoneColumn1749000001000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar si existe la columna phone_number
        const hasPhoneNumberColumn = await queryRunner.hasColumn("users", "phone_number");
        
        if (!hasPhoneNumberColumn) {
            // Si no existe phone_number, verificar si existe phone y renombrarla
            const hasPhoneColumn = await queryRunner.hasColumn("users", "phone");
            
            if (hasPhoneColumn) {
                // Renombrar la columna phone a phone_number
                await queryRunner.renameColumn("users", "phone", "phone_number");
            } else {
                // Si no existe ninguna, crear phone_number
                await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying`);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Renombrar de vuelta a phone
        await queryRunner.renameColumn("users", "phone_number", "phone");
    }
} 