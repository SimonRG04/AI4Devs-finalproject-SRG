import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Veterinarian } from '../users/entities/veterinarian.entity';
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
} 