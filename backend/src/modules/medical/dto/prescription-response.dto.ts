import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { PrescriptionFrequency, PrescriptionStatus } from './create-prescription.dto';

export class PrescriptionResponseDto {
  @ApiProperty({ description: 'ID de la prescripción', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'ID del registro médico asociado', example: 1 })
  @Expose()
  medicalRecordId: number;

  @ApiProperty({ 
    description: 'Nombre del medicamento',
    example: 'Amoxicilina'
  })
  @Expose()
  medication: string;

  @ApiProperty({ 
    description: 'Dosis del medicamento',
    example: '250mg'
  })
  @Expose()
  dosage: string;

  @ApiProperty({ 
    description: 'Frecuencia de administración',
    enum: PrescriptionFrequency,
    example: PrescriptionFrequency.TWICE_DAILY
  })
  @Expose()
  frequency: PrescriptionFrequency;

  @ApiProperty({ 
    description: 'Fecha de inicio del tratamiento',
    example: '2025-06-03'
  })
  @Expose()
  @Transform(({ value }) => new Date(value).toISOString().split('T')[0])
  startDate: string;

  @ApiPropertyOptional({ 
    description: 'Fecha de finalización del tratamiento',
    example: '2025-06-17'
  })
  @Expose()
  @Transform(({ value }) => value ? new Date(value).toISOString().split('T')[0] : null)
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Instrucciones especiales',
    example: 'Administrar después de las comidas. No mezclar con lácteos.'
  })
  @Expose()
  instructions?: string;

  @ApiProperty({ 
    description: 'Estado de la prescripción',
    enum: PrescriptionStatus,
    example: PrescriptionStatus.ACTIVE
  })
  @Expose()
  status: PrescriptionStatus;

  @ApiPropertyOptional({ 
    description: 'Cantidad prescrita',
    example: 30
  })
  @Expose()
  quantity?: number;

  @ApiPropertyOptional({ 
    description: 'Unidad de medida',
    example: 'comprimidos'
  })
  @Expose()
  unit?: string;

  @ApiProperty({ description: 'Fecha de creación', example: '2025-06-02T20:30:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2025-06-02T20:30:00.000Z' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Indica si la prescripción está activa', example: true })
  @Expose()
  @Transform(({ obj }) => {
    if (obj.status !== PrescriptionStatus.ACTIVE) return false;
    
    const today = new Date();
    const startDate = new Date(obj.startDate);
    
    // Si no hay fecha de fin, verificar solo que haya empezado
    if (!obj.endDate) {
      return startDate <= today;
    }
    
    // Si hay fecha de fin, verificar que esté en el rango
    const endDate = new Date(obj.endDate);
    return startDate <= today && today <= endDate;
  })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Días restantes del tratamiento', example: 5 })
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.endDate || obj.status !== PrescriptionStatus.ACTIVE) return null;
    
    const today = new Date();
    const endDate = new Date(obj.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  })
  daysRemaining?: number;

  @ApiProperty({ description: 'Duración total del tratamiento en días', example: 14 })
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.endDate) return null;
    
    const startDate = new Date(obj.startDate);
    const endDate = new Date(obj.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 1;
  })
  totalDurationDays?: number;

  @ApiProperty({ description: 'Descripción de la frecuencia en texto legible', example: 'Dos veces al día' })
  @Expose()
  @Transform(({ obj }) => {
    const frequencyMap = {
      [PrescriptionFrequency.ONCE_DAILY]: 'Una vez al día',
      [PrescriptionFrequency.TWICE_DAILY]: 'Dos veces al día',
      [PrescriptionFrequency.THREE_TIMES_DAILY]: 'Tres veces al día',
      [PrescriptionFrequency.FOUR_TIMES_DAILY]: 'Cuatro veces al día',
      [PrescriptionFrequency.EVERY_8_HOURS]: 'Cada 8 horas',
      [PrescriptionFrequency.EVERY_12_HOURS]: 'Cada 12 horas',
      [PrescriptionFrequency.EVERY_6_HOURS]: 'Cada 6 horas',
      [PrescriptionFrequency.AS_NEEDED]: 'Según sea necesario',
      [PrescriptionFrequency.WEEKLY]: 'Una vez por semana',
      [PrescriptionFrequency.MONTHLY]: 'Una vez al mes',
    };
    return frequencyMap[obj.frequency] || obj.frequency;
  })
  frequencyDescription: string;
} 