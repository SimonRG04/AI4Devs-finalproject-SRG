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
import { PrescriptionsService, PaginatedResponse } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrescriptionsQueryDto } from './dto/prescriptions-query.dto';
import { PrescriptionResponseDto } from './dto/prescription-response.dto';
import { PrescriptionStatus } from './entities/prescription.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Prescripciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('medical-record/:medicalRecordId')
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Crear nueva prescripción',
    description: 'Crea una nueva prescripción asociada a un registro médico. Solo veterinarios y administradores.'
  })
  @ApiParam({ 
    name: 'medicalRecordId', 
    description: 'ID del registro médico',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Prescripción creada exitosamente',
    type: PrescriptionResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin permisos para crear prescripciones' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Registro médico no encontrado' 
  })
  create(
    @Param('medicalRecordId', ParseIntPipe) medicalRecordId: number,
    @Body(ValidationPipe) createPrescriptionDto: CreatePrescriptionDto,
    @CurrentUser() currentUser: any,
  ): Promise<PrescriptionResponseDto> {
    return this.prescriptionsService.create(createPrescriptionDto, medicalRecordId, currentUser);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener prescripciones con filtros',
    description: 'Lista prescripciones con filtros y paginación según el rol del usuario'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de prescripciones obtenida exitosamente',
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
    description: 'Prescripciones por página',
    example: 10 
  })
  @ApiQuery({ 
    name: 'petId', 
    required: false, 
    description: 'Filtrar por ID de mascota',
    example: 1 
  })
  @ApiQuery({ 
    name: 'medicationSearch', 
    required: false, 
    description: 'Buscar en medicamentos',
    example: 'amoxicilina' 
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    description: 'Filtrar por estado',
    enum: PrescriptionStatus 
  })
  @ApiQuery({ 
    name: 'activeOnly', 
    required: false, 
    description: 'Solo prescripciones activas',
    example: true 
  })
  findAll(
    @Query(ValidationPipe) query: PrescriptionsQueryDto,
    @CurrentUser() currentUser: any,
  ): Promise<PaginatedResponse<PrescriptionResponseDto>> {
    return this.prescriptionsService.findAll(query, currentUser);
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Obtener prescripciones activas',
    description: 'Lista solo las prescripciones que están actualmente en vigor'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de prescripciones activas obtenida exitosamente',
  })
  findActive(
    @Query(ValidationPipe) query: PrescriptionsQueryDto,
    @CurrentUser() currentUser: any,
  ): Promise<PaginatedResponse<PrescriptionResponseDto>> {
    return this.prescriptionsService.findActive(query, currentUser);
  }

  @Get('expiring-soon/:days')
  @ApiOperation({ 
    summary: 'Obtener prescripciones que expiran pronto',
    description: 'Lista prescripciones que expiran en los próximos N días'
  })
  @ApiParam({ 
    name: 'days', 
    description: 'Días hasta expiración',
    example: 7 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de prescripciones que expiran pronto obtenida exitosamente',
  })
  findExpiringSoon(
    @Param('days', ParseIntPipe) days: number,
    @Query(ValidationPipe) query: PrescriptionsQueryDto,
    @CurrentUser() currentUser: any,
  ): Promise<PaginatedResponse<PrescriptionResponseDto>> {
    return this.prescriptionsService.findExpiringSoon(days, query, currentUser);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener prescripción por ID',
    description: 'Obtiene una prescripción específica con todas sus relaciones'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la prescripción',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Prescripción encontrada',
    type: PrescriptionResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Prescripción no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin acceso a esta prescripción' 
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
  ): Promise<PrescriptionResponseDto> {
    return this.prescriptionsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Actualizar prescripción',
    description: 'Actualiza una prescripción existente. Solo veterinarios propietarios y administradores.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la prescripción',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Prescripción actualizada exitosamente',
    type: PrescriptionResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin permisos para actualizar esta prescripción' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Prescripción no encontrada' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePrescriptionDto: UpdatePrescriptionDto,
    @CurrentUser() currentUser: any,
  ): Promise<PrescriptionResponseDto> {
    return this.prescriptionsService.update(id, updatePrescriptionDto, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Cambiar estado de prescripción',
    description: 'Cambia el estado de una prescripción (ACTIVE, COMPLETED, DISCONTINUED, SUSPENDED)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la prescripción',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Estado de prescripción actualizado exitosamente',
    type: PrescriptionResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin permisos para cambiar el estado' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Prescripción no encontrada' 
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: PrescriptionStatus,
    @CurrentUser() currentUser: any,
  ): Promise<PrescriptionResponseDto> {
    return this.prescriptionsService.updateStatus(id, status, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Eliminar prescripción',
    description: 'Elimina una prescripción. Solo administradores.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la prescripción',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Prescripción eliminada exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Solo administradores pueden eliminar prescripciones' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Prescripción no encontrada' 
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
  ): Promise<void> {
    return this.prescriptionsService.remove(id, currentUser);
  }

  @Get('medical-record/:medicalRecordId')
  @ApiOperation({ 
    summary: 'Obtener prescripciones por registro médico',
    description: 'Obtiene todas las prescripciones de un registro médico específico'
  })
  @ApiParam({ 
    name: 'medicalRecordId', 
    description: 'ID del registro médico',
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Prescripciones del registro médico obtenidas exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Registro médico no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Sin acceso a este registro médico' 
  })
  findByMedicalRecord(
    @Param('medicalRecordId', ParseIntPipe) medicalRecordId: number,
    @Query(ValidationPipe) query: PrescriptionsQueryDto,
    @CurrentUser() currentUser: any,
  ): Promise<PaginatedResponse<PrescriptionResponseDto>> {
    return this.prescriptionsService.findByMedicalRecord(medicalRecordId, query, currentUser);
  }
} 