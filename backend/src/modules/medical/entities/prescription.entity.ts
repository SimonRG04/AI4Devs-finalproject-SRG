import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { MedicalRecord } from './medical-record.entity';

export enum PrescriptionFrequency {
  ONCE_DAILY = 'ONCE_DAILY',
  TWICE_DAILY = 'TWICE_DAILY',
  THREE_TIMES_DAILY = 'THREE_TIMES_DAILY',
  FOUR_TIMES_DAILY = 'FOUR_TIMES_DAILY',
  EVERY_8_HOURS = 'EVERY_8_HOURS',
  EVERY_12_HOURS = 'EVERY_12_HOURS',
  EVERY_6_HOURS = 'EVERY_6_HOURS',
  AS_NEEDED = 'AS_NEEDED',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum PrescriptionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
  SUSPENDED = 'SUSPENDED',
}

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'medical_record_id' })
  medicalRecordId: number;

  @Column({ name: 'medication_name' })
  @IsNotEmpty()
  medication: string;

  @Column()
  @IsNotEmpty()
  dosage: string;

  @Column({
    type: 'enum',
    enum: PrescriptionFrequency,
    default: PrescriptionFrequency.TWICE_DAILY,
  })
  @IsEnum(PrescriptionFrequency)
  frequency: PrescriptionFrequency;

  @Column({ type: 'integer' })
  @IsNotEmpty()
  duration: number;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  instructions?: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.ACTIVE,
  })
  @IsEnum(PrescriptionStatus)
  status: PrescriptionStatus;

  @Column({ nullable: true })
  @IsOptional()
  quantity?: number;

  @Column({ nullable: true, length: 50 })
  @IsOptional()
  unit?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => MedicalRecord, (record) => record.prescriptions)
  @JoinColumn({ name: 'medical_record_id' })
  medicalRecord: MedicalRecord;

  // Métodos helper
  get isActive(): boolean {
    return this.status === PrescriptionStatus.ACTIVE;
  }

  get daysRemaining(): number | null {
    if (this.status !== PrescriptionStatus.ACTIVE) return null;
    
    // Calcular en base a la fecha de creación + duración
    const startDate = this.createdAt;
    const endDate = new Date(startDate.getTime() + (this.duration * 24 * 60 * 60 * 1000));
    const today = new Date();
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  get totalDurationDays(): number {
    return this.duration;
  }

  get endDate(): Date {
    // Calcular fecha de fin basada en createdAt + duration
    return new Date(this.createdAt.getTime() + (this.duration * 24 * 60 * 60 * 1000));
  }
} 