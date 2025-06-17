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
import { Appointment, AppointmentStatus, AppointmentType, AppointmentPriority } from '../appointments/entities/appointment.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Veterinarian } from '../users/entities/veterinarian.entity';
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
    @InjectRepository(Veterinarian)
    private readonly veterinarianRepository: Repository<Veterinarian>,
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
    let isAutomaticAppointment = false;

    // Si no se proporciona appointmentId pero sí petId, crear una cita automática
    if (!appointmentId && createMedicalRecordDto.petId) {
      this.logger.log(`Creating medical record for pet ${createMedicalRecordDto.petId} without specific appointment`);
      
      // Validar acceso a la mascota
      await this.validatePetAccess(createMedicalRecordDto.petId, currentUser);
      
      // Buscar la cita más reciente (completada o en progreso)
      let recentAppointment = await this.appointmentRepository.findOne({
        where: { 
          petId: createMedicalRecordDto.petId,
          status: AppointmentStatus.COMPLETED
        },
        order: { scheduledAt: 'DESC' }
      });

      // Si no hay cita completada, buscar cualquier cita reciente
      if (!recentAppointment) {
        recentAppointment = await this.appointmentRepository.findOne({
          where: { 
            petId: createMedicalRecordDto.petId,
            status: AppointmentStatus.IN_PROGRESS
          },
          order: { scheduledAt: 'DESC' }
        });
      }

      // Si aún no hay cita, crear una cita automática para este registro
      if (!recentAppointment) {
        this.logger.log(`Creating automatic appointment for pet ${createMedicalRecordDto.petId}`);
        
        // Obtener el veterinario actual
        let veterinarianId: number;
        if (currentUser.role === 'VET') {
          // Buscar el veterinarianId del usuario actual
          const veterinarian = await this.veterinarianRepository.findOne({
            where: { user: { id: currentUser.id || currentUser.sub } }
          });
          veterinarianId = veterinarian?.id;
        }

        if (!veterinarianId) {
          throw new BadRequestException('No se pudo determinar el veterinario para crear la cita automática');
        }

        // Crear cita automática
        const automaticAppointment = this.appointmentRepository.create({
          petId: createMedicalRecordDto.petId,
          veterinarianId: veterinarianId,
          scheduledAt: new Date(),
          type: AppointmentType.CONSULTATION,
          status: AppointmentStatus.COMPLETED,
          priority: AppointmentPriority.NORMAL,
          duration: 30,
          notes: 'Cita creada automáticamente para registro médico'
        });

        const savedAppointment = await this.appointmentRepository.save(automaticAppointment);
        appointmentId = savedAppointment.id;
        isAutomaticAppointment = true;
        this.logger.log(`Created automatic appointment with ID: ${appointmentId}`);
      } else {
        appointmentId = recentAppointment.id;
        this.logger.log(`Using existing appointment ID: ${appointmentId}`);
      }
    } else if (!appointmentId) {
      throw new BadRequestException('Debe proporcionar appointmentId o petId');
    }

    this.logger.log(`Creating medical record for appointment ${appointmentId}`);

    // Validar que la cita existe y el usuario tiene acceso
    // (Solo validar si la cita no fue creada automáticamente)
    if (!isAutomaticAppointment) {
      await this.validateAppointmentAccess(appointmentId, currentUser);
    }

    // Verificar si ya existe un registro médico para esta cita
    const existingRecord = await this.medicalRecordRepository.findOne({
      where: { appointmentId },
    });

    if (existingRecord) {
      this.logger.log(`Medical record already exists for appointment ${appointmentId}, updating instead of creating`);
      // Si ya existe, actualizar el registro existente con los nuevos datos
      return this.updateOrMerge(existingRecord.id, createMedicalRecordDto, currentUser);
    }

    // Usar transacción para crear registro médico y prescripciones
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear el registro médico
      const { prescriptions, petId, requiresFollowUp, ...recordData } = createMedicalRecordDto;
      
      // Filtrar solo campos que existen en la entidad MedicalRecord
      const validFields = [
        'title', 'diagnosis', 'treatment', 'notes', 'symptoms', 
        'temperature', 'weight', 'followUpDate', 'nextVisitRecommendations'
      ];
      
      const filteredData = Object.keys(recordData)
        .filter(key => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = recordData[key];
          return obj;
        }, {});
      
      // Obtener petId de la cita si no se proporcionó directamente
      let petIdForRecord = petId;
      if (!petIdForRecord && appointmentId) {
        const result = await queryRunner.manager.query('SELECT pet_id FROM appointments WHERE id = $1', [appointmentId]);
        petIdForRecord = result[0]?.pet_id;
      }
      
      // Convertir fechas string a Date
      const medicalRecordData: any = {
        ...filteredData,
        appointmentId,
        petId: petIdForRecord,
      };
      
      // Manejar followUpDate por separado si existe
      if (filteredData['followUpDate']) {
        medicalRecordData.followUpDate = new Date(filteredData['followUpDate']);
      }
      
      // Crear y guardar el registro médico
      const medicalRecord = this.medicalRecordRepository.create(medicalRecordData);
      const savedRecord = await queryRunner.manager.save(medicalRecord);
      
      // TypeScript fix: savedRecord podría ser array, obtenemos el primer elemento
      const recordId = Array.isArray(savedRecord) ? savedRecord[0]?.id : (savedRecord as any).id;
      this.logger.log(`Medical record created with ID: ${recordId}`);

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
            medicalRecordId: recordId,
            duration: prescriptionDto.durationDays || 7, // Default a 7 días si no se especifica
          });

          await queryRunner.manager.save(prescription);
        }
        this.logger.log(`Created ${prescriptions.length} prescriptions for medical record ${recordId}`);
      }

      await queryRunner.commitTransaction();
      
      return this.findOne(recordId, currentUser);
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

    // Los veterinarios pueden actualizar cualquier registro médico
    // Esto es necesario para colaboración médica, guardias, emergencias y seguimientos

    try {
      // Separar relaciones y campos calculados de los datos de actualización
      const { 
        prescriptions, 
        petId, 
        requiresFollowUp, // Campo calculado, no debe ir a BD
        ...recordData 
      } = updateMedicalRecordDto;
      
      // Filtrar solo campos que existen en la entidad MedicalRecord
      const validFields = [
        'title', 'diagnosis', 'treatment', 'notes', 'symptoms', 
        'temperature', 'weight', 'followUpDate', 'nextVisitRecommendations'
      ];
      
      const filteredData = Object.keys(recordData)
        .filter(key => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = recordData[key];
          return obj;
        }, {} as any);

      const updateData = {
        ...filteredData,
        followUpDate: updateMedicalRecordDto.followUpDate 
          ? new Date(updateMedicalRecordDto.followUpDate) 
          : undefined,
      };

      this.logger.log(`Updating medical record ${id} with filtered data:`, Object.keys(updateData));
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
   * Actualizar o fusionar un registro médico con datos de creación
   */
  private async updateOrMerge(
    id: number,
    createMedicalRecordDto: CreateMedicalRecordDto,
    currentUser: any,
  ): Promise<MedicalRecordResponseDto> {
    const userId = currentUser.sub || currentUser.id || 'unknown';
    this.logger.log(`Updating/merging medical record with ID: ${id} by user: ${userId}`);

    const existingRecord = await this.findOne(id, currentUser);

    // Solo veterinarios y administradores pueden actualizar registros médicos
    if (currentUser.role === UserRole.CLIENT) {
      throw new ForbiddenException('Solo los veterinarios pueden actualizar registros médicos');
    }

    // Usar transacción para actualizar registro médico y manejar prescripciones
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Separar prescripciones y campos no válidos de los datos del registro
      const { 
        prescriptions, 
        petId, 
        appointmentId, 
        requiresFollowUp, // Campo calculado, no debe ir a BD
        ...recordData 
      } = createMedicalRecordDto;
      
      // Filtrar solo campos que existen en la entidad MedicalRecord
      const validFields = [
        'title', 'diagnosis', 'treatment', 'notes', 'symptoms', 
        'temperature', 'weight', 'followUpDate', 'nextVisitRecommendations'
      ];
      
      const filteredData = Object.keys(recordData)
        .filter(key => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = recordData[key];
          return obj;
        }, {});
      
      // Actualizar el registro médico (fusionar datos existentes con nuevos)
      const updateData: any = {
        ...filteredData,
      };
      
      // Manejar followUpDate por separado si existe
      if (filteredData['followUpDate']) {
        updateData.followUpDate = new Date(filteredData['followUpDate']);
      }

      this.logger.log(`Updating medical record ${id} with data:`, Object.keys(updateData));
      await queryRunner.manager.update('medical_records', id, updateData);

      // Manejar prescripciones si se proporcionaron
      if (prescriptions && prescriptions.length > 0) {
        this.logger.log(`Adding ${prescriptions.length} prescriptions to existing medical record ${id}`);
        
        for (const prescriptionDto of prescriptions) {
          // Procesar medicationName si se proporciona en lugar de medication
          const medication = prescriptionDto.medication || prescriptionDto.medicationName;
          if (!medication) {
            throw new BadRequestException('Debe proporcionar medication o medicationName en las prescripciones');
          }

          const prescription = this.prescriptionRepository.create({
            ...prescriptionDto,
            medication,
            medicalRecordId: id,
            duration: prescriptionDto.durationDays || 7, // Default a 7 días si no se especifica
          });

          await queryRunner.manager.save(prescription);
        }
      }

      await queryRunner.commitTransaction();
      
      // Retornar el registro actualizado
      const updatedRecord = await this.findOne(id, currentUser);
      this.logger.log(`Medical record updated/merged successfully with ID: ${id}`);
      
      return updatedRecord;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error updating/merging medical record: ${error.message}`, error.stack);
      throw new BadRequestException('Error al actualizar el registro médico');
    } finally {
      await queryRunner.release();
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
      // Verificar acceso del cliente
      if (appointment.pet?.client?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('No tienes acceso a esta cita');
      }
    } else if (currentUser.role === UserRole.VET) {
      // Para veterinarios, verificar si es su cita
      const isVetAppointment = appointment.veterinarian?.user?.id === currentUser.sub || 
                              appointment.veterinarian?.user?.id === currentUser.id;
      
      if (!isVetAppointment) {
        // Obtener el veterinario actual para verificaciones adicionales
        const currentVet = await this.veterinarianRepository.findOne({
          where: { user: { id: currentUser.id || currentUser.sub } }
        });
        
        // Si el veterinario actual es el mismo que está asignado a la cita, permitir
        if (currentVet && appointment.veterinarianId === currentVet.id) {
          this.logger.log(`Veterinarian ${currentUser.sub} has access to appointment ${appointmentId}`);
          return;
        }
        
        this.logger.warn(`Veterinarian ${currentUser.sub} denied access to appointment ${appointmentId}`);
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
      // Los veterinarios tienen acceso amplio a todos los registros médicos
      // Esto es necesario para consultas, guardias, seguimientos, etc.
      const userId = currentUser.sub || currentUser.id || 'unknown';
      this.logger.log(`Veterinarian ${userId} accessing medical record ${medicalRecord.id}`);
      return;
    }
    // Los administradores tienen acceso completo (sin restricciones)
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
    
    // Los veterinarios tienen acceso a todas las mascotas para crear registros médicos
    // Los administradores tienen acceso completo
    if (currentUser.role === UserRole.VET || currentUser.role === UserRole.ADMIN) {
      this.logger.log(`${currentUser.role} ${currentUser.sub} accessing pet ${petId}`);
      return;
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
      // Los veterinarios tienen acceso amplio a todos los registros médicos
      // Esto es necesario para consultas, guardias, seguimientos, etc.
      this.logger.log(`VET user ${currentUser.sub} has broad access to medical records`);
      // No aplicar filtros restrictivos para veterinarios
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