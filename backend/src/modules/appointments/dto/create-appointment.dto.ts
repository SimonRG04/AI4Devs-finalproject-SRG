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
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { AppointmentStatus, AppointmentType, AppointmentPriority } from '../entities/appointment.entity';

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

  @ApiPropertyOptional({
    description: 'ID del veterinario para la cita (opcional, se asignará automáticamente si no se especifica)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID del veterinario debe ser un número' })
  @IsPositive({ message: 'El ID del veterinario debe ser positivo' })
  veterinarianId?: number;

  @ApiProperty({
    description: 'Fecha y hora de la cita',
    example: '2024-02-15T10:30:00',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty({ message: 'La fecha y hora es obligatoria' })
  @IsDateString({}, { message: 'La fecha y hora debe ser válida' })
  scheduledAt: string;

  @ApiProperty({
    description: 'Tipo de cita',
    enum: AppointmentType,
    example: AppointmentType.CONSULTATION,
  })
  @IsNotEmpty({ message: 'El tipo de cita es obligatorio' })
  @IsEnum(AppointmentType, { message: 'El tipo de cita debe ser válido' })
  type: AppointmentType;

  @ApiPropertyOptional({
    description: 'Duración de la cita en minutos',
    example: 30,
    minimum: 15,
    maximum: 240,
    default: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @Min(15, { message: 'La duración mínima es 15 minutos' })
  @Max(240, { message: 'La duración máxima es 240 minutos' })
  duration?: number = 30;

  @ApiPropertyOptional({
    description: 'Prioridad de la cita',
    enum: AppointmentPriority,
    example: AppointmentPriority.NORMAL,
    default: AppointmentPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(AppointmentPriority, { message: 'La prioridad debe ser válida' })
  priority?: AppointmentPriority = AppointmentPriority.NORMAL;

  @ApiPropertyOptional({
    description: 'Estado inicial de la cita',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
    default: AppointmentStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'El estado debe ser válido' })
  status?: AppointmentStatus = AppointmentStatus.SCHEDULED;

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
    description: 'Enviar confirmación por email al propietario',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El envío de confirmación debe ser verdadero o falso' })
  @Type(() => Boolean)
  sendConfirmation?: boolean = true;

  @ApiPropertyOptional({
    description: 'Enviar recordatorio 24 horas antes',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El envío de recordatorio debe ser verdadero o falso' })
  @Type(() => Boolean)
  sendReminder?: boolean = true;
} 