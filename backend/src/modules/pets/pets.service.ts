import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { Client } from '../users/entities/client.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsQueryDto } from './dto/pets-query.dto';
import { UserRole } from '../users/entities/user.entity';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PetsService {
  private readonly logger = new Logger(PetsService.name);

  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  /**
   * Crear una nueva mascota
   */
  async create(
    createPetDto: CreatePetDto,
    clientId: number,
    currentUser: any,
  ): Promise<Pet> {
    this.logger.log(`Creating pet for client ${clientId}`);
    this.logger.log(`Current user: ${JSON.stringify({
      id: currentUser.id,
      role: currentUser.role,
      clientId: currentUser.clientId,
      veterinarianId: currentUser.veterinarianId
    })}`);

    // Validar que el usuario puede crear mascotas para este cliente
    await this.validateClientAccess(clientId, currentUser);

    // Validar fecha de nacimiento
    if (createPetDto.birthDate) {
      const birthDate = new Date(createPetDto.birthDate);
      const today = new Date();
      
      if (birthDate > today) {
        throw new BadRequestException('La fecha de nacimiento no puede ser futura');
      }
      
      // Validar que la mascota no sea demasiado vieja (más de 50 años)
      const age = (today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age > 50) {
        throw new BadRequestException('La fecha de nacimiento parece incorrecta');
      }
    }

    try {
      const pet = this.petRepository.create({
        ...createPetDto,
        clientId,
        birthDate: createPetDto.birthDate ? new Date(createPetDto.birthDate) : null,
      });

      const savedPet = await this.petRepository.save(pet);
      this.logger.log(`Pet created successfully with ID: ${savedPet.id}`);
      
      return savedPet;
    } catch (error) {
      this.logger.error(`Error creating pet: ${error.message}`, error.stack);
      throw new BadRequestException(`Error al crear la mascota: ${error.message}`);
    }
  }

  /**
   * Obtener mascotas con filtros y paginación
   */
  async findAll(
    query: PetsQueryDto,
    currentUser: any,
  ): Promise<PaginatedResponse<Pet>> {
    this.logger.log(`Finding pets with query: ${JSON.stringify(query)}`);

    const queryBuilder = this.petRepository
      .createQueryBuilder('pet')
      .leftJoinAndSelect('pet.client', 'client');

    // Solo incluir información del propietario si se solicita explícitamente
    if (query.includeOwner) {
      queryBuilder.leftJoinAndSelect('client.user', 'user');
    }

    // Aplicar filtros de acceso según el rol
    this.applyAccessFilters(queryBuilder, currentUser);

    // Aplicar filtros de búsqueda
    this.applySearchFilters(queryBuilder, query);

    // Aplicar ordenamiento
    this.applySorting(queryBuilder, query);

    // Obtener total para paginación
    const total = await queryBuilder.getCount();

    // Aplicar paginación
    const { page, limit } = query;
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);

    const pets = await queryBuilder.getMany();

    return {
      data: pets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener una mascota por ID
   */
  async findOne(id: number, currentUser: any): Promise<Pet> {
    this.logger.log(`Finding pet with ID: ${id}`);

    const pet = await this.petRepository.findOne({
      where: { id },
      relations: [
        'client',
        'client.user',
        'appointments',
        'vaccinations',
      ],
    });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }

    // Validar acceso a la mascota
    await this.validatePetAccess(pet, currentUser);

    return pet;
  }

  /**
   * Actualizar una mascota
   */
  async update(
    id: number,
    updatePetDto: UpdatePetDto,
    currentUser: any,
  ): Promise<Pet> {
    this.logger.log(`Updating pet with ID: ${id}`);

    const pet = await this.findOne(id, currentUser);

    // Validar fecha de nacimiento si se proporciona
    if (updatePetDto.birthDate) {
      const birthDate = new Date(updatePetDto.birthDate);
      const today = new Date();
      
      if (birthDate > today) {
        throw new BadRequestException('La fecha de nacimiento no puede ser futura');
      }
    }

    try {
      // Preparar datos para actualización
      const updateData = {
        ...updatePetDto,
        birthDate: updatePetDto.birthDate ? new Date(updatePetDto.birthDate) : pet.birthDate,
      };

      await this.petRepository.update(id, updateData);
      
      const updatedPet = await this.findOne(id, currentUser);
      this.logger.log(`Pet updated successfully with ID: ${id}`);
      
      return updatedPet;
    } catch (error) {
      this.logger.error(`Error updating pet: ${error.message}`, error.stack);
      throw new BadRequestException('Error al actualizar la mascota');
    }
  }

  /**
   * Eliminar una mascota
   */
  async remove(id: number, currentUser: any): Promise<void> {
    this.logger.log(`Removing pet with ID: ${id}`);

    const pet = await this.findOne(id, currentUser);

    // Verificar que no tenga citas futuras
    const upcomingAppointments = await this.petRepository
      .createQueryBuilder('pet')
      .leftJoin('pet.appointments', 'appointment')
      .where('pet.id = :id', { id })
      .andWhere('appointment.scheduledAt > :now', { now: new Date() })
      .andWhere('appointment.status IN (:...statuses)', { 
        statuses: ['SCHEDULED', 'CONFIRMED'] 
      })
      .getCount();

    if (upcomingAppointments > 0) {
      throw new BadRequestException(
        'No se puede eliminar la mascota porque tiene citas programadas'
      );
    }

    try {
      await this.petRepository.remove(pet);
      this.logger.log(`Pet removed successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error removing pet: ${error.message}`, error.stack);
      throw new BadRequestException('Error al eliminar la mascota');
    }
  }

  /**
   * Obtener mascotas de un cliente
   */
  async findByClient(clientId: number, currentUser: any): Promise<Pet[]> {
    this.logger.log(`Finding pets for client ${clientId}`);

    // Validar acceso al cliente
    await this.validateClientAccess(clientId, currentUser);

    const pets = await this.petRepository.find({
      where: { clientId },
      relations: ['client', 'client.user'],
      order: { createdAt: 'DESC' },
    });

    return pets;
  }

  /**
   * Obtener citas de una mascota
   */
  async getPetAppointments(
    petId: number,
    query: { page: number; limit: number },
    currentUser: any,
  ): Promise<PaginatedResponse<any>> {
    this.logger.log(`Finding appointments for pet ${petId}`);

    // Primero validar acceso a la mascota
    const pet = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['client', 'client.user'],
    });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
    }

    await this.validatePetAccess(pet, currentUser);

    // Usar una consulta directa para evitar dependencia circular
    const queryBuilder = this.petRepository.manager
      .createQueryBuilder()
      .select([
        'appointment.id as appointment_id',
        'appointment.scheduled_at as scheduledAt',
        'appointment.type as appointment_type',
        'appointment.status as appointment_status',
        'appointment.priority as appointment_priority',
        'appointment.duration as appointment_duration',
        'appointment.notes as appointment_notes',
        'appointment.created_at as createdAt',
        'appointment.updated_at as updatedAt',
        'vet_user.first_name as vet_user_firstName',
        'vet_user.last_name as vet_user_lastName',
        'veterinarian.specialization as veterinarian_specialty',
        'veterinarian.license_number as veterinarian_license'
      ])
      .from('appointments', 'appointment')
      .leftJoin('veterinarians', 'veterinarian', 'veterinarian.id = appointment.veterinarian_id')
      .leftJoin('users', 'vet_user', 'vet_user.id = veterinarian.user_id')
      .where('appointment.pet_id = :petId', { petId })
      .orderBy('appointment.scheduled_at', 'DESC')
      .limit(query.limit)
      .offset((query.page - 1) * query.limit);

    const appointments = await queryBuilder.getRawMany();

    // Contar el total de registros
    const totalQuery = this.petRepository.manager
      .createQueryBuilder()
      .select('COUNT(*) as count')
      .from('appointments', 'appointment')
      .where('appointment.pet_id = :petId', { petId });

    const totalResult = await totalQuery.getRawOne();
    const total = parseInt(totalResult.count);

    // Transformar los resultados
    const transformedAppointments = appointments.map(apt => ({
      id: apt.appointment_id,
      scheduledAt: apt.scheduledAt,
      type: apt.appointment_type,
      status: apt.appointment_status,
      priority: apt.appointment_priority,
      duration: apt.appointment_duration,
      notes: apt.appointment_notes,
      createdAt: apt.createdAt,
      updatedAt: apt.updatedAt,
      veterinarian: {
        firstName: apt.vet_user_firstName,
        lastName: apt.vet_user_lastName,
        specialty: apt.veterinarian_specialty,
        license: apt.veterinarian_license
      }
    }));

    return {
      data: transformedAppointments,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  /**
   * Aplicar filtros de acceso según el rol del usuario
   */
  private applyAccessFilters(
    queryBuilder: SelectQueryBuilder<Pet>,
    currentUser: any,
  ): void {
    this.logger.log(`Applying access filters for user: ${JSON.stringify({
      id: currentUser.id,
      role: currentUser.role,
      clientId: currentUser.clientId
    })}`);
    
    if (currentUser.role === UserRole.CLIENT) {
      // Los clientes solo ven sus propias mascotas
      // Usar clientId para filtrar directamente por client_id
      queryBuilder.andWhere('pet.clientId = :clientId', { 
        clientId: currentUser.clientId 
      });
    } else if (currentUser.role === UserRole.VET) {
      // Los veterinarios pueden ver todas las mascotas
      // pero podrían tener filtros adicionales en el futuro
    }
    // Los administradores pueden ver todas las mascotas sin filtros
  }

  /**
   * Aplicar filtros de búsqueda
   */
  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<Pet>,
    query: PetsQueryDto,
  ): void {
    if (query.species) {
      queryBuilder.andWhere('pet.species = :species', { species: query.species });
    }

    if (query.gender) {
      queryBuilder.andWhere('pet.gender = :gender', { gender: query.gender });
    }

    if (query.name) {
      queryBuilder.andWhere('LOWER(pet.name) LIKE LOWER(:name)', { 
        name: `%${query.name}%` 
      });
    }

    if (query.search) {
      // Búsqueda general en nombre de mascota, raza, o nombre del propietario
      // Solo buscar en propietario si la relación está incluida
      if (query.includeOwner) {
        queryBuilder.andWhere(
          '(LOWER(pet.name) LIKE LOWER(:search) OR ' +
          'LOWER(pet.breed) LIKE LOWER(:search) OR ' +
          'LOWER(CONCAT(user.firstName, \' \', user.lastName)) LIKE LOWER(:search) OR ' +
          'LOWER(CONCAT(user.first_name, \' \', user.last_name)) LIKE LOWER(:search))',
          { search: `%${query.search}%` }
        );
      } else {
        queryBuilder.andWhere(
          '(LOWER(pet.name) LIKE LOWER(:search) OR ' +
          'LOWER(pet.breed) LIKE LOWER(:search))',
          { search: `%${query.search}%` }
        );
      }
    }

    if (query.breed) {
      queryBuilder.andWhere('LOWER(pet.breed) LIKE LOWER(:breed)', { 
        breed: `%${query.breed}%` 
      });
    }
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<Pet>,
    query: PetsQueryDto,
  ): void {
    const { sortBy, sortOrder } = query;
    
    const allowedSortFields = ['name', 'species', 'birthDate', 'createdAt', 'updatedAt'];
    const field = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    
    queryBuilder.orderBy(`pet.${field}`, sortOrder);
  }

  /**
   * Validar acceso a un cliente específico
   */
  private async validateClientAccess(clientId: number, currentUser: any): Promise<void> {
    if (currentUser.role === UserRole.CLIENT) {
      // Para los clientes, verificar que el clientId coincida con su clientId del token
      if (currentUser.clientId !== clientId) {
        throw new ForbiddenException('No tienes acceso a este cliente');
      }
    }
    // Para VET y ADMIN, permitir acceso sin restricciones adicionales
  }

  /**
   * Validar acceso a una mascota específica
   */
  private async validatePetAccess(pet: Pet, currentUser: any): Promise<void> {
    if (currentUser.role === UserRole.CLIENT) {
      // Verificar que el cliente solo acceda a sus propias mascotas
      if (pet.clientId !== currentUser.clientId) {
        throw new ForbiddenException('No tienes acceso a esta mascota');
      }
    }
  }
} 