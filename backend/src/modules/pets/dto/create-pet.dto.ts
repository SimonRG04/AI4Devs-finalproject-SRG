import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsPositive,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PetGender, PetSpecies } from '../entities/pet.entity';

export class CreatePetDto {
  @ApiProperty({
    description: 'Nombre de la mascota',
    example: 'Max',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Especie de la mascota',
    enum: PetSpecies,
    example: PetSpecies.DOG,
  })
  @IsNotEmpty({ message: 'La especie es obligatoria' })
  @IsEnum(PetSpecies, { message: 'La especie debe ser una opción válida' })
  species: PetSpecies;

  @ApiPropertyOptional({
    description: 'Raza de la mascota',
    example: 'Golden Retriever',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'La raza debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La raza no puede exceder los 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  breed?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento de la mascota',
    example: '2020-01-15',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate?: string;

  @ApiProperty({
    description: 'Género de la mascota',
    enum: PetGender,
    example: PetGender.MALE,
  })
  @IsNotEmpty({ message: 'El género es obligatorio' })
  @IsEnum(PetGender, { message: 'El género debe ser una opción válida' })
  gender: PetGender;

  @ApiPropertyOptional({
    description: 'Peso de la mascota en kilogramos',
    example: 25.5,
    minimum: 0.1,
    maximum: 999.99,
  })
  @IsOptional()
  @IsPositive({ message: 'El peso debe ser un número positivo' })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Alertas médicas importantes',
    example: 'Alérgico a la penicilina, problemas cardíacos',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Las alertas médicas deben ser texto' })
  @MaxLength(1000, { message: 'Las alertas médicas no pueden exceder los 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  medicalAlerts?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de la mascota',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL de la foto debe ser válida' })
  photoUrl?: string;
} 