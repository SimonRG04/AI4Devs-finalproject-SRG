import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { PrescriptionResponseDto } from './prescription-response.dto';

export class SimplifiedAppointmentDto {
  @ApiProperty({ description: 'ID de la cita', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Fecha y hora de la cita', example: '2025-06-03T15:00:00.000Z' })
  @Expose()
  dateTime: Date;

  @ApiProperty({ description: 'Motivo de la cita', example: 'Chequeo general' })
  @Expose()
  reason: string;

  @ApiProperty({ description: 'Estado de la cita', example: 'COMPLETED' })
  @Expose()
  status: string;

  @ApiPropertyOptional({ description: 'Información básica de la mascota' })
  @Expose()
  pet?: {
    id: number;
    name: string;
    species: string;
    breed: string;
  };

  @ApiPropertyOptional({ description: 'Información básica del veterinario' })
  @Expose()
  veterinarian?: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export class MedicalRecordResponseDto {
  @ApiProperty({ description: 'ID del registro médico', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'ID de la cita asociada', example: 1 })
  @Expose()
  appointmentId: number;

  @ApiProperty({ 
    description: 'Diagnóstico principal',
    example: 'Otitis externa leve en oído derecho'
  })
  @Expose()
  diagnosis: string;

  @ApiProperty({ 
    description: 'Tratamiento aplicado',
    example: 'Limpieza del oído con solución salina, aplicación de gotas antibióticas'
  })
  @Expose()
  treatment: string;

  @ApiPropertyOptional({ 
    description: 'Síntomas observados',
    example: 'Sacudidas frecuentes de cabeza, rascado excesivo del oído'
  })
  @Expose()
  symptoms?: string;

  @ApiPropertyOptional({ 
    description: 'Notas adicionales del veterinario',
    example: 'Propietario muy colaborativo, mascota dócil durante el examen'
  })
  @Expose()
  notes?: string;

  @ApiPropertyOptional({ 
    description: 'Fecha recomendada para seguimiento',
    example: '2025-06-15'
  })
  @Expose()
  @Transform(({ value }) => value ? new Date(value).toISOString().split('T')[0] : null)
  followUpDate?: string;

  @ApiPropertyOptional({ 
    description: 'Recomendaciones para la próxima visita',
    example: 'Revisar evolución de la otitis, controlar si hay nuevos síntomas'
  })
  @Expose()
  nextVisitRecommendations?: string;

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2025-06-02T20:30:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2025-06-02T20:30:00.000Z' })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Información de la cita asociada' })
  @Expose()
  @Type(() => SimplifiedAppointmentDto)
  appointment?: SimplifiedAppointmentDto;

  @ApiPropertyOptional({ 
    description: 'Lista de prescripciones asociadas',
    type: [PrescriptionResponseDto]
  })
  @Expose()
  @Type(() => PrescriptionResponseDto)
  prescriptions?: PrescriptionResponseDto[];

  @ApiPropertyOptional({ description: 'Número de archivos adjuntos', example: 2 })
  @Expose()
  attachmentsCount?: number;

  @ApiProperty({ description: 'Indica si requiere seguimiento', example: true })
  @Expose()
  @Transform(({ obj }) => {
    // Calculamos si requiere seguimiento basado en followUpDate
    if (!obj.followUpDate) return false;
    const followUpDate = new Date(obj.followUpDate);
    const today = new Date();
    return followUpDate > today;
  })
  requiresFollowUp: boolean;

  @ApiProperty({ description: 'Número de días hasta el seguimiento', example: 13 })
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.followUpDate) return null;
    const followUpDate = new Date(obj.followUpDate);
    const today = new Date();
    const diffTime = followUpDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  })
  daysUntilFollowUp?: number;
} 