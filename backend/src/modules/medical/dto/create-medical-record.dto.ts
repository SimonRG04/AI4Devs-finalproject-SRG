import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsPositive,
  MinLength,
  MaxLength,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { CreatePrescriptionDto } from './create-prescription.dto';

export class CreateMedicalRecordDto {
  @ApiProperty({
    description: 'ID de la cita asociada al registro médico',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID de la cita es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de la cita debe ser un número' })
  @IsPositive({ message: 'El ID de la cita debe ser positivo' })
  appointmentId: number;

  @ApiProperty({
    description: 'Diagnóstico principal del paciente',
    example: 'Otitis externa leve en oído derecho',
    minLength: 10,
    maxLength: 2000,
  })
  @IsNotEmpty({ message: 'El diagnóstico es obligatorio' })
  @IsString({ message: 'El diagnóstico debe ser texto' })
  @MinLength(10, { message: 'El diagnóstico debe tener al menos 10 caracteres' })
  @MaxLength(2000, { message: 'El diagnóstico no puede exceder los 2000 caracteres' })
  @Transform(({ value }) => value?.trim())
  diagnosis: string;

  @ApiProperty({
    description: 'Tratamiento aplicado o recomendado',
    example: 'Limpieza del oído con solución salina, aplicación de gotas antibióticas',
    minLength: 5,
    maxLength: 2000,
  })
  @IsNotEmpty({ message: 'El tratamiento es obligatorio' })
  @IsString({ message: 'El tratamiento debe ser texto' })
  @MinLength(5, { message: 'El tratamiento debe tener al menos 5 caracteres' })
  @MaxLength(2000, { message: 'El tratamiento no puede exceder los 2000 caracteres' })
  @Transform(({ value }) => value?.trim())
  treatment: string;

  @ApiPropertyOptional({
    description: 'Síntomas observados durante la consulta',
    example: 'Sacudidas frecuentes de cabeza, rascado excesivo del oído',
    maxLength: 1500,
  })
  @IsOptional()
  @IsString({ message: 'Los síntomas deben ser texto' })
  @MaxLength(1500, { message: 'Los síntomas no pueden exceder los 1500 caracteres' })
  @Transform(({ value }) => value?.trim())
  symptoms?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales del veterinario',
    example: 'Propietario muy colaborativo, mascota dócil durante el examen',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  @MaxLength(1000, { message: 'Las notas no pueden exceder los 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @ApiPropertyOptional({
    description: 'Fecha recomendada para próxima consulta de seguimiento',
    example: '2025-06-15',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de seguimiento debe ser válida' })
  followUpDate?: string;

  @ApiPropertyOptional({
    description: 'Recomendaciones para la próxima visita',
    example: 'Revisar evolución de la otitis, controlar si hay nuevos síntomas',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Las recomendaciones deben ser texto' })
  @MaxLength(1000, { message: 'Las recomendaciones no pueden exceder los 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  nextVisitRecommendations?: string;

  @ApiPropertyOptional({
    description: 'Lista de prescripciones asociadas al registro médico',
    type: [CreatePrescriptionDto],
  })
  @IsOptional()
  @IsArray({ message: 'Las prescripciones deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionDto)
  prescriptions?: CreatePrescriptionDto[];

  @ApiPropertyOptional({
    description: 'Indica si este registro requiere seguimiento especial',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El seguimiento debe ser verdadero o falso' })
  requiresFollowUp?: boolean = false;
} 