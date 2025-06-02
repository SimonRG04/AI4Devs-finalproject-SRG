import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { Pet } from '../../pets/entities/pet.entity';
import { Veterinarian } from '../../users/entities/veterinarian.entity';
import { MedicalRecord } from '../../medical/entities/medical-record.entity';
import { AIDiagnosis } from '../../diagnosis/entities/ai-diagnosis.entity';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pet_id' })
  petId: number;

  @Column({ name: 'veterinarian_id' })
  veterinarianId: number;

  @Column({ name: 'date_time', type: 'timestamp' })
  @IsDateString()
  dateTime: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @Column()
  @IsNotEmpty()
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'duration_minutes', default: 30 })
  durationMinutes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Pet, (pet) => pet.appointments)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => Veterinarian, (veterinarian) => veterinarian.appointments)
  @JoinColumn({ name: 'veterinarian_id' })
  veterinarian: Veterinarian;

  @OneToMany(() => MedicalRecord, (record) => record.appointment)
  medicalRecords: MedicalRecord[];

  @OneToMany(() => AIDiagnosis, (diagnosis) => diagnosis.appointment)
  aiDiagnoses: AIDiagnosis[];

  // Métodos helper
  get isUpcoming(): boolean {
    return this.dateTime > new Date() && this.status === AppointmentStatus.SCHEDULED;
  }

  get isPast(): boolean {
    return this.dateTime < new Date();
  }
} 