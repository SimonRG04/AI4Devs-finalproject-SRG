import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVeterinarianProfileDto {
  @ApiPropertyOptional({
    description: 'Especialización del veterinario',
    example: 'Medicina Interna',
  })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({
    description: 'Horarios de disponibilidad del veterinario',
    example: {
      monday: { isAvailable: true, start: '08:00', end: '18:00' },
      tuesday: { isAvailable: true, start: '08:00', end: '18:00' },
      wednesday: { isAvailable: true, start: '08:00', end: '18:00' },
      thursday: { isAvailable: true, start: '08:00', end: '18:00' },
      friday: { isAvailable: true, start: '08:00', end: '18:00' },
      saturday: { isAvailable: false },
      sunday: { isAvailable: false }
    },
  })
  @IsOptional()
  @IsObject()
  availabilityHours?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Biografía o descripción del veterinario',
    example: 'Veterinario con 10 años de experiencia en medicina interna',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Costo de consulta',
    example: 80000,
  })
  @IsOptional()
  consultationFee?: number;
} 