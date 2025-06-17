import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsPositive,
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum SymptomSeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

export class CreateDiagnosisDto {
  @ApiProperty({
    description: 'ID de la mascota para el prediagnóstico',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID de la mascota es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número' })
  @IsPositive({ message: 'El ID de la mascota debe ser positivo' })
  petId: number;

  @ApiPropertyOptional({
    description: 'ID de la cita asociada (opcional)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de la cita debe ser un número' })
  @IsPositive({ message: 'El ID de la cita debe ser positivo' })
  appointmentId?: number;

  @ApiProperty({
    description: 'Síntomas observados por el propietario',
    example: 'Mi perro ha estado vomitando desde ayer y no quiere comer. También se ve muy decaído.',
    minLength: 10,
    maxLength: 1500,
  })
  @IsNotEmpty({ message: 'Los síntomas son obligatorios' })
  @IsString({ message: 'Los síntomas deben ser texto' })
  @MinLength(10, { message: 'Los síntomas deben tener al menos 10 caracteres' })
  @MaxLength(1500, { message: 'Los síntomas no pueden exceder los 1500 caracteres' })
  @Transform(({ value }) => value?.trim())
  symptoms: string;

  @ApiPropertyOptional({
    description: 'Duración de los síntomas',
    example: '2 días',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'La duración debe ser texto' })
  @MaxLength(100, { message: 'La duración no puede exceder los 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  duration?: string;

  @ApiPropertyOptional({
    description: 'Severidad percibida de los síntomas',
    enum: SymptomSeverity,
    example: SymptomSeverity.MODERATE,
  })
  @IsOptional()
  @IsEnum(SymptomSeverity, { message: 'La severidad debe ser mild, moderate o severe' })
  severity?: SymptomSeverity;

  @ApiPropertyOptional({
    description: 'Información adicional relevante',
    example: 'Ha comido algo inusual recientemente. Últimamente ha estado más sedentario.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'La información adicional debe ser texto' })
  @MaxLength(500, { message: 'La información adicional no puede exceder los 500 caracteres' })
  @Transform(({ value }) => value?.trim())
  additionalInfo?: string;
} 