import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateDiagnosisTable1750120000000 implements MigrationInterface {
  name = 'CreateDiagnosisTable1750120000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla ai_diagnoses
    await queryRunner.createTable(
      new Table({
        name: 'ai_diagnoses',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'pet_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'appointment_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'results',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'confidence',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
            default: "'PENDING'",
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'processed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Crear índices
    await queryRunner.createIndex('ai_diagnoses', 
      new TableIndex({
        name: 'IDX_ai_diagnoses_pet_id',
        columnNames: ['pet_id']
      })
    );

    await queryRunner.createIndex('ai_diagnoses', 
      new TableIndex({
        name: 'IDX_ai_diagnoses_appointment_id',
        columnNames: ['appointment_id']
      })
    );

    await queryRunner.createIndex('ai_diagnoses', 
      new TableIndex({
        name: 'IDX_ai_diagnoses_status',
        columnNames: ['status']
      })
    );

    await queryRunner.createIndex('ai_diagnoses', 
      new TableIndex({
        name: 'IDX_ai_diagnoses_created_at',
        columnNames: ['created_at']
      })
    );

    // Crear claves foráneas
    await queryRunner.createForeignKey('ai_diagnoses', 
      new TableForeignKey({
        columnNames: ['pet_id'],
        referencedTableName: 'pets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'FK_ai_diagnoses_pet_id',
      })
    );

    await queryRunner.createForeignKey('ai_diagnoses', 
      new TableForeignKey({
        columnNames: ['appointment_id'],
        referencedTableName: 'appointments',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        name: 'FK_ai_diagnoses_appointment_id',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar claves foráneas
    await queryRunner.dropForeignKey('ai_diagnoses', 'FK_ai_diagnoses_appointment_id');
    await queryRunner.dropForeignKey('ai_diagnoses', 'FK_ai_diagnoses_pet_id');

    // Eliminar índices
    await queryRunner.dropIndex('ai_diagnoses', 'IDX_ai_diagnoses_created_at');
    await queryRunner.dropIndex('ai_diagnoses', 'IDX_ai_diagnoses_status');
    await queryRunner.dropIndex('ai_diagnoses', 'IDX_ai_diagnoses_appointment_id');
    await queryRunner.dropIndex('ai_diagnoses', 'IDX_ai_diagnoses_pet_id');

    // Eliminar tabla
    await queryRunner.dropTable('ai_diagnoses');
  }
} 