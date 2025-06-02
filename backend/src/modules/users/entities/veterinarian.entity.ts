import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from './user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Vaccination } from '../../medical/entities/vaccination.entity';

export interface AvailabilityHours {
  [day: string]: {
    start: string;
    end: string;
    isAvailable: boolean;
  };
}

@Entity('veterinarians')
export class Veterinarian {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ nullable: true })
  specialization?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ name: 'license_number', unique: true })
  @IsNotEmpty()
  licenseNumber: string;

  @Column({
    name: 'availability_hours',
    type: 'jsonb',
    default: () => `'{
      "monday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "tuesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "wednesday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "thursday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "friday": {"start": "09:00", "end": "17:00", "isAvailable": true},
      "saturday": {"start": "09:00", "end": "13:00", "isAvailable": false},
      "sunday": {"start": "09:00", "end": "13:00", "isAvailable": false}
    }'`,
  })
  availabilityHours: AvailabilityHours;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => User, (user) => user.veterinarian)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.veterinarian)
  appointments: Appointment[];

  @OneToMany(() => Vaccination, (vaccination) => vaccination.administeredBy)
  vaccinations: Vaccination[];
} 