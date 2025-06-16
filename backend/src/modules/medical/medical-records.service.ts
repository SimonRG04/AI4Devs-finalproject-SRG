import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, DataSource } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { Prescription } from './entities/prescription.entity';
import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { Pet } from '../pets/entities/pet.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordsQueryDto } from './dto/medical-records-query.dto';
import { UserRole } from '../users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { MedicalRecordResponseDto } from './dto/medical-record-response.dto';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class MedicalRecordsService {
  private readonly logger = new Logger(MedicalRecordsService.name);

  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crear un nuevo registro médico con prescripciones
   */
  async create(
    createMedicalRecordDto: CreateMedicalRecordDto,
    currentUser: any,
  ): Promise<MedicalRecordResponseDto> {
    let appointmentId = createMedicalRecordDto.appointmentId;

    // Si no se proporciona appointmentId pero sí petId, buscar o crear una cita
    if (!appointmentId && createMedicalRecordDto.petId) {
      this.logger.log(`Creating medical record for pet ${createMedicalRecordDto.petId}`);
      
      // Validar acceso a la mascota
      await this.validatePetAccess(createMedicalRecordDto.petId, currentUser);
      
      // Para el caso de petId, podemos crear un registro médico sin cita específica
      // o buscar la cita más reciente de la mascota
      const recentAppointment = await this.appointmentRepository.findOne({
        where: { 
          petId: createMedicalRecordDto.petId,
          status: AppointmentStatus.COMPLETED // Solo citas completadas
        },
        order: { scheduledAt: 'DESC' }
      });

      if (recentAppointment) {
        appointmentId = recentAppointment.id;
      } else {
        throw new BadRequestException('No se encontró una cita completada para esta mascota. Debe especificar un appointmentId.');
      }
    } else if (!appointmentId) {
      throw new BadRequestException('Debe proporcionar appointmentId o petId');
    }

    this.logger.log(`Creating medical record for appointment ${appointmentId}`);

    // Validar que la cita existe y el usuario tiene acceso
    await this.validateAppointmentAccess(appointmentId, currentUser);

    // Verificar que no exista ya un registro médico para esta cita
    const existingRecord = await this.medicalRecordRepository.findOne({
      where: { appointmentId },
    });

    if (existingRecord) {
      throw new BadRequestException('Ya existe un registro médico para esta cita');
    }

    // Usar transacción para crear registro médico y prescripciones
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear el registro médico
      const { prescriptions, petId, ...recordData } = createMedicalRecordDto;
      
      // Convertir fechas string a Date
      const medicalRecord = this.medicalRecordRepository.create({
        ...recordData,
        appointmentId,
        followUpDate: recordData.followUpDate ? new Date(recordData.followUpDate) : undefined,
      });

      const savedRecord = await queryRunner.manager.save(medicalRecord);
      this.logger.log(`Medical record created with ID: ${savedRecord.id}`);

      // Crear prescripciones si se proporcionaron
      if (prescriptions && prescriptions.length > 0) {
        for (const prescriptionDto of prescriptions) {
          // Procesar medicationName si se proporciona en lugar de medication
          const medication = prescriptionDto.medication || prescriptionDto.medicationName;
          if (!medication) {
            throw new BadRequestException('Debe proporcionar medication o medicationName en las prescripciones');
          }

          const prescription = this.prescriptionRepository.create({
            ...prescriptionDto,
            medication,
            medicalRecordId: savedRecord.id,
            startDate: prescriptionDto.startDate ? new Date(prescriptionDto.startDate) : new Date(),
            endDate: prescriptionDto.endDate ? new Date(prescriptionDto.endDate) : undefined,
          });

          // Calcular fecha de fin si se proporcionó duración
          if (prescriptionDto.durationDays && !prescriptionDto.endDate) {
            const startDate = prescription.startDate;
            const endDate = new Date(startDate.getTime() + prescriptionDto.durationDays * 24 * 60 * 60 * 1000);
            prescription.endDate = endDate;
          }

          await queryRunner.manager.save(prescription);
        }
        this.logger.log(`Created ${prescriptions.length} prescriptions for medical record ${savedRecord.id}`);
      }

      await queryRunner.commitTransaction();
      
      return this.findOne(savedRecord.id, currentUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error creating medical record: ${error.message}`, error.stack);
      throw new BadRequestException('Error al crear el registro médico');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtener registros médicos con filtros y paginación
   */
  async findAll(
    query: MedicalRecordsQueryDto,
    currentUser: any,
  ): Promise<PaginatedResponse<MedicalRecordResponseDto>> {
    this.logger.log(`Finding medical records with query: ${JSON.stringify(query)}`);

    const queryBuilder = this.medicalRecordRepository
      .createQueryBuilder('medicalRecord')
      .leftJoinAndSelect('medicalRecord.appointment', 'appointment')
      .leftJoinAndSelect('appointment.pet', 'pet')
      .leftJoinAndSelect('pet.client', 'client')
      .leftJoinAndSelect('client.user', 'clientUser')
      .leftJoinAndSelect('appointment.veterinarian', 'veterinarian')
      .leftJoinAndSelect('veterinarian.user', 'vetUser');

    // Incluir prescripciones si se solicita (temporalmente deshabilitado por error de columna)
    if (query.includePrescriptions && false) { // Temporal fix
      queryBuilder.leftJoinAndSelect('medicalRecord.prescriptions', 'prescriptions');
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

    const medicalRecords = await queryBuilder.getMany();

    // Transformar a DTOs de respuesta
    const data = medicalRecords.map(record => 
      plainToClass(MedicalRecordResponseDto, record, { 
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
  }

  /**
   * Obtener un registro médico por ID
   */
  async findOne(id: number, currentUser: any): Promise<MedicalRecordResponseDto> {
    this.logger.log(`Finding medical record with ID: ${id}`);

    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: { id },
      relations: [
        'appointment',
        'appointment.pet',
        'appointment.pet.client',
        'appointment.pet.client.user',
        'appointment.veterinarian',
        'appointment.veterinarian.user',
        'prescriptions',
        'attachments',
      ],
    });

    if (!medicalRecord) {
      throw new NotFoundException(`Registro médico con ID ${id} no encontrado`);
    }

    // Validar acceso al registro médico
    await this.validateMedicalRecordAccess(medicalRecord, currentUser);

    return plainToClass(MedicalRecordResponseDto, medicalRecord, { 
      excludeExtraneousValues: true 
    });
  }

  /**
   * Actualizar un registro médico
   */
  async update(
    id: number,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
    currentUser: any,
  ): Promise<MedicalRecordResponseDto> {
    this.logger.log(`Updating medical record with ID: ${id}`);

    const medicalRecord = await this.findOne(id, currentUser);

    // Solo veterinarios y administradores pueden actualizar registros médicos
    if (currentUser.role === UserRole.CLIENT) {
      throw new ForbiddenException('Solo los veterinarios pueden actualizar registros médicos');
    }

    // Si el usuario es veterinario, validar que sea el mismo que creó el registro
    if (currentUser.role === UserRole.VET) {
      const originalRecord = await this.medicalRecordRepository.findOne({
        where: { id },
        relations: ['appointment', 'appointment.veterinarian', 'appointment.veterinarian.user'],
      });

      if (originalRecord?.appointment?.veterinarian?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('Solo puedes actualizar tus propios registros médicos');
      }
    }

    try {
      const updateData = {
        ...updateMedicalRecordDto,
        followUpDate: updateMedicalRecordDto.followUpDate 
          ? new Date(updateMedicalRecordDto.followUpDate) 
          : undefined,
      };

      await this.medicalRecordRepository.update(id, updateData);
      
      const updatedRecord = await this.findOne(id, currentUser);
      this.logger.log(`Medical record updated successfully with ID: ${id}`);
      
      return updatedRecord;
    } catch (error) {
      this.logger.error(`Error updating medical record: ${error.message}`, error.stack);
      throw new BadRequestException('Error al actualizar el registro médico');
    }
  }

  /**
   * Eliminar un registro médico
   */
  async remove(id: number, currentUser: any): Promise<void> {
    this.logger.log(`Removing medical record with ID: ${id}`);

    const medicalRecord = await this.findOne(id, currentUser);

    // Solo administradores pueden eliminar registros médicos
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden eliminar registros médicos');
    }

    try {
      await this.medicalRecordRepository.remove(medicalRecord as any);
      this.logger.log(`Medical record removed successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error removing medical record: ${error.message}`, error.stack);
      throw new BadRequestException('Error al eliminar el registro médico');
    }
  }

  /**
   * Obtener registros médicos por mascota
   */
  async findByPet(
    petId: number,
    query: MedicalRecordsQueryDto,
    currentUser: any,
  ): Promise<PaginatedResponse<MedicalRecordResponseDto>> {
    this.logger.log(`Finding medical records for pet ${petId}`);

    // Validar acceso a la mascota
    await this.validatePetAccess(petId, currentUser);

    // Agregar filtro por mascota a la query
    const petQuery = { ...query, petId };
    return this.findAll(petQuery, currentUser);
  }

  /**
   * Validar acceso a una cita
   */
  private async validateAppointmentAccess(appointmentId: number, currentUser: any): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['pet', 'pet.client', 'pet.client.user', 'veterinarian', 'veterinarian.user'],
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${appointmentId} no encontrada`);
    }

    if (currentUser.role === UserRole.CLIENT) {
      if (appointment.pet?.client?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('No tienes acceso a esta cita');
      }
    } else if (currentUser.role === UserRole.VET) {
      if (appointment.veterinarian?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('No tienes acceso a esta cita');
      }
    }
  }

  /**
   * Validar acceso a un registro médico
   */
  private async validateMedicalRecordAccess(medicalRecord: any, currentUser: any): Promise<void> {
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
   * Validar acceso a una mascota
   */
  private async validatePetAccess(petId: number, currentUser: any): Promise<void> {
    const pet = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['client', 'client.user'],
    });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
    }

    if (currentUser.role === UserRole.CLIENT && pet.clientId !== currentUser.clientId) {
      throw new ForbiddenException('No tienes acceso a esta mascota');
    }
  }

  /**
   * Aplicar filtros de acceso según el rol del usuario
   */
  private applyAccessFilters(
    queryBuilder: SelectQueryBuilder<MedicalRecord>,
    currentUser: any,
  ): void {
    if (currentUser.role === UserRole.CLIENT) {
      // Los clientes solo ven registros médicos de sus mascotas
      queryBuilder.andWhere('pet.clientId = :clientId', { 
        clientId: currentUser.clientId 
      });
    } else if (currentUser.role === UserRole.VET) {
      // Los veterinarios ven solo sus propios registros médicos
      queryBuilder.andWhere('vetUser.id = :userId', { 
        userId: currentUser.sub 
      });
    }
    // Los administradores pueden ver todos los registros médicos
  }

  /**
   * Aplicar filtros de búsqueda
   */
  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<MedicalRecord>,
    query: MedicalRecordsQueryDto,
  ): void {
    if (query.petId) {
      queryBuilder.andWhere('pet.id = :petId', { petId: query.petId });
    }

    if (query.appointmentId) {
      queryBuilder.andWhere('appointment.id = :appointmentId', { 
        appointmentId: query.appointmentId 
      });
    }

    if (query.veterinarianId) {
      queryBuilder.andWhere('veterinarian.id = :veterinarianId', { 
        veterinarianId: query.veterinarianId 
      });
    }

    if (query.diagnosisSearch) {
      queryBuilder.andWhere('LOWER(medicalRecord.diagnosis) LIKE LOWER(:diagnosisSearch)', {
        diagnosisSearch: `%${query.diagnosisSearch}%`,
      });
    }

    if (query.treatmentSearch) {
      queryBuilder.andWhere('LOWER(medicalRecord.treatment) LIKE LOWER(:treatmentSearch)', {
        treatmentSearch: `%${query.treatmentSearch}%`,
      });
    }

    if (query.dateFrom || query.dateTo) {
      if (query.dateFrom && query.dateTo) {
        queryBuilder.andWhere('DATE(medicalRecord.createdAt) BETWEEN :dateFrom AND :dateTo', {
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
        });
      } else if (query.dateFrom) {
        queryBuilder.andWhere('DATE(medicalRecord.createdAt) >= :dateFrom', {
          dateFrom: query.dateFrom,
        });
      } else if (query.dateTo) {
        queryBuilder.andWhere('DATE(medicalRecord.createdAt) <= :dateTo', {
          dateTo: query.dateTo,
        });
      }
    }

    if (query.requiresFollowUp !== undefined) {
      if (query.requiresFollowUp) {
        queryBuilder.andWhere('medicalRecord.followUpDate IS NOT NULL');
      } else {
        queryBuilder.andWhere('medicalRecord.followUpDate IS NULL');
      }
    }

    if (query.hasPendingFollowUp !== undefined && query.hasPendingFollowUp) {
      queryBuilder.andWhere('medicalRecord.followUpDate > :today', { 
        today: new Date() 
      });
    }
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<MedicalRecord>,
    query: MedicalRecordsQueryDto,
  ): void {
    const { sortBy, sortOrder } = query;
    
    const allowedSortFields = ['createdAt', 'updatedAt', 'followUpDate', 'diagnosis'];
    const field = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    
    if (field === 'appointmentDate') {
      queryBuilder.orderBy('appointment.dateTime', sortOrder);
    } else {
      queryBuilder.orderBy(`medicalRecord.${field}`, sortOrder);
    }
  }
} 