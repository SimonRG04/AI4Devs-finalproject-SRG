import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { DiagnosisResponseDto } from './dto/diagnosis-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Diagnosis')
@ApiBearerAuth()
@Controller('diagnosis')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Crear nuevo prediagnóstico con IA',
    description: 'Genera un prediagnóstico automático basado en los síntomas reportados por el cliente usando inteligencia artificial.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Prediagnóstico creado exitosamente. El análisis se procesará de forma asíncrona.',
    type: DiagnosisResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o servicio de IA no disponible',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sin permisos para acceder a la mascota especificada',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Mascota o cita no encontrada',
  })
  async create(
    @Body(ValidationPipe) createDiagnosisDto: CreateDiagnosisDto,
    @CurrentUser() currentUser: any,
  ): Promise<DiagnosisResponseDto> {
    return this.diagnosisService.create(createDiagnosisDto, currentUser);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener prediagnósticos del usuario actual',
    description: 'Lista todos los prediagnósticos asociados al usuario autenticado. Los clientes ven solo sus diagnósticos, los veterinarios ven todos.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de prediagnósticos obtenida exitosamente',
    type: [DiagnosisResponseDto],
  })
  async findByUser(@CurrentUser() currentUser: any): Promise<DiagnosisResponseDto[]> {
    return this.diagnosisService.findByUser(currentUser);
  }

  @Get('pet/:petId')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener prediagnósticos de una mascota específica',
    description: 'Lista todos los prediagnósticos de una mascota ordenados por fecha (más recientes primero).',
  })
  @ApiParam({
    name: 'petId',
    description: 'ID de la mascota',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de prediagnósticos de la mascota obtenida exitosamente',
    type: [DiagnosisResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sin permisos para acceder a esta mascota',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Mascota no encontrada',
  })
  async findByPet(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() currentUser: any,
  ): Promise<DiagnosisResponseDto[]> {
    return this.diagnosisService.findByPet(petId, currentUser);
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener prediagnóstico específico',
    description: 'Obtiene los detalles completos de un prediagnóstico específico, incluyendo resultados de IA si están disponibles.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del prediagnóstico',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Prediagnóstico obtenido exitosamente',
    type: DiagnosisResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Sin permisos para acceder a este prediagnóstico',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Prediagnóstico no encontrado',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
  ): Promise<DiagnosisResponseDto> {
    return this.diagnosisService.findOne(id, currentUser);
  }

  @Get('health/check')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Verificar estado del servicio de IA',
    description: 'Endpoint para administradores para verificar la conectividad con DeepSeek.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado del servicio obtenido exitosamente',
    schema: {
      properties: {
        deepSeek: {
          type: 'boolean',
          description: 'Estado de conectividad con DeepSeek',
          example: true,
        },
      },
    },
  })
  async healthCheck(): Promise<{ deepSeek: boolean }> {
    return this.diagnosisService.healthCheck();
  }
} 