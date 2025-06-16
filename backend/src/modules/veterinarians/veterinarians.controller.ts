import { Controller, Get, Param, Query, ParseIntPipe, UseGuards, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { VeterinariansService } from './veterinarians.service';
import { VeterinarianQueryDto } from './dto/veterinarian-query.dto';
import { VeterinarianResponseDto } from './dto/veterinarian-response.dto';
import { UpdateVeterinarianProfileDto } from './dto/update-veterinarian-profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('veterinarians')
@ApiBearerAuth()
@Controller('veterinarians')
@UseGuards(JwtAuthGuard)
export class VeterinariansController {
  constructor(private readonly veterinariansService: VeterinariansService) {}

  @Get('debug/list-all')
  @ApiOperation({ summary: '[DEBUG] Listar todos los veterinarios con sus IDs' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarios obtenida exitosamente' })
  async debugListAll() {
    // Este es un endpoint temporal para debug - remover en producción
    return this.veterinariansService.findAll({ page: 1, limit: 100 });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de veterinarios' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarios obtenida exitosamente' })
  async findAll(@Query() query: VeterinarianQueryDto) {
    return this.veterinariansService.findAll(query);
  }

  @Get('profile')
  @Roles(UserRole.VET)
  @ApiOperation({ summary: 'Obtener perfil del veterinario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente', type: VeterinarianResponseDto })
  async getMyProfile(@CurrentUser() user: any): Promise<VeterinarianResponseDto> {
    return this.veterinariansService.findByUserId(user.id);
  }

  @Put('profile')
  @Roles(UserRole.VET)
  @ApiOperation({ summary: 'Actualizar perfil del veterinario' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente', type: VeterinarianResponseDto })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateVeterinarianProfileDto
  ): Promise<VeterinarianResponseDto> {
    return this.veterinariansService.updateProfile(user.id, updateProfileDto);
  }

  @Get('my-stats')
  @Roles(UserRole.VET)
  @ApiOperation({ summary: 'Obtener estadísticas del veterinario autenticado' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getMyStats(@CurrentUser() user: any) {
    return this.veterinariansService.getMyStats(user.id);
  }

  @Get('my-appointments')
  @Roles(UserRole.VET)
  @ApiOperation({ summary: 'Obtener citas del veterinario autenticado' })
  @ApiResponse({ status: 200, description: 'Citas obtenidas exitosamente' })
  async getMyAppointments(
    @CurrentUser() user: any,
    @Query('date') date?: string,
    @Query('status') status?: string
  ) {
    return this.veterinariansService.getMyAppointments(user.id, { date, status });
  }

  @Get('specialties')
  @ApiOperation({ summary: 'Obtener especialidades disponibles' })
  @ApiResponse({ status: 200, description: 'Especialidades obtenidas exitosamente' })
  async getSpecialties() {
    return this.veterinariansService.getSpecialties();
  }

  @Get('schedule')
  @Roles(UserRole.VET)
  @ApiOperation({ summary: 'Obtener horarios del veterinario autenticado' })
  @ApiResponse({ status: 200, description: 'Horarios obtenidos exitosamente' })
  async getMySchedule(
    @CurrentUser() user: any,
    @Query('date') date?: string
  ) {
    return this.veterinariansService.getMySchedule(user.id, { date });
  }

  @Put('schedule')
  @Roles(UserRole.VET)
  @ApiOperation({ summary: 'Actualizar horarios del veterinario autenticado' })
  @ApiResponse({ status: 200, description: 'Horarios actualizados exitosamente' })
  async updateMySchedule(
    @CurrentUser() user: any,
    @Body() scheduleData: any
  ) {
    return this.veterinariansService.updateMySchedule(user.id, scheduleData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener veterinario por ID' })
  @ApiResponse({ status: 200, description: 'Veterinario obtenido exitosamente', type: VeterinarianResponseDto })
  @ApiResponse({ status: 404, description: 'Veterinario no encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<VeterinarianResponseDto> {
    return this.veterinariansService.findOne(id);
  }

  @Get(':id/stats')
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener estadísticas de un veterinario específico' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getVeterinarianStats(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariansService.getVeterinarianStats(id);
  }

  @Get(':id/appointments')
  @Roles(UserRole.VET, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener citas de un veterinario específico' })
  @ApiResponse({ status: 200, description: 'Citas obtenidas exitosamente' })
  async getVeterinarianAppointments(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date?: string,
    @Query('status') status?: string
  ) {
    return this.veterinariansService.getVeterinarianAppointments(id, { date, status });
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Obtener horarios de un veterinario específico' })
  @ApiResponse({ status: 200, description: 'Horarios obtenidos exitosamente' })
  async getVeterinarianSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date?: string
  ) {
    return this.veterinariansService.getVeterinarianSchedule(id, { date });
  }
} 