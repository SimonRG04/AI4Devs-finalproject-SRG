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
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PetsService, PaginatedResponse } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsQueryDto } from './dto/pets-query.dto';
import { PetResponseDto } from './dto/pet-response.dto';
import { Pet } from './entities/pet.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('pets')
@ApiBearerAuth()
@Controller('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva mascota',
    description: 'Permite a los clientes crear una nueva mascota en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Mascota creada exitosamente',
    type: PetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  async create(
    @Body() createPetDto: CreatePetDto,
    @CurrentUser() user: any,
  ): Promise<Pet> {
    // Para clientes, usar su propio clientId, para admins permitir especificar
    let clientId: number;
    
    if (user.role === UserRole.CLIENT) {
      clientId = user.clientId;
    } else {
      // Los administradores podrían crear mascotas para cualquier cliente
      // Por ahora usamos el clientId del usuario, pero se podría extender
      clientId = user.clientId;
    }

    return this.petsService.create(createPetDto, clientId, user);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener lista de mascotas',
    description: 'Obtiene una lista paginada de mascotas con filtros opcionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mascotas obtenida exitosamente',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PetResponseDto' },
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
    @Query() query: PetsQueryDto,
    @CurrentUser() user: any,
  ): Promise<PaginatedResponse<Pet>> {
    return this.petsService.findAll(query, user);
  }

  @Get('client/:clientId')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener mascotas de un cliente específico',
    description: 'Obtiene todas las mascotas pertenecientes a un cliente',
  })
  @ApiParam({
    name: 'clientId',
    description: 'ID del cliente',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Mascotas del cliente obtenidas exitosamente',
    type: [PetResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a este cliente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  async findByClient(
    @Param('clientId', ParseIntPipe) clientId: number,
    @CurrentUser() user: any,
  ): Promise<Pet[]> {
    return this.petsService.findByClient(clientId, user);
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener una mascota por ID',
    description: 'Obtiene los detalles completos de una mascota específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la mascota',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Mascota obtenida exitosamente',
    type: PetResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a esta mascota',
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota no encontrada',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Pet> {
    return this.petsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT, UserRole.VET, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Actualizar una mascota',
    description: 'Actualiza los datos de una mascota existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la mascota',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Mascota actualizada exitosamente',
    type: PetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a esta mascota',
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota no encontrada',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
    @CurrentUser() user: any,
  ): Promise<Pet> {
    return this.petsService.update(id, updatePetDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una mascota',
    description: 'Elimina una mascota del sistema (solo si no tiene citas futuras)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la mascota',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Mascota eliminada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar la mascota (tiene citas programadas)',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes acceso a esta mascota',
  })
  @ApiResponse({
    status: 404,
    description: 'Mascota no encontrada',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<void> {
    return this.petsService.remove(id, user);
  }
} 