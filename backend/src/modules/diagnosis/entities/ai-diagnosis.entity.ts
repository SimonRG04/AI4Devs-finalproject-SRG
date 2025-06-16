import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsEnum, IsUrl, Min, Max } from 'class-validator';
import { Pet } from '../../pets/entities/pet.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum DiagnosisStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface DiagnosisResults {
  conditions: Array<{
    name: string;
    probability: number;
    description: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  recommendations: string[];
  confidence: number;
  processingTime?: number;
  metadata?: {
    imageQuality?: number;
    modelVersion?: string;
    timestamp?: string;
  };
}

@Entity('ai_diagnoses')
export class AIDiagnosis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pet_id' })
  petId: number;

  @Column({ name: 'appointment_id', nullable: true })
  appointmentId?: number;

  @Column({ name: 'image_url', nullable: true })
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  imageUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  results?: DiagnosisResults;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  @Min(0)
  @Max(1)
  confidence?: number;

  @Column({
    type: 'enum',
    enum: DiagnosisStatus,
    default: DiagnosisStatus.PENDING,
  })
  @IsEnum(DiagnosisStatus)
  status: DiagnosisStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Pet, (pet) => pet.aiDiagnoses)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => Appointment, (appointment) => appointment.aiDiagnoses, { nullable: true })
  @JoinColumn({ name: 'appointment_id' })
  appointment?: Appointment;

  // Métodos helper
  get isCompleted(): boolean {
    return this.status === DiagnosisStatus.COMPLETED;
  }

  get isFailed(): boolean {
    return this.status === DiagnosisStatus.FAILED;
  }

  get isPending(): boolean {
    return [DiagnosisStatus.PENDING, DiagnosisStatus.PROCESSING].includes(this.status);
  }

  get primaryCondition(): string | null {
    if (!this.results?.conditions?.length) return null;
    return this.results.conditions[0].name;
  }
} 