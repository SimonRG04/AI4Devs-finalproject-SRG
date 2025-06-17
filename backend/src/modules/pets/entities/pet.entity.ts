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
import { IsNotEmpty, IsEnum, IsPositive } from 'class-validator';
import { Client } from '../../users/entities/client.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Vaccination } from '../../medical/entities/vaccination.entity';
import { MedicalRecord } from '../../medical/entities/medical-record.entity';
import { AIDiagnosis } from '../../diagnosis/entities/ai-diagnosis.entity';

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNKNOWN = 'UNKNOWN',
}

export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RABBIT = 'RABBIT',
  HAMSTER = 'HAMSTER',
  GUINEA_PIG = 'GUINEA_PIG',
  FERRET = 'FERRET',
  REPTILE = 'REPTILE',
  FISH = 'FISH',
  OTHER = 'OTHER',
}

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'enum',
    enum: PetSpecies,
  })
  @IsEnum(PetSpecies)
  species: PetSpecies;

  @Column({ nullable: true })
  breed?: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate?: Date;

  @Column({
    type: 'enum',
    enum: PetGender,
  })
  @IsEnum(PetGender)
  gender: PetGender;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  @IsPositive()
  weight?: number;

  @Column({ nullable: true })
  color?: string;

  @Column({ name: 'microchip_id', nullable: true })
  microchipId?: string;

  @Column({ name: 'is_neutered', default: false })
  isNeutered: boolean;

  @Column({ name: 'medical_conditions', type: 'text', nullable: true })
  medicalConditions?: string;

  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @Column({ name: 'medical_alerts', type: 'text', nullable: true })
  medicalAlerts?: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Client, (client) => client.pets)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToMany(() => Appointment, (appointment) => appointment.pet)
  appointments: Appointment[];

  @OneToMany(() => Vaccination, (vaccination) => vaccination.pet)
  vaccinations: Vaccination[];

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.pet)
  medicalRecords: MedicalRecord[];

  @OneToMany(() => AIDiagnosis, (diagnosis) => diagnosis.pet)
  aiDiagnoses: AIDiagnosis[];

  // Métodos helper
  get age(): number | null {
    if (!this.birthDate) return null;
    const today = new Date();
    const birth = new Date(this.birthDate);
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }
} 