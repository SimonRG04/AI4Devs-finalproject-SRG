import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Prescription, PrescriptionStatus } from './entities/prescription.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { Pet } from '../pets/entities/pet.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrescriptionsQueryDto } from './dto/prescriptions-query.dto';
import { UserRole } from '../users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { PrescriptionResponseDto } from './dto/prescription-response.dto';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PrescriptionsService {
  private readonly logger = new Logger(PrescriptionsService.name);

  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  /**
   * Crear una nueva prescripción
   */
  async create(
    createPrescriptionDto: CreatePrescriptionDto,
    medicalRecordId: number,
    currentUser: any,
  ): Promise<PrescriptionResponseDto> {
    this.logger.log(`Creating prescription for medical record ${medicalRecordId}`);

    // Validar que el registro médico existe y el usuario tiene acceso
    await this.validateMedicalRecordAccess(medicalRecordId, currentUser);

    // Solo veterinarios y administradores pueden crear prescripciones
    if (currentUser.role === UserRole.CLIENT) {
      throw new ForbiddenException('Solo los veterinarios pueden crear prescripciones');
    }

    try {
      const prescription = this.prescriptionRepository.create({
        ...createPrescriptionDto,
        medicalRecordId,
        startDate: new Date(createPrescriptionDto.startDate),
        endDate: createPrescriptionDto.endDate ? new Date(createPrescriptionDto.endDate) : undefined,
      });

      // Calcular fecha de fin si se proporcionó duración
      if (createPrescriptionDto.durationDays && !createPrescriptionDto.endDate) {
        const startDate = new Date(createPrescriptionDto.startDate);
        const endDate = new Date(startDate.getTime() + createPrescriptionDto.durationDays * 24 * 60 * 60 * 1000);
        prescription.endDate = endDate;
      }

      const savedPrescription = await this.prescriptionRepository.save(prescription);
      this.logger.log(`Prescription created with ID: ${savedPrescription.id}`);

      return this.findOne(savedPrescription.id, currentUser);
    } catch (error) {
      this.logger.error(`Error creating prescription: ${error.message}`, error.stack);
      throw new BadRequestException('Error al crear la prescripción');
    }
  }

  /**
   * Obtener prescripciones con filtros y paginación
   */
  async findAll(
    query: PrescriptionsQueryDto,
    currentUser: any,
  ): Promise<PaginatedResponse<PrescriptionResponseDto>> {
    this.logger.log(`Finding prescriptions with query: ${JSON.stringify(query)}`);

    try {
      const queryBuilder = this.prescriptionRepository
        .createQueryBuilder('prescription')
        .leftJoinAndSelect('prescription.medicalRecord', 'medicalRecord')
        .leftJoinAndSelect('medicalRecord.appointment', 'appointment')
        .leftJoinAndSelect('appointment.pet', 'pet')
        .leftJoinAndSelect('pet.client', 'client')
        .leftJoinAndSelect('client.user', 'clientUser')
        .leftJoinAndSelect('appointment.veterinarian', 'veterinarian')
        .leftJoinAndSelect('veterinarian.user', 'vetUser');

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

      const prescriptions = await queryBuilder.getMany();

      // Transformar a DTOs de respuesta
      const data = prescriptions.map(prescription =>
        plainToClass(PrescriptionResponseDto, prescription, {
          excludeExtraneousValues: true
        })
      );

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error finding prescriptions: ${error.message}`, error.stack);
      throw new BadRequestException('Error al buscar prescripciones');
    }
  }

  /**
   * Obtener una prescripción por ID
   */
  async findOne(id: number, currentUser: any): Promise<PrescriptionResponseDto> {
    this.logger.log(`Finding prescription with ID: ${id}`);

    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: [
        'medicalRecord',
        'medicalRecord.appointment',
        'medicalRecord.appointment.pet',
        'medicalRecord.appointment.pet.client',
        'medicalRecord.appointment.pet.client.user',
        'medicalRecord.appointment.veterinarian',
        'medicalRecord.appointment.veterinarian.user',
      ],
    });

    if (!prescription) {
      throw new NotFoundException(`Prescripción con ID ${id} no encontrada`);
    }

    // Validar acceso a la prescripción
    await this.validatePrescriptionAccess(prescription, currentUser);

    return plainToClass(PrescriptionResponseDto, prescription, {
      excludeExtraneousValues: true
    });
  }

  /**
   * Actualizar una prescripción
   */
  async update(
    id: number,
    updatePrescriptionDto: UpdatePrescriptionDto,
    currentUser: any,
  ): Promise<PrescriptionResponseDto> {
    this.logger.log(`Updating prescription with ID: ${id}`);

    const prescription = await this.findOne(id, currentUser);

    // Solo veterinarios y administradores pueden actualizar prescripciones
    if (currentUser.role === UserRole.CLIENT) {
      throw new ForbiddenException('Solo los veterinarios pueden actualizar prescripciones');
    }

    // Si el usuario es veterinario, validar que sea el mismo que creó la prescripción
    if (currentUser.role === UserRole.VET) {
      const originalPrescription = await this.prescriptionRepository.findOne({
        where: { id },
        relations: [
          'medicalRecord.appointment.veterinarian.user'
        ],
      });

      if (originalPrescription?.medicalRecord?.appointment?.veterinarian?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('Solo puedes actualizar tus propias prescripciones');
      }
    }

    try {
      const updateData = {
        ...updatePrescriptionDto,
        startDate: updatePrescriptionDto.startDate 
          ? new Date(updatePrescriptionDto.startDate) 
          : undefined,
        endDate: updatePrescriptionDto.endDate 
          ? new Date(updatePrescriptionDto.endDate) 
          : undefined,
      };

      // Calcular fecha de fin si se proporcionó duración
      if (updatePrescriptionDto.durationDays && updatePrescriptionDto.startDate && !updatePrescriptionDto.endDate) {
        const startDate = new Date(updatePrescriptionDto.startDate);
        const endDate = new Date(startDate.getTime() + updatePrescriptionDto.durationDays * 24 * 60 * 60 * 1000);
        updateData.endDate = endDate;
      }

      await this.prescriptionRepository.update(id, updateData);
      
      const updatedPrescription = await this.findOne(id, currentUser);
      this.logger.log(`Prescription updated successfully with ID: ${id}`);
      
      return updatedPrescription;
    } catch (error) {
      this.logger.error(`Error updating prescription: ${error.message}`, error.stack);
      throw new BadRequestException('Error al actualizar la prescripción');
    }
  }

  /**
   * Eliminar una prescripción
   */
  async remove(id: number, currentUser: any): Promise<void> {
    this.logger.log(`Removing prescription with ID: ${id}`);

    const prescription = await this.findOne(id, currentUser);

    // Solo administradores pueden eliminar prescripciones
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden eliminar prescripciones');
    }

    try {
      await this.prescriptionRepository.remove(prescription as any);
      this.logger.log(`Prescription removed successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error removing prescription: ${error.message}`, error.stack);
      throw new BadRequestException('Error al eliminar la prescripción');
    }
  }

  /**
   * Cambiar el estado de una prescripción
   */
  async updateStatus(
    id: number,
    status: PrescriptionStatus,
    currentUser: any,
  ): Promise<PrescriptionResponseDto> {
    this.logger.log(`Updating prescription status ${id} to ${status}`);

    const prescription = await this.findOne(id, currentUser);

    // Solo veterinarios y administradores pueden cambiar estados
    if (currentUser.role === UserRole.CLIENT) {
      throw new ForbiddenException('Solo los veterinarios pueden cambiar el estado de prescripciones');
    }

    try {
      await this.prescriptionRepository.update(id, { status });
      
      const updatedPrescription = await this.findOne(id, currentUser);
      this.logger.log(`Prescription status updated successfully: ${id} -> ${status}`);
      
      return updatedPrescription;
    } catch (error) {
      this.logger.error(`Error updating prescription status: ${error.message}`, error.stack);
      throw new BadRequestException('Error al actualizar el estado de la prescripción');
    }
  }

  /**
   * Obtener prescripciones por registro médico
   */
  async findByMedicalRecord(
    medicalRecordId: number,
    query: PrescriptionsQueryDto,
    currentUser: any,
  ): Promise<PaginatedResponse<PrescriptionResponseDto>> {
    this.logger.log(`Finding prescriptions for medical record ${medicalRecordId}`);

    // Validar acceso al registro médico
    await this.validateMedicalRecordAccess(medicalRecordId, currentUser);

    // Agregar filtro por registro médico a la query
    const recordQuery = { ...query, medicalRecordId };
    return this.findAll(recordQuery, currentUser);
  }

  /**
   * Obtener prescripciones activas
   */
  async findActive(
    query: PrescriptionsQueryDto,
    currentUser: any,
  ): Promise<PaginatedResponse<PrescriptionResponseDto>> {
    this.logger.log('Finding active prescriptions');

    const activeQuery = { 
      ...query, 
      status: PrescriptionStatus.ACTIVE,
      activeOnly: true 
    };
    return this.findAll(activeQuery, currentUser);
  }

  /**
   * Obtener prescripciones que expiran pronto
   */
  async findExpiringSoon(
    days: number,
    query: PrescriptionsQueryDto,
    currentUser: any,
  ): Promise<PaginatedResponse<PrescriptionResponseDto>> {
    this.logger.log(`Finding prescriptions expiring in ${days} days`);

    const expiringQuery = { 
      ...query, 
      expiringInDays: days,
      status: PrescriptionStatus.ACTIVE 
    };
    return this.findAll(expiringQuery, currentUser);
  }

  /**
   * Validar acceso a un registro médico
   */
  private async validateMedicalRecordAccess(medicalRecordId: number, currentUser: any): Promise<void> {
    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: { id: medicalRecordId },
      relations: [
        'appointment',
        'appointment.pet',
        'appointment.pet.client',
        'appointment.pet.client.user',
        'appointment.veterinarian',
        'appointment.veterinarian.user',
      ],
    });

    if (!medicalRecord) {
      throw new NotFoundException(`Registro médico con ID ${medicalRecordId} no encontrado`);
    }

    if (currentUser.role === UserRole.CLIENT) {
      if (medicalRecord.appointment?.pet?.client?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('No tienes acceso a este registro médico');
      }
    } else if (currentUser.role === UserRole.VET) {
      if (medicalRecord.appointment?.veterinarian?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('No tienes acceso a este registro médico');
      }
    }
  }

  /**
   * Validar acceso a una prescripción
   */
  private async validatePrescriptionAccess(prescription: any, currentUser: any): Promise<void> {
    if (currentUser.role === UserRole.CLIENT) {
      if (prescription.medicalRecord?.appointment?.pet?.client?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('No tienes acceso a esta prescripción');
      }
    } else if (currentUser.role === UserRole.VET) {
      if (prescription.medicalRecord?.appointment?.veterinarian?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('No tienes acceso a esta prescripción');
      }
    }
  }

  /**
   * Aplicar filtros de acceso según el rol del usuario
   */
  private applyAccessFilters(
    queryBuilder: SelectQueryBuilder<Prescription>,
    currentUser: any,
  ): void {
    if (currentUser.role === UserRole.CLIENT) {
      // Los clientes solo ven prescripciones de sus mascotas
      queryBuilder.andWhere('pet.clientId = :clientId', { 
        clientId: currentUser.clientId 
      });
    } else if (currentUser.role === UserRole.VET) {
      // Los veterinarios ven solo sus propias prescripciones
      queryBuilder.andWhere('vetUser.id = :userId', { 
        userId: currentUser.sub 
      });
    }
    // Los administradores pueden ver todas las prescripciones
  }

  /**
   * Aplicar filtros de búsqueda
   */
  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<Prescription>,
    query: PrescriptionsQueryDto,
  ): void {
    if (query.medicalRecordId) {
      queryBuilder.andWhere('prescription.medicalRecordId = :medicalRecordId', { 
        medicalRecordId: query.medicalRecordId 
      });
    }

    if (query.petId) {
      queryBuilder.andWhere('pet.id = :petId', { petId: query.petId });
    }

    if (query.medicationSearch) {
      queryBuilder.andWhere('LOWER(prescription.medication) LIKE LOWER(:medicationSearch)', {
        medicationSearch: `%${query.medicationSearch}%`,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('prescription.status = :status', { 
        status: query.status 
      });
    }

    if (query.frequency) {
      queryBuilder.andWhere('prescription.frequency = :frequency', { 
        frequency: query.frequency 
      });
    }

    if (query.dateFrom || query.dateTo) {
      if (query.dateFrom && query.dateTo) {
        queryBuilder.andWhere('prescription.startDate::date BETWEEN :dateFrom AND :dateTo', {
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
        });
      } else if (query.dateFrom) {
        queryBuilder.andWhere('prescription.startDate::date >= :dateFrom', {
          dateFrom: query.dateFrom,
        });
      } else if (query.dateTo) {
        queryBuilder.andWhere('prescription.startDate::date <= :dateTo', {
          dateTo: query.dateTo,
        });
      }
    }

    if (query.activeOnly) {
      const today = new Date().toISOString().split('T')[0];
      queryBuilder
        .andWhere('prescription.status = :activeStatus', { 
          activeStatus: PrescriptionStatus.ACTIVE 
        })
        .andWhere('prescription.startDate <= :today', { today })
        .andWhere('(prescription.endDate IS NULL OR prescription.endDate >= :today)', { today });
    }

    if (query.expiringInDays) {
      const today = new Date();
      const futureDate = new Date(today.getTime() + query.expiringInDays * 24 * 60 * 60 * 1000);
      
      queryBuilder
        .andWhere('prescription.status = :activeStatus', { 
          activeStatus: PrescriptionStatus.ACTIVE 
        })
        .andWhere('prescription.endDate IS NOT NULL')
        .andWhere('prescription.endDate BETWEEN :today AND :futureDate', {
          today: today.toISOString().split('T')[0],
          futureDate: futureDate.toISOString().split('T')[0],
        });
    }
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<Prescription>,
    query: PrescriptionsQueryDto,
  ): void {
    const { sortBy, sortOrder } = query;
    
    const allowedSortFields = ['createdAt', 'updatedAt', 'startDate', 'endDate', 'medication', 'status'];
    const field = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    
    queryBuilder.orderBy(`prescription.${field}`, sortOrder);
  }
} 