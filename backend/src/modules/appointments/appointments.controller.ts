import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AppointmentsService, PaginatedResponse } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { 
  AvailabilityQueryDto, 
  VeterinarianAvailabilityDto 
} from './dto/availability.dto';
import { Appointment } from './entities/appointment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva cita',
    description: 'Permite crear una nueva cita médica para una mascota',
  })
  @ApiResponse({
    status: 201,
    description: 'Cita creada exitosamente',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o conflicto de horario',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota o veterinario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de horario',
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user: any,
  ): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto, user);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener lista de citas',
    description: 'Obtiene una lista paginada de citas con filtros opcionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de citas obtenida exitosamente',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/AppointmentResponseDto' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async findAll(
    @Query() query: AppointmentsQueryDto,
    @CurrentUser() user: any,
  ): Promise<PaginatedResponse<Appointment>> {
    return this.appointmentsService.findAll(query, user);
  }

  @Get('availability')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Consultar disponibilidad de todos los veterinarios',
    description: 'Obtiene la disponibilidad de todos los veterinarios para una fecha específica',
  })
  @ApiQuery({
    name: 'date',
    description: 'Fecha para consultar disponibilidad',
    example: '2024-02-15',
    required: true,
  })
  @ApiQuery({
    name: 'duration',
    description: 'Duración de la cita en minutos',
    example: 30,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad obtenida exitosamente',
    type: [VeterinarianAvailabilityDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de fecha inválidos',
  })
  async getAvailability(
    @Query() query: AvailabilityQueryDto,
  ): Promise<VeterinarianAvailabilityDto[]> {
    return this.appointmentsService.getAllVeterinariansAvailability(query);
  }

  @Get('availability/:veterinarianId')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Consultar disponibilidad de un veterinario específico',
    description: 'Obtiene la disponibilidad de un veterinario para una fecha específica',
  })
  @ApiParam({
    name: 'veterinarianId',
    description: 'ID del veterinario',
    example: 1,
  })
  @ApiQuery({
    name: 'date',
    description: 'Fecha para consultar disponibilidad',
    example: '2024-02-15',
    required: true,
  })
  @ApiQuery({
    name: 'duration',
    description: 'Duración de la cita en minutos',
    example: 30,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad obtenida exitosamente',
    type: VeterinarianAvailabilityDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Veterinario no encontrado',
  })
  async getVeterinarianAvailability(
    @Param('veterinarianId', ParseIntPipe) veterinarianId: number,
    @Query() query: AvailabilityQueryDto,
  ): Promise<VeterinarianAvailabilityDto> {
    return this.appointmentsService.getVeterinarianAvailability(veterinarianId, query);
  }

  @Get('my-appointments')
  @Roles(UserRole.CLIENT)
  @ApiOperation({
    summary: 'Obtener mis citas',
    description: 'Obtiene todas las citas del cliente autenticado con filtros opcionales',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filtrar por estado de la cita',
    example: 'SCHEDULED',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Límite de resultados',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Citas obtenidas exitosamente',
    type: [AppointmentResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getMyAppointments(
    @Query() query: AppointmentsQueryDto,
    @CurrentUser() user: any,
  ): Promise<PaginatedResponse<Appointment>> {
    // Filtrar solo las citas del cliente autenticado
    const clientQuery = {
      ...query,
      clientId: user.clientId,
    };
    return this.appointmentsService.findAll(clientQuery, user);
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener una cita por ID',
    description: 'Obtiene los detalles completos de una cita específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cita obtenida exitosamente',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a esta cita',
  })
  @ApiResponse({
    status: 404,
    description: 'Cita no encontrada',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Appointment> {
    return this.appointmentsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Actualizar una cita',
    description: 'Actualiza los datos de una cita existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cita actualizada exitosamente',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o cita no modificable',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a esta cita',
  })
  @ApiResponse({
    status: 404,
    description: 'Cita no encontrada',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user: any,
  ): Promise<Appointment> {
    return this.appointmentsService.update(id, updateAppointmentDto, user);
  }

  @Put(':id/cancel')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Cancelar una cita',
    description: 'Cancela una cita programada',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cita cancelada exitosamente',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'La cita no se puede cancelar',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a esta cita',
  })
  @ApiResponse({
    status: 404,
    description: 'Cita no encontrada',
  })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Appointment> {
    return this.appointmentsService.cancel(id, user);
  }

  @Put(':id/confirm')
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Confirmar una cita',
    description: 'Confirma una cita programada',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cita confirmada exitosamente',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Solo se pueden confirmar citas programadas',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a esta cita',
  })
  @ApiResponse({
    status: 404,
    description: 'Cita no encontrada',
  })
  async confirm(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Appointment> {
    return this.appointmentsService.confirm(id, user);
  }

  @Put(':id/complete')
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Completar una cita',
    description: 'Marca una cita como completada',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cita completada exitosamente',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede completar una cita cancelada',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los veterinarios pueden completar citas',
  })
  @ApiResponse({
    status: 404,
    description: 'Cita no encontrada',
  })
  async complete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Appointment> {
    return this.appointmentsService.complete(id, user);
  }
} 