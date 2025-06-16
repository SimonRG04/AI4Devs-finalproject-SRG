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

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  VACCINATION = 'VACCINATION',
  SURGERY = 'SURGERY',
  EMERGENCY = 'EMERGENCY',
  CHECKUP = 'CHECKUP',
  GROOMING = 'GROOMING',
  DENTAL = 'DENTAL',
  OTHER = 'OTHER',
}

export enum AppointmentPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pet_id' })
  petId: number;

  @Column({ name: 'veterinarian_id' })
  veterinarianId: number;

  @Column({ name: 'scheduled_at', type: 'timestamp' })
  @IsDateString()
  scheduledAt: Date;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.CONSULTATION,
  })
  @IsEnum(AppointmentType)
  type: AppointmentType;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: AppointmentPriority,
    default: AppointmentPriority.NORMAL,
  })
  @IsEnum(AppointmentPriority)
  priority: AppointmentPriority;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ default: 30 })
  duration: number;

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
    return this.scheduledAt > new Date() && this.status === AppointmentStatus.SCHEDULED;
  }

  get isPast(): boolean {
    return this.scheduledAt < new Date();
  }
} 