import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Between, Not, In, MoreThan } from 'typeorm';
import { Veterinarian } from '../users/entities/veterinarian.entity';
import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { VeterinarianQueryDto } from './dto/veterinarian-query.dto';
import { VeterinarianResponseDto } from './dto/veterinarian-response.dto';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class VeterinariansService {
  private readonly logger = new Logger(VeterinariansService.name);

  constructor(
    @InjectRepository(Veterinarian)
    private readonly veterinarianRepository: Repository<Veterinarian>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  /**
   * Obtener veterinarios con paginación y filtros
   */
  async findAll(query: VeterinarianQueryDto): Promise<PaginatedResponse<VeterinarianResponseDto>> {
    this.logger.log(`Finding veterinarians with query: ${JSON.stringify(query)}`);

    const queryBuilder = this.veterinarianRepository
      .createQueryBuilder('veterinarian')
      .leftJoinAndSelect('veterinarian.user', 'user');

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

    const veterinarians = await queryBuilder.getMany();

    // Mapear a DTO de respuesta
    const data = veterinarians.map(vet => this.mapToResponseDto(vet));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un veterinario por ID
   */
  async findOne(id: number): Promise<VeterinarianResponseDto> {
    this.logger.log(`Finding veterinarian with ID: ${id}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(veterinarian);
  }

  /**
   * Aplicar filtros de búsqueda
   */
  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<Veterinarian>,
    query: VeterinarianQueryDto,
  ): void {
    if (query.search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR veterinarian.specialization ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.specialization) {
      queryBuilder.andWhere('veterinarian.specialization ILIKE :specialization', {
        specialization: `%${query.specialization}%`
      });
    }
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<Veterinarian>,
    query: VeterinarianQueryDto,
  ): void {
    const { sortBy, sortOrder } = query;
    
    const allowedSortFields = ['createdAt', 'updatedAt', 'specialization'];
    const allowedUserFields = ['firstName', 'lastName', 'email'];
    
    if (allowedSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`veterinarian.${sortBy}`, sortOrder);
    } else if (allowedUserFields.includes(sortBy)) {
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('veterinarian.createdAt', sortOrder);
    }
  }

  /**
   * Mapear entidad a DTO de respuesta
   */
  private mapToResponseDto(veterinarian: Veterinarian): VeterinarianResponseDto {
    return {
      id: veterinarian.id,
      specialization: veterinarian.specialization,
      licenseNumber: veterinarian.licenseNumber,
      availabilityHours: veterinarian.availabilityHours,
      isActive: true, // Assuming all veterinarians are active by default
      createdAt: veterinarian.createdAt,
      updatedAt: veterinarian.updatedAt,
      user: {
        id: veterinarian.user.id,
        firstName: veterinarian.user.firstName,
        lastName: veterinarian.user.lastName,
        email: veterinarian.user.email,
        phone: veterinarian.user.phoneNumber || '',
      },
    };
  }

  /**
   * Obtener veterinario por ID de usuario
   */
  async findByUserId(userId: number): Promise<VeterinarianResponseDto> {
    this.logger.log(`Finding veterinarian by user ID: ${userId}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario para usuario ${userId} no encontrado`);
    }

    return this.mapToResponseDto(veterinarian);
  }

  /**
   * Actualizar perfil del veterinario
   */
  async updateProfile(userId: number, updateData: any): Promise<VeterinarianResponseDto> {
    this.logger.log(`Updating veterinarian profile for user ID: ${userId}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario para usuario ${userId} no encontrado`);
    }

    // Actualizar campos del veterinario
    if (updateData.specialization) {
      veterinarian.specialization = updateData.specialization;
    }
    if (updateData.availabilityHours) {
      veterinarian.availabilityHours = updateData.availabilityHours;
    }

    await this.veterinarianRepository.save(veterinarian);

    return this.mapToResponseDto(veterinarian);
  }

  /**
   * Obtener estadísticas del veterinario por user ID (para veterinario autenticado)
   */
  async getMyStats(userId: number): Promise<any> {
    this.logger.log(`Getting my stats for user ID: ${userId}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario para usuario ${userId} no encontrado`);
    }

    // Obtener fecha actual
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    // Obtener inicio y fin del mes actual
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Consultas paralelas para eficiencia
    const [
      todayAppointments,
      upcomingAppointments,
      monthlyAppointments,
      completedAppointments,
      totalPatients,
      patientsWithAlerts
    ] = await Promise.all([
      // Citas de hoy
      this.appointmentRepository.count({
        where: {
          veterinarianId: veterinarian.id,
          scheduledAt: Between(startOfDay, endOfDay),
          status: Not(In([AppointmentStatus.CANCELLED, AppointmentStatus.MISSED]))
        }
      }),
      
      // Citas futuras
      this.appointmentRepository.count({
        where: {
          veterinarianId: veterinarian.id,
          scheduledAt: MoreThan(new Date()),
          status: In([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
        }
      }),
      
      // Citas del mes actual
      this.appointmentRepository.count({
        where: {
          veterinarianId: veterinarian.id,
          scheduledAt: Between(startOfMonth, endOfMonth),
          status: Not(In([AppointmentStatus.CANCELLED, AppointmentStatus.MISSED]))
        }
      }),
      
      // Citas completadas
      this.appointmentRepository.count({
        where: {
          veterinarianId: veterinarian.id,
          status: AppointmentStatus.COMPLETED
        }
      }),
      
      // Total de pacientes únicos (mascotas)
      this.appointmentRepository
        .createQueryBuilder('appointment')
        .select('COUNT(DISTINCT appointment.petId)', 'count')
        .where('appointment.veterinarianId = :veterinarianId', { veterinarianId: veterinarian.id })
        .getRawOne()
        .then(result => parseInt(result.count) || 0),
      
      // Pacientes con alertas médicas
      this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoin('appointment.pet', 'pet')
        .select('COUNT(DISTINCT appointment.petId)', 'count')
        .where('appointment.veterinarianId = :veterinarianId', { veterinarianId: veterinarian.id })
        .andWhere('(pet.medicalAlerts IS NOT NULL AND pet.medicalAlerts != \'\')')
        .getRawOne()
        .then(result => parseInt(result.count) || 0)
    ]);

    return {
      todayAppointments,
      upcomingAppointments,
      totalPatients,
      patientsWithAlerts,
      monthlyAppointments,
      completedAppointments
    };
  }

  /**
   * Obtener estadísticas del veterinario por veterinarian ID
   */
  async getVeterinarianStats(veterinarianId: number): Promise<any> {
    this.logger.log(`Getting stats for veterinarian ID: ${veterinarianId}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { id: veterinarianId },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario con ID ${veterinarianId} no encontrado`);
    }

    // Obtener fecha actual
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    // Obtener inicio y fin del mes actual
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Consultas paralelas para eficiencia
    const [
      todayAppointments,
      upcomingAppointments,
      monthlyAppointments,
      completedAppointments,
      totalPatients,
      patientsWithAlerts
    ] = await Promise.all([
      // Citas de hoy
      this.appointmentRepository.count({
        where: {
          veterinarianId: veterinarianId,
          scheduledAt: Between(startOfDay, endOfDay),
          status: Not(In([AppointmentStatus.CANCELLED, AppointmentStatus.MISSED]))
        }
      }),
      
      // Citas futuras
      this.appointmentRepository.count({
        where: {
          veterinarianId: veterinarianId,
          scheduledAt: MoreThan(new Date()),
          status: In([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
        }
      }),
      
      // Citas del mes actual
      this.appointmentRepository.count({
        where: {
          veterinarianId: veterinarianId,
          scheduledAt: Between(startOfMonth, endOfMonth),
          status: Not(In([AppointmentStatus.CANCELLED, AppointmentStatus.MISSED]))
        }
      }),
      
      // Citas completadas
      this.appointmentRepository.count({
        where: {
          veterinarianId: veterinarianId,
          status: AppointmentStatus.COMPLETED
        }
      }),
      
      // Total de pacientes únicos (mascotas)
      this.appointmentRepository
        .createQueryBuilder('appointment')
        .select('COUNT(DISTINCT appointment.petId)', 'count')
        .where('appointment.veterinarianId = :veterinarianId', { veterinarianId: veterinarianId })
        .getRawOne()
        .then(result => parseInt(result.count) || 0),
      
      // Pacientes con alertas médicas
      this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoin('appointment.pet', 'pet')
        .select('COUNT(DISTINCT appointment.petId)', 'count')
        .where('appointment.veterinarianId = :veterinarianId', { veterinarianId: veterinarianId })
        .andWhere('(pet.medicalAlerts IS NOT NULL AND pet.medicalAlerts != \'\')')
        .getRawOne()
        .then(result => parseInt(result.count) || 0)
    ]);

    return {
      todayAppointments,
      upcomingAppointments,
      totalPatients,
      patientsWithAlerts,
      monthlyAppointments,
      completedAppointments
    };
  }

  /**
   * Obtener citas del veterinario autenticado por user ID
   */
  async getMyAppointments(userId: number, filters: { date?: string; status?: string } = {}): Promise<any> {
    this.logger.log(`Getting my appointments for user ID: ${userId} with filters: ${JSON.stringify(filters)}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario para usuario ${userId} no encontrado`);
    }

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.pet', 'pet')
      .leftJoinAndSelect('pet.client', 'client')
      .leftJoinAndSelect('client.user', 'clientUser')
      .leftJoinAndSelect('appointment.veterinarian', 'veterinarian')
      .leftJoinAndSelect('veterinarian.user', 'vetUser')
      .where('veterinarian.id = :veterinarianId', { veterinarianId: veterinarian.id });

    // Aplicar filtros
    if (filters.date) {
      queryBuilder.andWhere('DATE(appointment.scheduledAt) = :date', { date: filters.date });
    }

    if (filters.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: filters.status });
    }

    // Ordenar por fecha
    queryBuilder.orderBy('appointment.scheduledAt', 'ASC');

    const appointments = await queryBuilder.getMany();

    return {
      data: appointments,
      total: appointments.length,
      page: 1,
      limit: 20,
      totalPages: Math.ceil(appointments.length / 20)
    };
  }

  /**
   * Obtener citas del veterinario por veterinarian ID
   */
  async getVeterinarianAppointments(veterinarianId: number, filters: { date?: string; status?: string } = {}): Promise<any> {
    this.logger.log(`Getting appointments for veterinarian ID: ${veterinarianId} with filters: ${JSON.stringify(filters)}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { id: veterinarianId },
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario con ID ${veterinarianId} no encontrado`);
    }

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.pet', 'pet')
      .leftJoinAndSelect('pet.client', 'client')
      .leftJoinAndSelect('client.user', 'clientUser')
      .leftJoinAndSelect('appointment.veterinarian', 'veterinarian')
      .leftJoinAndSelect('veterinarian.user', 'vetUser')
      .where('veterinarian.id = :veterinarianId', { veterinarianId: veterinarianId });

    // Aplicar filtros
    if (filters.date) {
      queryBuilder.andWhere('DATE(appointment.scheduledAt) = :date', { date: filters.date });
    }

    if (filters.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: filters.status });
    }

    // Ordenar por fecha
    queryBuilder.orderBy('appointment.scheduledAt', 'ASC');

    const appointments = await queryBuilder.getMany();

    return {
      data: appointments,
      total: appointments.length,
      page: 1,
      limit: 20,
      totalPages: Math.ceil(appointments.length / 20)
    };
  }

  /**
   * Obtener especialidades disponibles
   */
  async getSpecialties(): Promise<string[]> {
    this.logger.log('Getting available specialties');

    const specialties = await this.veterinarianRepository
      .createQueryBuilder('veterinarian')
      .select('DISTINCT veterinarian.specialization', 'specialization')
      .where('veterinarian.specialization IS NOT NULL')
      .andWhere('veterinarian.specialization != \'\'')
      .getRawMany();

    return specialties.map(s => s.specialization).filter(Boolean);
  }

  /**
   * Obtener horarios del veterinario autenticado
   */
  async getMySchedule(userId: number, filters: { date?: string } = {}): Promise<any> {
    this.logger.log(`Getting my schedule for user ID: ${userId} with filters: ${JSON.stringify(filters)}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario para usuario ${userId} no encontrado`);
    }

    // Retornar horarios simulados
    // En una implementación real, tendrías una entidad Schedule relacionada
    return {
      availabilityHours: veterinarian.availabilityHours || {},
      schedule: [],
      blockedDates: []
    };
  }

  /**
   * Actualizar horarios del veterinario autenticado
   */
  async updateMySchedule(userId: number, scheduleData: any): Promise<any> {
    this.logger.log(`Updating my schedule for user ID: ${userId}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario para usuario ${userId} no encontrado`);
    }

    // Actualizar horarios básicos
    if (scheduleData.availabilityHours) {
      veterinarian.availabilityHours = scheduleData.availabilityHours;
      await this.veterinarianRepository.save(veterinarian);
    }

    return {
      message: 'Horarios actualizados exitosamente',
      availabilityHours: veterinarian.availabilityHours
    };
  }

  /**
   * Obtener horarios de un veterinario específico por veterinarian ID
   */
  async getVeterinarianSchedule(veterinarianId: number, filters: { date?: string } = {}): Promise<any> {
    this.logger.log(`Getting schedule for veterinarian ID: ${veterinarianId} with filters: ${JSON.stringify(filters)}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { id: veterinarianId },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario con ID ${veterinarianId} no encontrado`);
    }

    // Retornar horarios simulados
    // En una implementación real, tendrías una entidad Schedule relacionada
    return {
      availabilityHours: veterinarian.availabilityHours || {},
      schedule: [],
      blockedDates: []
    };
  }
}