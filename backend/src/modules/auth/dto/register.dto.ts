import { IsEmail, IsNotEmpty, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'contraseña123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

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

  @ApiPropertyOptional({
    description: 'Número telefónico del usuario',
    example: '+573001234567',
  })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Debe ser un número telefónico válido' })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Dirección del cliente (solo para clientes)',
    example: 'Calle 123 #45-67, Bogotá',
  })
  @IsOptional()
  address?: string;
} 