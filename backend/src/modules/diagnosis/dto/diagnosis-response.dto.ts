import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { DiagnosisStatus } from '../entities/ai-diagnosis.entity';

export class ConditionDto {
  @ApiProperty({
    description: 'Nombre de la condición posible',
    example: 'Gastroenteritis leve',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Probabilidad de la condición (0.0 - 1.0)',
    example: 0.75,
    minimum: 0,
    maximum: 1,
  })
  @Expose()
  probability: number;

  @ApiProperty({
    description: 'Descripción de la condición',
    example: 'Inflamación del tracto gastrointestinal que puede causar vómitos y pérdida de apetito',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Nivel de severidad',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    example: 'MEDIUM',
  })
  @Expose()
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class SimplifiedPetDto {
  @ApiProperty({ description: 'ID de la mascota', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Nombre de la mascota', example: 'Max' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Especie', example: 'DOG' })
  @Expose()
  species: string;

  @ApiPropertyOptional({ description: 'Raza', example: 'Golden Retriever' })
  @Expose()
  breed?: string;

  @ApiPropertyOptional({ description: 'Edad en años', example: 3 })
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.birthDate) return null;
    const today = new Date();
    const birth = new Date(obj.birthDate);
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  })
  age?: number;

  @ApiPropertyOptional({ description: 'Peso en kg', example: 25.5 })
  @Expose()
  weight?: number;

  @ApiProperty({ description: 'Género', example: 'MALE' })
  @Expose()
  gender: string;
}

export class DiagnosisResultsDto {
  @ApiProperty({
    description: 'Condiciones posibles identificadas',
    type: [ConditionDto],
  })
  @Expose()
  @Type(() => ConditionDto)
  conditions: ConditionDto[];

  @ApiProperty({
    description: 'Recomendaciones específicas',
    example: [
      'Mantener a la mascota hidratada',
      'Ofrecer comida blanda en pequeñas porciones',
      'Monitorear síntomas durante las próximas 24 horas'
    ],
  })
  @Expose()
  recommendations: string[];

  @ApiProperty({
    description: 'Nivel de urgencia para buscar atención veterinaria',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    example: 'MEDIUM',
  })
  @Expose()
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  @ApiProperty({
    description: 'Nivel de confianza del prediagnóstico (0.0 - 1.0)',
    example: 0.72,
    minimum: 0,
    maximum: 1,
  })
  @Expose()
  confidence: number;

  @ApiProperty({
    description: 'Disclaimer médico importante',
    example: 'Este es un prediagnóstico automático. Siempre consulte con un veterinario profesional para un diagnóstico definitivo.',
  })
  @Expose()
  disclaimer: string;
}

export class DiagnosisResponseDto {
  @ApiProperty({
    description: 'ID único del diagnóstico',
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

  @ApiPropertyOptional({
    description: 'ID de la cita asociada',
    example: 1,
  })
  @Expose()
  appointmentId?: number;

  @ApiProperty({
    description: 'Estado del prediagnóstico',
    enum: DiagnosisStatus,
    example: DiagnosisStatus.COMPLETED,
  })
  @Expose()
  status: DiagnosisStatus;

  @ApiPropertyOptional({
    description: 'Síntomas analizados',
    example: 'Vómitos, pérdida de apetito, letargo',
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Resultados del análisis de IA',
    type: DiagnosisResultsDto,
  })
  @Expose()
  @Type(() => DiagnosisResultsDto)
  results?: DiagnosisResultsDto;

  @ApiPropertyOptional({
    description: 'Nivel de confianza general (0.0 - 1.0)',
    example: 0.72,
  })
  @Expose()
  confidence?: number;

  @ApiPropertyOptional({
    description: 'Mensaje de error si el procesamiento falló',
  })
  @Expose()
  errorMessage?: string;

  @ApiProperty({
    description: 'Fecha y hora de creación',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Fecha y hora de procesamiento',
    example: '2024-01-15T10:31:00Z',
  })
  @Expose()
  processedAt?: Date;

  @ApiPropertyOptional({
    description: 'Información básica de la mascota',
    type: SimplifiedPetDto,
  })
  @Expose()
  @Type(() => SimplifiedPetDto)
  pet?: SimplifiedPetDto;

  // Propiedades computadas
  @ApiProperty({
    description: 'Indica si el diagnóstico está completado',
    example: true,
  })
  @Expose()
  get isCompleted(): boolean {
    return this.status === DiagnosisStatus.COMPLETED;
  }

  @ApiProperty({
    description: 'Indica si el diagnóstico falló',
    example: false,
  })
  @Expose()
  get isFailed(): boolean {
    return this.status === DiagnosisStatus.FAILED;
  }

  @ApiProperty({
    description: 'Indica si el diagnóstico está pendiente',
    example: false,
  })
  @Expose()
  get isPending(): boolean {
    return [DiagnosisStatus.PENDING, DiagnosisStatus.PROCESSING].includes(this.status);
  }

  @ApiPropertyOptional({
    description: 'Condición principal identificada',
    example: 'Gastroenteritis leve',
  })
  @Expose()
  get primaryCondition(): string | null {
    if (!this.results?.conditions?.length) return null;
    return this.results.conditions[0].name;
  }
} 