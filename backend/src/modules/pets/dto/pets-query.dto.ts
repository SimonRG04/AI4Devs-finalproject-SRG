import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsPositive, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PetGender, PetSpecies } from '../entities/pet.entity';

export class PetsQueryDto {
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
    description: 'Filtrar por especie',
    enum: PetSpecies,
    example: PetSpecies.DOG,
  })
  @IsOptional()
  @IsEnum(PetSpecies, { message: 'La especie debe ser una opción válida' })
  species?: PetSpecies;

  @ApiPropertyOptional({
    description: 'Filtrar por género',
    enum: PetGender,
    example: PetGender.MALE,
  })
  @IsOptional()
  @IsEnum(PetGender, { message: 'El género debe ser una opción válida' })
  gender?: PetGender;

  @ApiPropertyOptional({
    description: 'Buscar por nombre (búsqueda parcial)',
    example: 'Max',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por raza',
    example: 'Golden Retriever',
  })
  @IsOptional()
  @IsString({ message: 'La raza debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  breed?: string;

  @ApiPropertyOptional({
    description: 'Ordenar por campo',
    example: 'name',
    enum: ['name', 'species', 'birthDate', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'La dirección debe ser ASC o DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
} 