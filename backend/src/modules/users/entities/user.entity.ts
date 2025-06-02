import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Client } from './client.entity';
import { Veterinarian } from './veterinarian.entity';

export enum UserRole {
  CLIENT = 'CLIENT',
  VET = 'VET',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true }) // Excluir de las respuestas
  password: string;

  @Column({ name: 'first_name' })
  @IsNotEmpty()
  firstName: string;

  @Column({ name: 'last_name' })
  @IsNotEmpty()
  lastName: string;

  @Column({ name: 'phone_number', nullable: true })
  @IsPhoneNumber(null)
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => Client, (client) => client.user)
  client?: Client;

  @OneToOne(() => Veterinarian, (veterinarian) => veterinarian.user)
  veterinarian?: Veterinarian;

  // Método helper para obtener nombre completo
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 