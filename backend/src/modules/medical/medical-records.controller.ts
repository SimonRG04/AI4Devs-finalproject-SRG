import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MedicalRecordsService, PaginatedResponse } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordsQueryDto } from './dto/medical-records-query.dto';
import { MedicalRecordResponseDto } from './dto/medical-record-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Registros Médicos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Crear nuevo registro médico',
    description: 'Crea un nuevo registro médico asociado a una cita. Solo veterinarios y administradores.'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Registro médico creado exitosamente',
    type: MedicalRecordResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos o cita ya tiene registro médico' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin permisos para crear registros médicos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Cita no encontrada' 
  })
  create(
    @Body(ValidationPipe) createMedicalRecordDto: CreateMedicalRecordDto,
    @CurrentUser() currentUser: any,
  ): Promise<MedicalRecordResponseDto> {
    return this.medicalRecordsService.create(createMedicalRecordDto, currentUser);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener registros médicos con filtros',
    description: 'Lista registros médicos con filtros y paginación según el rol del usuario'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de registros médicos obtenida exitosamente',
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Número de página',
    example: 1 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Registros por página',
    example: 10 
  })
  @ApiQuery({ 
    name: 'petId', 
    required: false, 
    description: 'Filtrar por ID de mascota',
    example: 1 
  })
  @ApiQuery({ 
    name: 'veterinarianId', 
    required: false, 
    description: 'Filtrar por ID de veterinario',
    example: 1 
  })
  @ApiQuery({ 
    name: 'diagnosisSearch', 
    required: false, 
    description: 'Buscar en diagnósticos',
    example: 'otitis' 
  })
  @ApiQuery({ 
    name: 'dateFrom', 
    required: false, 
    description: 'Fecha de inicio del rango',
    example: '2025-01-01' 
  })
  @ApiQuery({ 
    name: 'dateTo', 
    required: false, 
    description: 'Fecha de fin del rango',
    example: '2025-12-31' 
  })
  @ApiQuery({ 
    name: 'requiresFollowUp', 
    required: false, 
    description: 'Filtrar registros que requieren seguimiento',
    example: true 
  })
  @ApiQuery({ 
    name: 'includePrescriptions', 
    required: false, 
    description: 'Incluir prescripciones en la respuesta',
    example: true 
  })
  findAll(
    @Query(ValidationPipe) query: MedicalRecordsQueryDto,
    @CurrentUser() currentUser: any,
  ): Promise<PaginatedResponse<MedicalRecordResponseDto>> {
    return this.medicalRecordsService.findAll(query, currentUser);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener registro médico por ID',
    description: 'Obtiene un registro médico específico con todas sus relaciones'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del registro médico',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Registro médico encontrado',
    type: MedicalRecordResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Registro médico no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin acceso a este registro médico' 
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
  ): Promise<MedicalRecordResponseDto> {
    return this.medicalRecordsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Actualizar registro médico',
    description: 'Actualiza un registro médico existente. Solo veterinarios propietarios y administradores.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del registro médico',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Registro médico actualizado exitosamente',
    type: MedicalRecordResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin permisos para actualizar este registro médico' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Registro médico no encontrado' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMedicalRecordDto: UpdateMedicalRecordDto,
    @CurrentUser() currentUser: any,
  ): Promise<MedicalRecordResponseDto> {
    return this.medicalRecordsService.update(id, updateMedicalRecordDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Eliminar registro médico',
    description: 'Elimina un registro médico. Solo administradores.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del registro médico',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Registro médico eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Solo administradores pueden eliminar registros médicos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Registro médico no encontrado' 
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
  ): Promise<void> {
    return this.medicalRecordsService.remove(id, currentUser);
  }

  @Get('pet/:petId')
  @ApiOperation({ 
    summary: 'Obtener registros médicos por mascota',
    description: 'Obtiene todos los registros médicos de una mascota específica'
  })
  @ApiParam({ 
    name: 'petId', 
    description: 'ID de la mascota',
    example: 1 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Número de página',
    example: 1 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Registros por página',
    example: 10 
  })
  @ApiQuery({ 
    name: 'includePrescriptions', 
    required: false, 
    description: 'Incluir prescripciones en la respuesta',
    example: true 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Registros médicos de la mascota obtenidos exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Mascota no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin acceso a esta mascota' 
  })
  findByPet(
    @Param('petId', ParseIntPipe) petId: number,
    @Query(ValidationPipe) query: MedicalRecordsQueryDto,
    @CurrentUser() currentUser: any,
  ): Promise<PaginatedResponse<MedicalRecordResponseDto>> {
    return this.medicalRecordsService.findByPet(petId, query, currentUser);
  }
} 