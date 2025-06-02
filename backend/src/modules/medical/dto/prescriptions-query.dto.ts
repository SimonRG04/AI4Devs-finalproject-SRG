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
import { PrescriptionFrequency, PrescriptionStatus } from './create-prescription.dto';

export enum PrescriptionSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  MEDICATION = 'medication',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PrescriptionsQueryDto {
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
    enum: PrescriptionSortBy,
    default: PrescriptionSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(PrescriptionSortBy, { message: 'El campo de ordenamiento debe ser válido' })
  sortBy?: PrescriptionSortBy = PrescriptionSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Orden de los resultados',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'El orden debe ser ASC o DESC' })
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de registro médico',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de registro médico debe ser un número' })
  medicalRecordId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de mascota',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de mascota debe ser un número' })
  petId?: number;

  @ApiPropertyOptional({
    description: 'Buscar en medicamentos que contengan este texto',
    example: 'amoxicilina',
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda en medicamento debe ser texto' })
  @Transform(({ value }) => value?.trim())
  medicationSearch?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado de la prescripción',
    enum: PrescriptionStatus,
    example: PrescriptionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PrescriptionStatus, { message: 'El estado debe ser válido' })
  status?: PrescriptionStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por frecuencia de administración',
    enum: PrescriptionFrequency,
    example: PrescriptionFrequency.TWICE_DAILY,
  })
  @IsOptional()
  @IsEnum(PrescriptionFrequency, { message: 'La frecuencia debe ser válida' })
  frequency?: PrescriptionFrequency;

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
    description: 'Filtrar solo prescripciones activas',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean({ message: 'El filtro de activas debe ser verdadero o falso' })
  activeOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar prescripciones que expiran pronto (próximos N días)',
    example: 7,
    minimum: 1,
    maximum: 365,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Los días hasta expiración deben ser un número' })
  @Min(1, { message: 'El mínimo es 1 día' })
  @Max(365, { message: 'El máximo es 365 días' })
  expiringInDays?: number;

  @ApiPropertyOptional({
    description: 'Incluir información del registro médico asociado',
    example: true,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  @IsBoolean({ message: 'Incluir registro médico debe ser verdadero o falso' })
  includeMedicalRecord?: boolean = false;
} 