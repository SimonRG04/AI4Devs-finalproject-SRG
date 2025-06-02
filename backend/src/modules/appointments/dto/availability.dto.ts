import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilityQueryDto {
  @ApiProperty({
    description: 'Fecha para consultar disponibilidad',
    example: '2024-02-15',
    type: 'string',
    format: 'date',
  })
  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsDateString({}, { message: 'La fecha debe ser válida' })
  date: string;

  @ApiPropertyOptional({
    description: 'Duración requerida para la cita en minutos',
    example: 30,
    minimum: 15,
    maximum: 240,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @IsPositive({ message: 'La duración debe ser positiva' })
  duration?: number = 30;
}

export class AvailabilitySlotDto {
  @ApiProperty({
    description: 'Hora de inicio del slot disponible',
    example: '09:00',
    type: 'string',
    format: 'time',
  })
  startTime: string;

  @ApiProperty({
    description: 'Hora de fin del slot disponible',
    example: '09:30',
    type: 'string',
    format: 'time',
  })
  endTime: string;

  @ApiProperty({
    description: 'Fecha y hora completa de inicio',
    example: '2024-02-15T09:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  dateTime: string;

  @ApiProperty({
    description: 'Indica si el slot está disponible',
    example: true,
  })
  available: boolean;

  @ApiPropertyOptional({
    description: 'Razón por la cual no está disponible (si aplica)',
    example: 'Cita ya programada',
  })
  reason?: string;
}

export class VeterinarianAvailabilityDto {
  @ApiProperty({
    description: 'ID del veterinario',
    example: 1,
  })
  veterinarianId: number;

  @ApiProperty({
    description: 'Nombre completo del veterinario',
    example: 'Dr. Juan Pérez',
  })
  name: string;

  @ApiProperty({
    description: 'Especialidad del veterinario',
    example: 'Medicina General',
  })
  specialty?: string;

  @ApiProperty({
    description: 'Fecha consultada',
    example: '2024-02-15',
    type: 'string',
    format: 'date',
  })
  date: string;

  @ApiProperty({
    description: 'Lista de slots de disponibilidad',
    type: [AvailabilitySlotDto],
  })
  slots: AvailabilitySlotDto[];

  @ApiProperty({
    description: 'Total de slots disponibles',
    example: 8,
  })
  totalAvailableSlots: number;
} 