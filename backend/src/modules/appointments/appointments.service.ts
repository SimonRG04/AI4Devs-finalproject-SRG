import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Between, Not } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Veterinarian } from '../users/entities/veterinarian.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';
import { 
  AvailabilityQueryDto, 
  VeterinarianAvailabilityDto, 
  AvailabilitySlotDto 
} from './dto/availability.dto';
import { UserRole } from '../users/entities/user.entity';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(Veterinarian)
    private readonly veterinarianRepository: Repository<Veterinarian>,
  ) {}

  /**
   * Crear una nueva cita
   */
  async create(
    createAppointmentDto: CreateAppointmentDto,
    currentUser: any,
  ): Promise<Appointment> {
    this.logger.log(`Creating appointment for pet ${createAppointmentDto.petId}`);

    const appointmentDateTime = new Date(createAppointmentDto.dateTime);

    // Validaciones previas
    await this.validateAppointmentCreation(createAppointmentDto, currentUser, appointmentDateTime);

    try {
      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        dateTime: appointmentDateTime,
      });

      const savedAppointment = await this.appointmentRepository.save(appointment);
      this.logger.log(`Appointment created successfully with ID: ${savedAppointment.id}`);
      
      return this.findOne(savedAppointment.id, currentUser);
    } catch (error) {
      this.logger.error(`Error creating appointment: ${error.message}`, error.stack);
      throw new BadRequestException('Error al crear la cita');
    }
  }

  /**
   * Obtener citas con filtros y paginación
   */
  async findAll(
    query: AppointmentsQueryDto,
    currentUser: any,
  ): Promise<PaginatedResponse<Appointment>> {
    this.logger.log(`Finding appointments with query: ${JSON.stringify(query)}`);

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
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

    const appointments = await queryBuilder.getMany();

    return {
      data: appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener una cita por ID
   */
  async findOne(id: number, currentUser: any): Promise<Appointment> {
    this.logger.log(`Finding appointment with ID: ${id}`);

    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: [
        'pet',
        'pet.client',
        'pet.client.user',
        'veterinarian',
        'veterinarian.user',
        'medicalRecords',
        'aiDiagnoses',
      ],
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Validar acceso a la cita
    await this.validateAppointmentAccess(appointment, currentUser);

    return appointment;
  }

  /**
   * Actualizar una cita
   */
  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    currentUser: any,
  ): Promise<Appointment> {
    this.logger.log(`Updating appointment with ID: ${id}`);

    const appointment = await this.findOne(id, currentUser);

    // Validar que solo ciertos estados pueden ser actualizados
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('No se puede modificar una cita completada');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('No se puede modificar una cita cancelada');
    }

    // Si se está cambiando la fecha/hora, validar disponibilidad
    if (updateAppointmentDto.dateTime) {
      const newDateTime = new Date(updateAppointmentDto.dateTime);
      await this.validateDateTimeUpdate(appointment, newDateTime);
    }

    try {
      const updateData = {
        ...updateAppointmentDto,
        dateTime: updateAppointmentDto.dateTime 
          ? new Date(updateAppointmentDto.dateTime) 
          : appointment.dateTime,
      };

      await this.appointmentRepository.update(id, updateData);
      
      const updatedAppointment = await this.findOne(id, currentUser);
      this.logger.log(`Appointment updated successfully with ID: ${id}`);
      
      return updatedAppointment;
    } catch (error) {
      this.logger.error(`Error updating appointment: ${error.message}`, error.stack);
      throw new BadRequestException('Error al actualizar la cita');
    }
  }

  /**
   * Cancelar una cita
   */
  async cancel(id: number, currentUser: any): Promise<Appointment> {
    this.logger.log(`Cancelling appointment with ID: ${id}`);

    const appointment = await this.findOne(id, currentUser);

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('No se puede cancelar una cita completada');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('La cita ya está cancelada');
    }

    // Validar que se puede cancelar (ej: con al menos 2 horas de anticipación)
    const now = new Date();
    const appointmentTime = new Date(appointment.dateTime);
    const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 2 && currentUser.role !== UserRole.ADMIN) {
      throw new BadRequestException(
        'Las citas solo pueden cancelarse con al menos 2 horas de anticipación'
      );
    }

    await this.appointmentRepository.update(id, { 
      status: AppointmentStatus.CANCELLED 
    });

    return this.findOne(id, currentUser);
  }

  /**
   * Confirmar una cita
   */
  async confirm(id: number, currentUser: any): Promise<Appointment> {
    this.logger.log(`Confirming appointment with ID: ${id}`);

    const appointment = await this.findOne(id, currentUser);

    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new BadRequestException('Solo se pueden confirmar citas programadas');
    }

    await this.appointmentRepository.update(id, { 
      status: AppointmentStatus.CONFIRMED 
    });

    return this.findOne(id, currentUser);
  }

  /**
   * Completar una cita
   */
  async complete(id: number, currentUser: any): Promise<Appointment> {
    this.logger.log(`Completing appointment with ID: ${id}`);

    const appointment = await this.findOne(id, currentUser);

    // Solo veterinarios y administradores pueden completar citas
    if (currentUser.role === UserRole.CLIENT) {
      throw new ForbiddenException('Solo los veterinarios pueden completar citas');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('No se puede completar una cita cancelada');
    }

    await this.appointmentRepository.update(id, { 
      status: AppointmentStatus.COMPLETED 
    });

    return this.findOne(id, currentUser);
  }

  /**
   * Obtener disponibilidad de veterinarios
   */
  async getVeterinarianAvailability(
    veterinarianId: number,
    query: AvailabilityQueryDto,
  ): Promise<VeterinarianAvailabilityDto> {
    this.logger.log(`Getting availability for vet ${veterinarianId} on ${query.date}`);

    const veterinarian = await this.veterinarianRepository.findOne({
      where: { id: veterinarianId },
      relations: ['user'],
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario con ID ${veterinarianId} no encontrado`);
    }

    const date = new Date(query.date);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    // Obtener citas existentes para ese día
    const existingAppointments = await this.appointmentRepository.find({
      where: {
        veterinarianId,
        dateTime: Between(startOfDay, endOfDay),
        status: Not(['CANCELLED', 'MISSED'] as any),
      },
    });

    // Generar slots de disponibilidad
    const slots = this.generateAvailabilitySlots(
      date,
      existingAppointments,
      query.duration || 30
    );

    const availableSlots = slots.filter(slot => slot.available);

    return {
      veterinarianId,
      name: `${veterinarian.user.firstName} ${veterinarian.user.lastName}`,
      specialty: (veterinarian as any).specialty || 'Medicina General',
      date: query.date,
      slots,
      totalAvailableSlots: availableSlots.length,
    };
  }

  /**
   * Obtener disponibilidad de todos los veterinarios
   */
  async getAllVeterinariansAvailability(
    query: AvailabilityQueryDto,
  ): Promise<VeterinarianAvailabilityDto[]> {
    this.logger.log(`Getting availability for all vets on ${query.date}`);

    const veterinarians = await this.veterinarianRepository.find({
      relations: ['user'],
    });

    const availabilityPromises = veterinarians.map(vet =>
      this.getVeterinarianAvailability(vet.id, query)
    );

    return Promise.all(availabilityPromises);
  }

  /**
   * Validaciones para crear cita
   */
  private async validateAppointmentCreation(
    dto: CreateAppointmentDto,
    currentUser: any,
    dateTime: Date,
  ): Promise<void> {
    // Validar que la fecha no sea pasada
    if (dateTime <= new Date()) {
      throw new BadRequestException('La fecha de la cita debe ser futura');
    }

    // Validar horario de trabajo (8:00 AM - 6:00 PM)
    const hour = dateTime.getHours();
    if (hour < 8 || hour >= 18) {
      throw new BadRequestException('Las citas solo se pueden programar entre 8:00 AM y 6:00 PM');
    }

    // Validar que no sea domingo
    if (dateTime.getDay() === 0) {
      throw new BadRequestException('No se pueden programar citas los domingos');
    }

    // Validar que la mascota existe y el usuario tiene acceso
    const pet = await this.petRepository.findOne({
      where: { id: dto.petId },
      relations: ['client', 'client.user'],
    });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${dto.petId} no encontrada`);
    }

    if (currentUser.role === UserRole.CLIENT && pet.clientId !== currentUser.clientId) {
      throw new ForbiddenException('No tienes acceso a esta mascota');
    }

    // Validar que el veterinario existe
    const veterinarian = await this.veterinarianRepository.findOne({
      where: { id: dto.veterinarianId },
    });

    if (!veterinarian) {
      throw new NotFoundException(`Veterinario con ID ${dto.veterinarianId} no encontrado`);
    }

    // Validar conflictos de horario
    await this.validateTimeSlotAvailability(dto.veterinarianId, dateTime, dto.durationMinutes || 30);
  }

  /**
   * Validar disponibilidad de slot de tiempo
   */
  private async validateTimeSlotAvailability(
    veterinarianId: number,
    dateTime: Date,
    duration: number,
  ): Promise<void> {
    const endTime = new Date(dateTime.getTime() + duration * 60000);
    
    const conflictingAppointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.veterinarianId = :veterinarianId', { veterinarianId })
      .andWhere('appointment.status NOT IN (:...statuses)', { 
        statuses: [AppointmentStatus.CANCELLED, AppointmentStatus.MISSED] 
      })
      .andWhere(
        '(appointment.dateTime <= :startTime AND appointment.dateTime + INTERVAL appointment.durationMinutes MINUTE > :startTime) OR ' +
        '(appointment.dateTime < :endTime AND appointment.dateTime + INTERVAL appointment.durationMinutes MINUTE >= :endTime) OR ' +
        '(appointment.dateTime >= :startTime AND appointment.dateTime < :endTime)',
        { startTime: dateTime, endTime }
      )
      .getOne();

    if (conflictingAppointment) {
      throw new ConflictException('El veterinario ya tiene una cita programada en ese horario');
    }
  }

  /**
   * Generar slots de disponibilidad
   */
  private generateAvailabilitySlots(
    date: Date,
    existingAppointments: Appointment[],
    duration: number,
  ): AvailabilitySlotDto[] {
    const slots: AvailabilitySlotDto[] = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM
    const slotDuration = duration; // minutos

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

        // Verificar si hay conflicto con citas existentes
        const hasConflict = existingAppointments.some(appointment => {
          const appointmentStart = new Date(appointment.dateTime);
          const appointmentEnd = new Date(appointmentStart.getTime() + appointment.durationMinutes * 60000);
          
          return (
            (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
            (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
            (slotStart <= appointmentStart && slotEnd >= appointmentEnd)
          );
        });

        slots.push({
          startTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          endTime: `${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`,
          dateTime: slotStart.toISOString(),
          available: !hasConflict,
          reason: hasConflict ? 'Cita ya programada' : undefined,
        });
      }
    }

    return slots;
  }

  /**
   * Aplicar filtros de acceso según el rol del usuario
   */
  private applyAccessFilters(
    queryBuilder: SelectQueryBuilder<Appointment>,
    currentUser: any,
  ): void {
    if (currentUser.role === UserRole.CLIENT) {
      // Los clientes solo ven citas de sus mascotas
      queryBuilder.andWhere('pet.clientId = :clientId', { 
        clientId: currentUser.clientId 
      });
    } else if (currentUser.role === UserRole.VET) {
      // Los veterinarios ven sus propias citas
      queryBuilder.andWhere('vetUser.id = :userId', { 
        userId: currentUser.sub 
      });
    }
    // Los administradores pueden ver todas las citas
  }

  /**
   * Aplicar filtros de búsqueda
   */
  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<Appointment>,
    query: AppointmentsQueryDto,
  ): void {
    if (query.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: query.status });
    }

    if (query.petId) {
      queryBuilder.andWhere('appointment.petId = :petId', { petId: query.petId });
    }

    if (query.veterinarianId) {
      queryBuilder.andWhere('appointment.veterinarianId = :veterinarianId', { 
        veterinarianId: query.veterinarianId 
      });
    }

    if (query.dateFrom || query.dateTo) {
      if (query.dateFrom && query.dateTo) {
        queryBuilder.andWhere('DATE(appointment.dateTime) BETWEEN :dateFrom AND :dateTo', {
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
        });
      } else if (query.dateFrom) {
        queryBuilder.andWhere('DATE(appointment.dateTime) >= :dateFrom', {
          dateFrom: query.dateFrom,
        });
      } else if (query.dateTo) {
        queryBuilder.andWhere('DATE(appointment.dateTime) <= :dateTo', {
          dateTo: query.dateTo,
        });
      }
    }

    if (query.date) {
      queryBuilder.andWhere('DATE(appointment.dateTime) = :date', { date: query.date });
    }

    if (query.upcoming) {
      queryBuilder.andWhere('appointment.dateTime > :now', { now: new Date() });
    }

    if (query.past) {
      queryBuilder.andWhere('appointment.dateTime < :now', { now: new Date() });
    }
  }

  /**
   * Aplicar ordenamiento
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<Appointment>,
    query: AppointmentsQueryDto,
  ): void {
    const { sortBy, sortOrder } = query;
    
    const allowedSortFields = ['dateTime', 'status', 'createdAt', 'updatedAt'];
    const field = allowedSortFields.includes(sortBy) ? sortBy : 'dateTime';
    
    queryBuilder.orderBy(`appointment.${field}`, sortOrder);
  }

  /**
   * Validar acceso a una cita específica
   */
  private async validateAppointmentAccess(appointment: Appointment, currentUser: any): Promise<void> {
    if (currentUser.role === UserRole.CLIENT) {
      // Verificar que el cliente solo acceda a citas de sus mascotas
      if (appointment.pet?.clientId !== currentUser.clientId) {
        throw new ForbiddenException('No tienes acceso a esta cita');
      }
    } else if (currentUser.role === UserRole.VET) {
      // Verificar que el veterinario solo acceda a sus propias citas
      if (appointment.veterinarian?.user?.id !== currentUser.sub) {
        throw new ForbiddenException('No tienes acceso a esta cita');
      }
    }
  }

  /**
   * Validar actualización de fecha/hora
   */
  private async validateDateTimeUpdate(
    appointment: Appointment,
    newDateTime: Date,
  ): Promise<void> {
    if (newDateTime <= new Date()) {
      throw new BadRequestException('La nueva fecha debe ser futura');
    }

    // Validar disponibilidad del nuevo slot (excluyendo la cita actual)
    await this.validateTimeSlotAvailability(
      appointment.veterinarianId,
      newDateTime,
      appointment.durationMinutes,
    );
  }
} 