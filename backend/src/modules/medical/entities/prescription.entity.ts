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

  @Column()
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

  @Column({ name: 'start_date', type: 'date' })
  @IsDateString()
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

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
    if (this.status !== PrescriptionStatus.ACTIVE) return false;
    
    const today = new Date();
    
    // Si no hay fecha de fin, verificar solo que haya empezado
    if (!this.endDate) {
      return this.startDate <= today;
    }
    
    // Si hay fecha de fin, verificar que esté en el rango
    return this.startDate <= today && today <= this.endDate;
  }

  get daysRemaining(): number | null {
    if (!this.endDate || this.status !== PrescriptionStatus.ACTIVE) return null;
    
    const today = new Date();
    const diffTime = this.endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  get totalDurationDays(): number | null {
    if (!this.endDate) return null;
    
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 1;
  }
} 