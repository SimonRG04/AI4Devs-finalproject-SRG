import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Veterinarian } from '../users/entities/veterinarian.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Pet, Veterinarian]),
    AuthModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService, TypeOrmModule],
})
export class AppointmentsModule {} 