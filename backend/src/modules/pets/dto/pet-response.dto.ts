import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { PetGender, PetSpecies } from '../entities/pet.entity';

export class PetResponseDto {
  @ApiProperty({
    description: 'ID único de la mascota',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'ID del cliente propietario',
    example: 1,
  })
  @Expose()
  clientId: number;

  @ApiProperty({
    description: 'Nombre de la mascota',
    example: 'Max',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Especie de la mascota',
    enum: PetSpecies,
    example: PetSpecies.DOG,
  })
  @Expose()
  species: PetSpecies;

  @ApiPropertyOptional({
    description: 'Raza de la mascota',
    example: 'Golden Retriever',
  })
  @Expose()
  breed?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento de la mascota',
    example: '2020-01-15',
    type: 'string',
    format: 'date',
  })
  @Expose()
  @Transform(({ value }) => value ? value.toISOString().split('T')[0] : null)
  birthDate?: string;

  @ApiProperty({
    description: 'Género de la mascota',
    enum: PetGender,
    example: PetGender.MALE,
  })
  @Expose()
  gender: PetGender;

  @ApiPropertyOptional({
    description: 'Peso de la mascota en kilogramos',
    example: 25.5,
  })
  @Expose()
  weight?: number;

  @ApiPropertyOptional({
    description: 'Alertas médicas importantes',
    example: 'Alérgico a la penicilina, problemas cardíacos',
  })
  @Expose()
  medicalAlerts?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de la mascota',
    example: 'https://example.com/photo.jpg',
  })
  @Expose()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Edad calculada en años',
    example: 4,
  })
  @Expose()
  age?: number;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Información del cliente propietario',
    type: 'object',
  })
  @Expose()
  client?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
} 