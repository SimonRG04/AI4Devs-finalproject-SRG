import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { AppointmentStatus } from '../entities/appointment.entity';

export class AppointmentResponseDto {
  @ApiProperty({
    description: 'ID único de la cita',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'ID de la mascota',
    example: 1,
  })
  @Expose()
  petId: number;

  @ApiProperty({
    description: 'ID del veterinario',
    example: 1,
  })
  @Expose()
  veterinarianId: number;

  @ApiProperty({
    description: 'Fecha y hora de la cita',
    example: '2024-02-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Expose()
  scheduledAt: Date;

  @ApiProperty({
    description: 'Estado de la cita',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
  })
  @Expose()
  status: AppointmentStatus;

  @ApiProperty({
    description: 'Tipo de cita',
    example: 'CONSULTATION',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'Prioridad de la cita',
    example: 'NORMAL',
  })
  @Expose()
  priority: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'El paciente ha mostrado síntomas de letargo',
  })
  @Expose()
  notes?: string;

  @ApiProperty({
    description: 'Duración de la cita en minutos',
    example: 30,
  })
  @Expose()
  duration: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T08:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T08:00:00Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Información de la mascota',
    type: 'object',
  })
  @Expose()
  pet?: {
    id: number;
    name: string;
    species: string;
    breed?: string;
    client?: {
      id: number;
      firstName: string;
      lastName: string;
      user?: {
        email: string;
        phone?: string;
      };
    };
  };

  @ApiPropertyOptional({
    description: 'Información del veterinario',
    type: 'object',
  })
  @Expose()
  veterinarian?: {
    id: number;
    license: string;
    specialty?: string;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  };

  @ApiPropertyOptional({
    description: 'Indica si la cita es futura',
    example: true,
  })
  @Expose()
  @Transform(({ obj }) => new Date(obj.scheduledAt) > new Date())
  isUpcoming?: boolean;

  @ApiPropertyOptional({
    description: 'Indica si la cita ya pasó',
    example: false,
  })
  @Expose()
  @Transform(({ obj }) => new Date(obj.scheduledAt) < new Date())
  isPast?: boolean;

  @ApiPropertyOptional({
    description: 'Prediagnóstico de IA asociado a la cita',
    type: 'object',
  })
  @Expose()
  @Transform(({ obj }) => {
    // Devolver solo el primer (más reciente) prediagnóstico
    if (obj.aiDiagnoses && obj.aiDiagnoses.length > 0) {
      return obj.aiDiagnoses[0];
    }
    return null;
  })
  preDiagnosis?: {
    id: number;
    status: string;
    description?: string;
    results?: any;
    confidence?: number;
    errorMessage?: string;
    createdAt: Date;
    processedAt?: Date;
  };
} 