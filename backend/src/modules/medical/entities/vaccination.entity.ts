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
import { Pet } from '../../pets/entities/pet.entity';
import { Veterinarian } from '../../users/entities/veterinarian.entity';

@Entity('vaccinations')
export class Vaccination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pet_id' })
  petId: number;

  @Column({ name: 'administered_by' })
  administeredById: number;

  @Column({ name: 'vaccine_name' })
  @IsNotEmpty()
  vaccineName: string;

  @Column({ name: 'administration_date', type: 'date' })
  @IsDateString()
  administrationDate: Date;

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  @IsDateString()
  expirationDate?: Date;

  @Column({ name: 'batch_number', nullable: true })
  batchNumber?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Pet, (pet) => pet.vaccinations)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => Veterinarian, (vet) => vet.vaccinations)
  @JoinColumn({ name: 'administered_by' })
  administeredBy: Veterinarian;

  // Métodos helper
  get isExpired(): boolean {
    if (!this.expirationDate) return false;
    return this.expirationDate < new Date();
  }

  get needsRenewal(): boolean {
    if (!this.expirationDate) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return this.expirationDate <= thirtyDaysFromNow;
  }
} 