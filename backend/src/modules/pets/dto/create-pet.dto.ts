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
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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

  @ApiProperty({
    description: 'Raza de la mascota',
    example: 'Golden Retriever',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'La raza es obligatoria' })
  @IsString({ message: 'La raza debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La raza no puede exceder los 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  breed: string;

  @ApiProperty({
    description: 'Fecha de nacimiento de la mascota',
    example: '2020-01-15',
    type: 'string',
    format: 'date',
  })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate: string;

  @ApiProperty({
    description: 'Género de la mascota',
    enum: PetGender,
    example: PetGender.MALE,
  })
  @IsNotEmpty({ message: 'El género es obligatorio' })
  @IsEnum(PetGender, { message: 'El género debe ser una opción válida' })
  gender: PetGender;

  @ApiProperty({
    description: 'Peso de la mascota en kilogramos',
    example: 25.5,
    minimum: 0.1,
    maximum: 999.99,
  })
  @IsNotEmpty({ message: 'El peso es obligatorio' })
  @IsPositive({ message: 'El peso debe ser un número positivo' })
  @Type(() => Number)
  weight: number;

  @ApiPropertyOptional({
    description: 'Color del pelaje/plumaje de la mascota',
    example: 'Dorado',
    maxLength: 30,
  })
  @IsOptional()
  @IsString({ message: 'El color debe ser una cadena de texto' })
  @MaxLength(30, { message: 'El color no puede exceder los 30 caracteres' })
  @Transform(({ value }) => value?.trim())
  color?: string;

  @ApiPropertyOptional({
    description: 'Número de identificación del microchip',
    example: '982009106277001',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'El ID del microchip debe ser una cadena de texto' })
  @MaxLength(20, { message: 'El ID del microchip no puede exceder los 20 caracteres' })
  @Transform(({ value }) => value?.trim())
  microchipId?: string;

  @ApiPropertyOptional({
    description: 'Indica si la mascota está esterilizada/castrada',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado de esterilización debe ser verdadero o falso' })
  @Type(() => Boolean)
  isNeutered?: boolean;

  @ApiPropertyOptional({
    description: 'Condiciones médicas conocidas',
    example: 'Displasia de cadera, artritis',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Las condiciones médicas deben ser texto' })
  @MaxLength(500, { message: 'Las condiciones médicas no pueden exceder los 500 caracteres' })
  @Transform(({ value }) => value?.trim())
  medicalConditions?: string;

  @ApiPropertyOptional({
    description: 'Alergias conocidas',
    example: 'Alérgico al pollo, polen',
    maxLength: 300,
  })
  @IsOptional()
  @IsString({ message: 'Las alergias deben ser texto' })
  @MaxLength(300, { message: 'Las alergias no pueden exceder los 300 caracteres' })
  @Transform(({ value }) => value?.trim())
  allergies?: string;

  @ApiPropertyOptional({
    description: 'Alertas médicas importantes',
    example: 'Alérgico a la penicilina, problemas cardíacos',
    maxLength: 300,
  })
  @IsOptional()
  @IsString({ message: 'Las alertas médicas deben ser texto' })
  @MaxLength(300, { message: 'Las alertas médicas no pueden exceder los 300 caracteres' })
  @Transform(({ value }) => value?.trim())
  medicalAlerts?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de la mascota',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL de la foto debe ser válida' })
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la mascota',
    example: 'Muy activo, le gusta jugar en el parque',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  @MaxLength(500, { message: 'Las notas no pueden exceder los 500 caracteres' })
  @Transform(({ value }) => value?.trim())
  notes?: string;
} 