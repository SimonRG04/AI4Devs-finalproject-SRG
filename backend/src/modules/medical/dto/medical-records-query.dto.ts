import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum MedicalRecordSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  APPOINTMENT_DATE = 'appointmentDate',
  FOLLOW_UP_DATE = 'followUpDate',
  DIAGNOSIS = 'diagnosis',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class MedicalRecordsQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página para la paginación',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página mínima es 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo es 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar los resultados',
    enum: MedicalRecordSortBy,
    default: MedicalRecordSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(MedicalRecordSortBy, { message: 'El campo de ordenamiento debe ser válido' })
  sortBy?: MedicalRecordSortBy = MedicalRecordSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Orden de los resultados',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'El orden debe ser ASC o DESC' })
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de mascota',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de mascota debe ser un número' })
  petId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de cita',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de cita debe ser un número' })
  appointmentId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de veterinario',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de veterinario debe ser un número' })
  veterinarianId?: number;

  @ApiPropertyOptional({
    description: 'Buscar en diagnósticos que contengan este texto',
    example: 'otitis',
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda en diagnóstico debe ser texto' })
  @Transform(({ value }) => value?.trim())
  diagnosisSearch?: string;

  @ApiPropertyOptional({
    description: 'Buscar en tratamientos que contengan este texto',
    example: 'antibiótico',
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda en tratamiento debe ser texto' })
  @Transform(({ value }) => value?.trim())
  treatmentSearch?: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del rango de búsqueda',
    example: '2025-01-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser válida' })
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin del rango de búsqueda',
    example: '2025-12-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser válida' })
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Filtrar solo registros que requieren seguimiento',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean({ message: 'El filtro de seguimiento debe ser verdadero o falso' })
  requiresFollowUp?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar registros con seguimiento pendiente (fecha futura)',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean({ message: 'El filtro de seguimiento pendiente debe ser verdadero o falso' })
  hasPendingFollowUp?: boolean;

  @ApiPropertyOptional({
    description: 'Incluir prescripciones en los resultados',
    example: true,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  @IsBoolean({ message: 'Incluir prescripciones debe ser verdadero o falso' })
  includePrescriptions?: boolean = false;
} 