import { IsEmail, IsNotEmpty, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @ApiPropertyOptional({
    description: 'Número telefónico del usuario',
    example: '+573001234567',
  })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Debe ser un número telefónico válido' })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Contraseña actual (requerida solo si se cambia la contraseña)',
    example: 'contraseñaActual123',
  })
  @IsOptional()
  currentPassword?: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña',
    example: 'nuevaContraseña123',
    minLength: 6,
  })
  @IsOptional()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  newPassword?: string;
} 