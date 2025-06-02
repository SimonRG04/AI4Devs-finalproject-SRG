import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  IsPositive, 
  Min, 
  Max, 
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '../entities/appointment.entity';

export class AppointmentsQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'La página debe ser un número positivo' })
  @Min(1, { message: 'La página mínima es 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'El límite debe ser un número positivo' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo es 100' })
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Filtrar por estado de la cita',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'El estado debe ser válido' })
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de mascota',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de mascota debe ser un número' })
  @IsPositive({ message: 'El ID de mascota debe ser positivo' })
  petId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de veterinario',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de veterinario debe ser un número' })
  @IsPositive({ message: 'El ID de veterinario debe ser positivo' })
  veterinarianId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha desde (incluida)',
    example: '2024-01-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha desde debe ser válida' })
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha hasta (incluida)',
    example: '2024-12-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha hasta debe ser válida' })
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Filtrar solo citas futuras',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  upcoming?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar solo citas pasadas',
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  past?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por día específico',
    example: '2024-02-15',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser válida' })
  date?: string;

  @ApiPropertyOptional({
    description: 'Ordenar por campo',
    example: 'dateTime',
    enum: ['dateTime', 'status', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  sortBy?: string = 'dateTime';

  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'La dirección debe ser ASC o DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
} 