import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades
import { MedicalRecord } from './entities/medical-record.entity';
import { Prescription } from './entities/prescription.entity';
import { Attachment } from './entities/attachment.entity';
import { Vaccination } from './entities/vaccination.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Pet } from '../pets/entities/pet.entity';

// Servicios
import { MedicalRecordsService } from './medical-records.service';
import { PrescriptionsService } from './prescriptions.service';

// Controladores
import { MedicalRecordsController } from './medical-records.controller';
import { PrescriptionsController } from './prescriptions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalRecord,
      Prescription,
      Attachment,
      Vaccination,
      Appointment,
      Pet,
    ]),
  ],
  controllers: [
    MedicalRecordsController,
    PrescriptionsController,
  ],
  providers: [
    MedicalRecordsService,
    PrescriptionsService,
  ],
  exports: [
    MedicalRecordsService,
    PrescriptionsService,
  ],
})
export class MedicalModule {} 