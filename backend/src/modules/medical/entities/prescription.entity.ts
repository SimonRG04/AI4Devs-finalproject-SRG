import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { MedicalRecord } from './medical-record.entity';

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

  @Column()
  @IsNotEmpty()
  frequency: string;

  @Column({ name: 'start_date', type: 'date' })
  @IsDateString()
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  @IsDateString()
  endDate?: Date;

  @Column({ type: 'text', nullable: true })
  instructions?: string;

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
    const today = new Date();
    if (!this.endDate) return this.startDate <= today;
    return this.startDate <= today && today <= this.endDate;
  }
} 