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
import { IsNotEmpty } from 'class-validator';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Prescription } from './prescription.entity';
import { Attachment } from './attachment.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'appointment_id' })
  appointmentId: number;

  @Column({ name: 'pet_id', nullable: true })
  petId?: number;

  @Column({ nullable: true, length: 200 })
  title?: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  treatment?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  symptoms?: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  temperature?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight?: number;

  @Column({ name: 'follow_up_date', type: 'date', nullable: true })
  followUpDate?: Date;

  @Column({ name: 'next_visit_recommendations', type: 'text', nullable: true })
  nextVisitRecommendations?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Appointment, (appointment) => appointment.medicalRecords)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => Pet, (pet) => pet.medicalRecords)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @OneToMany(() => Prescription, (prescription) => prescription.medicalRecord)
  prescriptions: Prescription[];

  @OneToMany(() => Attachment, (attachment) => attachment.medicalRecord)
  attachments: Attachment[];
} 