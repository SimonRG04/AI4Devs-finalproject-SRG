import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { AIDiagnosis, DiagnosisStatus } from './entities/ai-diagnosis.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { DiagnosisResponseDto } from './dto/diagnosis-response.dto';
import { DeepSeekService, DeepSeekRequest } from './providers/deepseek.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class DiagnosisService {
  private readonly logger = new Logger(DiagnosisService.name);

  constructor(
    @InjectRepository(AIDiagnosis)
    private readonly diagnosisRepository: Repository<AIDiagnosis>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly deepSeekService: DeepSeekService,
  ) {}

  /**
   * Crear un nuevo prediagnóstico
   */
  async create(
    createDiagnosisDto: CreateDiagnosisDto,
    currentUser: any,
  ): Promise<DiagnosisResponseDto> {
    const { petId, appointmentId, symptoms, duration, severity, additionalInfo } = createDiagnosisDto;

    this.logger.log(`Creating pre-diagnosis for pet ${petId} by user ${currentUser.sub}`);

    // Validar acceso a la mascota
    const pet = await this.validatePetAccess(petId, currentUser);

    // Validar cita si se proporciona
    let appointment: Appointment | null = null;
    if (appointmentId) {
      appointment = await this.validateAppointmentAccess(appointmentId, currentUser);
    }

    try {
      // Crear registro inicial
      const diagnosis = this.diagnosisRepository.create({
        petId,
        appointmentId,
        description: symptoms,
        status: DiagnosisStatus.PROCESSING,
      });

      const savedDiagnosis = await this.diagnosisRepository.save(diagnosis);
      this.logger.log(`Initial diagnosis record created with ID: ${savedDiagnosis.id}`);

      // Generar prediagnóstico de forma asíncrona
      this.processPreDiagnosis(savedDiagnosis.id, {
        symptoms,
        petInfo: {
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          weight: pet.weight,
          gender: pet.gender,
        },
        duration,
        severity,
        additionalInfo,
      }).catch((error) => {
        this.logger.error(`Failed to process pre-diagnosis ${savedDiagnosis.id}: ${error.message}`);
      });

      // Retornar respuesta inmediata
      return this.formatResponse(savedDiagnosis, pet);

    } catch (error) {
      this.logger.error(`Error creating pre-diagnosis: ${error.message}`, error.stack);
      throw new BadRequestException('Error al crear el prediagnóstico');
    }
  }

  /**
   * Obtener un diagnóstico por ID
   */
  async findOne(id: number, currentUser: any): Promise<DiagnosisResponseDto> {
    this.logger.log(`Finding diagnosis ${id} for user ${currentUser.sub} with role ${currentUser.role} and clientId ${currentUser.clientId}`);

    const diagnosis = await this.diagnosisRepository.findOne({
      where: { id },
      relations: ['pet', 'pet.client', 'pet.client.user', 'appointment'],
    });

    if (!diagnosis) {
      throw new NotFoundException(`Diagnóstico con ID ${id} no encontrado`);
    }

    this.logger.log(`Diagnosis found: petId=${diagnosis.petId}, pet.clientId=${diagnosis.pet?.clientId}`);

    // Validar acceso
    await this.validateDiagnosisAccess(diagnosis, currentUser);

    return this.formatResponse(diagnosis, diagnosis.pet);
  }

  /**
   * Obtener todos los diagnósticos de una mascota
   */
  async findByPet(petId: number, currentUser: any): Promise<DiagnosisResponseDto[]> {
    this.logger.log(`Finding diagnoses for pet ${petId} by user ${currentUser.sub}`);

    // Validar acceso a la mascota
    const pet = await this.validatePetAccess(petId, currentUser);

    const diagnoses = await this.diagnosisRepository.find({
      where: { petId },
      relations: ['pet', 'appointment'],
      order: { createdAt: 'DESC' },
    });

    return diagnoses.map(diagnosis => this.formatResponse(diagnosis, pet));
  }

  /**
   * Obtener diagnósticos por usuario actual
   */
  async findByUser(currentUser: any): Promise<DiagnosisResponseDto[]> {
    this.logger.log(`Finding diagnoses for user ${currentUser.sub}`);

    let query = this.diagnosisRepository
      .createQueryBuilder('diagnosis')
      .leftJoinAndSelect('diagnosis.pet', 'pet')
      .leftJoinAndSelect('pet.client', 'client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('diagnosis.appointment', 'appointment')
      .orderBy('diagnosis.createdAt', 'DESC');

    if (currentUser.role === UserRole.CLIENT) {
      query = query.where('user.id = :userId', { userId: currentUser.sub });
    } else if (currentUser.role === UserRole.VET) {
      // Los veterinarios pueden ver todos los diagnósticos
      // En una implementación más específica, podrías filtrar por veterinario asignado
    }

    const diagnoses = await query.getMany();

    return diagnoses.map(diagnosis => this.formatResponse(diagnosis, diagnosis.pet));
  }

  /**
   * Procesar prediagnóstico de forma asíncrona
   */
  private async processPreDiagnosis(diagnosisId: number, request: DeepSeekRequest): Promise<void> {
    try {
      this.logger.log(`Processing pre-diagnosis ${diagnosisId} with DeepSeek`);

      // Generar prediagnóstico con DeepSeek
      const deepSeekResponse = await this.deepSeekService.generatePreDiagnosis(request);

      // Formatear resultados para la base de datos
      const results = {
        conditions: deepSeekResponse.possibleConditions,
        recommendations: deepSeekResponse.recommendations,
        confidence: deepSeekResponse.confidence,
        processingTime: Date.now(),
        metadata: {
          modelVersion: 'deepseek-chat',
          timestamp: new Date().toISOString(),
          urgencyLevel: deepSeekResponse.urgencyLevel,
          disclaimer: deepSeekResponse.disclaimer,
        },
      };

      // Actualizar registro
      await this.diagnosisRepository.update(diagnosisId, {
        status: DiagnosisStatus.COMPLETED,
        results,
        confidence: deepSeekResponse.confidence,
        processedAt: new Date(),
      });

      this.logger.log(`Pre-diagnosis ${diagnosisId} completed successfully`);

    } catch (error) {
      this.logger.error(`Error processing pre-diagnosis ${diagnosisId}: ${error.message}`, error.stack);

      // Marcar como fallido
      await this.diagnosisRepository.update(diagnosisId, {
        status: DiagnosisStatus.FAILED,
        errorMessage: error.message,
        processedAt: new Date(),
      });
    }
  }

  /**
   * Validar acceso a una mascota
   */
  private async validatePetAccess(petId: number, currentUser: any): Promise<Pet> {
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

    return pet;
  }

  /**
   * Validar acceso a una cita
   */
  private async validateAppointmentAccess(appointmentId: number, currentUser: any): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['pet', 'pet.client', 'pet.client.user', 'veterinarian', 'veterinarian.user'],
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${appointmentId} no encontrada`);
    }

    if (currentUser.role === UserRole.CLIENT) {
      if (appointment.pet?.clientId !== currentUser.clientId) {
        throw new ForbiddenException('No tienes acceso a esta cita');
      }
    } else if (currentUser.role === UserRole.VET) {
      if (appointment.veterinarian?.user?.id !== (currentUser.id || currentUser.sub)) {
        throw new ForbiddenException('No tienes acceso a esta cita');
      }
    }

    return appointment;
  }

  /**
   * Validar acceso a un diagnóstico
   */
  private async validateDiagnosisAccess(diagnosis: AIDiagnosis, currentUser: any): Promise<void> {
    if (currentUser.role === UserRole.CLIENT) {
      // Primero intentar usar la relación pet si está cargada
      let petClientId = diagnosis.pet?.clientId;
      
      // Si no está disponible, cargar la mascota desde la base de datos
      if (petClientId === undefined) {
        const pet = await this.petRepository.findOne({
          where: { id: diagnosis.petId },
          select: ['id', 'clientId'], // Solo necesitamos el clientId
        });
        
        if (!pet) {
          this.logger.error(`Pet with ID ${diagnosis.petId} not found for diagnosis ${diagnosis.id}`);
          throw new NotFoundException('Mascota no encontrada');
        }
        
        petClientId = pet.clientId;
      }

      // Comparar clientId directamente
      if (petClientId !== currentUser.clientId) {
        this.logger.warn(`Access denied to diagnosis ${diagnosis.id}: pet.clientId=${petClientId}, user.clientId=${currentUser.clientId}, userRole=${currentUser.role}`);
        throw new ForbiddenException('No tienes acceso a este diagnóstico');
      }
      
      this.logger.log(`Access granted to diagnosis ${diagnosis.id} for client ${currentUser.clientId}`);
    }
    // Los veterinarios y administradores tienen acceso completo
  }

  /**
   * Formatear respuesta
   */
  private formatResponse(diagnosis: AIDiagnosis, pet?: Pet): DiagnosisResponseDto {
    const response = plainToClass(DiagnosisResponseDto, diagnosis, {
      excludeExtraneousValues: true,
    });

    if (pet) {
      response.pet = plainToClass(DiagnosisResponseDto['SimplifiedPetDto'], pet, {
        excludeExtraneousValues: true,
      });
    }

    return response;
  }

  /**
   * Health check para DeepSeek
   */
  async healthCheck(): Promise<{ deepSeek: boolean }> {
    const deepSeekHealth = await this.deepSeekService.healthCheck();
    
    return {
      deepSeek: deepSeekHealth,
    };
  }
} 