import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisService } from './diagnosis.service';
import { DeepSeekService } from './providers/deepseek.service';
import { AIDiagnosis } from './entities/ai-diagnosis.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AIDiagnosis, Pet, Appointment]),
    ConfigModule,
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService, DeepSeekService],
  exports: [DiagnosisService, DeepSeekService],
})
export class DiagnosisModule {} 