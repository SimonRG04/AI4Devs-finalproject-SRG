import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { Client } from '../modules/users/entities/client.entity';
import { Veterinarian } from '../modules/users/entities/veterinarian.entity';
import { Pet } from '../modules/pets/entities/pet.entity';
import { Appointment } from '../modules/appointments/entities/appointment.entity';
import { MedicalRecord } from '../modules/medical/entities/medical-record.entity';
import { Prescription } from '../modules/medical/entities/prescription.entity';
import { Vaccination } from '../modules/medical/entities/vaccination.entity';
import { AIDiagnosis } from '../modules/diagnosis/entities/ai-diagnosis.entity';
import { Attachment } from '../modules/medical/entities/attachment.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') || 'localhost',
  port: parseInt(configService.get('DATABASE_PORT', '5432')),
  username: configService.get('DATABASE_USERNAME') || 'postgres',
  password: configService.get('DATABASE_PASSWORD') || 'postgres',
  database: configService.get('DATABASE_NAME') || 'vetai_connect',
  entities: [
    User,
    Client,
    Veterinarian,
    Pet,
    Appointment,
    MedicalRecord,
    Prescription,
    Vaccination,
    AIDiagnosis,
    Attachment,
    Notification,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // En producción siempre false
  logging: configService.get('NODE_ENV') === 'development',
});
