import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsPositive,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID de la mascota para la cita',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID de la mascota es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número' })
  @IsPositive({ message: 'El ID de la mascota debe ser positivo' })
  petId: number;

  @ApiProperty({
    description: 'ID del veterinario para la cita',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID del veterinario es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID del veterinario debe ser un número' })
  @IsPositive({ message: 'El ID del veterinario debe ser positivo' })
  veterinarianId: number;

  @ApiProperty({
    description: 'Fecha y hora de la cita',
    example: '2024-02-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty({ message: 'La fecha y hora es obligatoria' })
  @IsDateString({}, { message: 'La fecha y hora debe ser válida' })
  dateTime: string;

  @ApiProperty({
    description: 'Motivo de la cita',
    example: 'Consulta de rutina y vacunación',
    minLength: 5,
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'El motivo de la cita es obligatorio' })
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres' })
  @MaxLength(500, { message: 'El motivo no puede exceder los 500 caracteres' })
  @Transform(({ value }) => value?.trim())
  reason: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales para la cita',
    example: 'El paciente ha mostrado síntomas de letargo',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  @MaxLength(1000, { message: 'Las notas no pueden exceder los 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @ApiPropertyOptional({
    description: 'Duración estimada de la cita en minutos',
    example: 30,
    minimum: 15,
    maximum: 240,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @Min(15, { message: 'La duración mínima es 15 minutos' })
  @Max(240, { message: 'La duración máxima es 240 minutos' })
  durationMinutes?: number = 30;

  @ApiPropertyOptional({
    description: 'Estado inicial de la cita',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
    default: AppointmentStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'El estado debe ser válido' })
  status?: AppointmentStatus = AppointmentStatus.SCHEDULED;
} 