import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsPositive,
  MinLength,
  MaxLength,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PrescriptionFrequency, PrescriptionStatus } from '../entities/prescription.entity';

export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'Nombre del medicamento prescrito',
    example: 'Amoxicilina',
    minLength: 2,
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'El nombre del medicamento es obligatorio' })
  @IsString({ message: 'El medicamento debe ser texto' })
  @MinLength(2, { message: 'El medicamento debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El medicamento no puede exceder los 200 caracteres' })
  @Transform(({ value }) => value?.trim())
  medication?: string;

  @ApiPropertyOptional({
    description: 'Nombre del medicamento prescrito (alias para medication)',
    example: 'Amoxicilina',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'El medicamento debe ser texto' })
  @MinLength(2, { message: 'El medicamento debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El medicamento no puede exceder los 200 caracteres' })
  @Transform(({ value }) => value?.trim())
  medicationName?: string;

  @ApiProperty({
    description: 'Dosis del medicamento',
    example: '250mg',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'La dosis es obligatoria' })
  @IsString({ message: 'La dosis debe ser texto' })
  @MinLength(1, { message: 'La dosis debe tener al menos 1 caracter' })
  @MaxLength(100, { message: 'La dosis no puede exceder los 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  dosage: string;

  @ApiPropertyOptional({
    description: 'Frecuencia de administración',
    example: 'TWICE_DAILY',
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Si viene como string, intentar convertir a enum
    if (typeof value === 'string') {
      const enumValue = Object.values(PrescriptionFrequency).find(
        freq => freq === value.toUpperCase() || 
               freq.replace(/_/g, ' ').toLowerCase() === value.toLowerCase()
      );
      return enumValue || PrescriptionFrequency.TWICE_DAILY;
    }
    return value || PrescriptionFrequency.TWICE_DAILY;
  })
  frequency?: PrescriptionFrequency = PrescriptionFrequency.TWICE_DAILY;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del tratamiento',
    example: '2025-06-03',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser válida' })
  @Transform(({ value }) => value || new Date().toISOString().split('T')[0])
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de finalización del tratamiento',
    example: '2025-06-17',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser válida' })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Duración del tratamiento en días',
    example: 14,
    minimum: 1,
    maximum: 365,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @Min(1, { message: 'La duración mínima es 1 día' })
  @Max(365, { message: 'La duración máxima es 365 días' })
  durationDays?: number;

  @ApiPropertyOptional({
    description: 'Instrucciones especiales para la administración',
    example: 'Administrar después de las comidas. No mezclar con lácteos.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Las instrucciones deben ser texto' })
  @MaxLength(1000, { message: 'Las instrucciones no pueden exceder los 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Estado inicial de la prescripción',
    enum: PrescriptionStatus,
    example: PrescriptionStatus.ACTIVE,
    default: PrescriptionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PrescriptionStatus, { message: 'El estado debe ser válido' })
  status?: PrescriptionStatus = PrescriptionStatus.ACTIVE;

  @ApiPropertyOptional({
    description: 'Cantidad total de medicamento prescrito',
    example: 30,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  @Max(1000, { message: 'La cantidad máxima es 1000' })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Unidad de medida de la cantidad (comprimidos, ml, etc.)',
    example: 'comprimidos',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'La unidad debe ser texto' })
  @MaxLength(50, { message: 'La unidad no puede exceder los 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  unit?: string;
}

// Re-exportar los enums para que otros archivos puedan usarlos
export { PrescriptionFrequency, PrescriptionStatus }; 