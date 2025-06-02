import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PetsService } from './pets.service';
import { Pet, PetGender, PetSpecies } from './entities/pet.entity';
import { UserRole } from '../users/entities/user.entity';

describe('PetsService', () => {
  let service: PetsService;
  let petRepository: jest.Mocked<Repository<Pet>>;

  const mockPet: Partial<Pet> = {
    id: 1,
    clientId: 1,
    name: 'Max',
    species: PetSpecies.DOG,
    breed: 'Golden Retriever',
    birthDate: new Date('2020-01-15'),
    gender: PetGender.MALE,
    weight: 25.5,
    medicalAlerts: 'Alérgico a la penicilina',
    photoUrl: 'https://example.com/photo.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    client: null,
    appointments: [],
    vaccinations: [],
    aiDiagnoses: [],
  };

  // Función helper para crear un pet completo con getter age
  const createMockPet = (overrides: Partial<Pet> = {}): Pet => {
    const pet = { ...mockPet, ...overrides } as Pet;
    Object.defineProperty(pet, 'age', {
      get: function() {
        if (!this.birthDate) return null;
        const today = new Date();
        const birth = new Date(this.birthDate);
        return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      },
      configurable: true,
    });
    return pet;
  };

  const mockUser = {
    sub: 1,
    email: 'client@test.com',
    role: UserRole.CLIENT,
    clientId: 1,
  };

  const mockRepositoryMethods = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
    manager: {
      getRepository: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: getRepositoryToken(Pet),
          useValue: mockRepositoryMethods,
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
    petRepository = module.get(getRepositoryToken(Pet));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPetDto = {
      name: 'Max',
      species: PetSpecies.DOG,
      breed: 'Golden Retriever',
      birthDate: '2020-01-15',
      gender: PetGender.MALE,
      weight: 25.5,
      medicalAlerts: 'Alérgico a la penicilina',
      photoUrl: 'https://example.com/photo.jpg',
    };

    it('should create a pet successfully', async () => {
      const mockClientRepo = {
        findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
      };
      (petRepository.manager.getRepository as jest.Mock).mockReturnValue(mockClientRepo);
      
      const completePet = createMockPet();
      petRepository.create.mockReturnValue(completePet);
      petRepository.save.mockResolvedValue(completePet);

      const result = await service.create(createPetDto, 1, mockUser);

      expect(result).toEqual(completePet);
      expect(petRepository.create).toHaveBeenCalledWith({
        ...createPetDto,
        clientId: 1,
        birthDate: new Date('2020-01-15'),
      });
      expect(petRepository.save).toHaveBeenCalledWith(completePet);
    });

    it('should throw BadRequestException for future birth date', async () => {
      const futureDto = {
        ...createPetDto,
        birthDate: '2030-01-15',
      };

      const mockClientRepo = {
        findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
      };
      (petRepository.manager.getRepository as jest.Mock).mockReturnValue(mockClientRepo);

      await expect(service.create(futureDto, 1, mockUser))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException for unauthorized access', async () => {
      const mockClientRepo = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      (petRepository.manager.getRepository as jest.Mock).mockReturnValue(mockClientRepo);

      await expect(service.create(createPetDto, 2, mockUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should return a pet when found', async () => {
      const mockPetWithRelations = createMockPet({
        client: { user: { id: 1 } } as any,
      });

      petRepository.findOne.mockResolvedValue(mockPetWithRelations);

      const result = await service.findOne(1, mockUser);

      expect(result).toEqual(mockPetWithRelations);
      expect(petRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'client',
          'client.user',
          'appointments',
          'vaccinations',
        ],
      });
    });

    it('should throw NotFoundException when pet not found', async () => {
      petRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999, mockUser))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for unauthorized access', async () => {
      const mockPetWithDifferentOwner = createMockPet({
        client: { user: { id: 2 } } as any,
      });

      petRepository.findOne.mockResolvedValue(mockPetWithDifferentOwner);

      await expect(service.findOne(1, mockUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    const updatePetDto = {
      name: 'Max Updated',
      weight: 26.0,
    };

    it('should update a pet successfully', async () => {
      const mockPetWithRelations = createMockPet({
        client: { user: { id: 1 } } as any,
      });

      const updatedPet = createMockPet({
        ...mockPetWithRelations,
        ...updatePetDto,
      });

      petRepository.findOne.mockResolvedValueOnce(mockPetWithRelations);
      petRepository.update.mockResolvedValue({ affected: 1 } as any);
      petRepository.findOne.mockResolvedValueOnce(updatedPet);

      const result = await service.update(1, updatePetDto, mockUser);

      expect(petRepository.update).toHaveBeenCalledWith(1, {
        ...updatePetDto,
        birthDate: mockPetWithRelations.birthDate,
      });
      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove a pet successfully when no upcoming appointments', async () => {
      const mockPetWithRelations = createMockPet({
        client: { user: { id: 1 } } as any,
      });

      petRepository.findOne.mockResolvedValue(mockPetWithRelations);
      
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      } as unknown as SelectQueryBuilder<Pet>;
      
      petRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      petRepository.remove.mockResolvedValue(mockPetWithRelations);

      await service.remove(1, mockUser);

      expect(petRepository.remove).toHaveBeenCalledWith(mockPetWithRelations);
    });

    it('should throw BadRequestException when pet has upcoming appointments', async () => {
      const mockPetWithRelations = createMockPet({
        client: { user: { id: 1 } } as any,
      });

      petRepository.findOne.mockResolvedValue(mockPetWithRelations);
      
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2), // Has upcoming appointments
      } as unknown as SelectQueryBuilder<Pet>;
      
      petRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.remove(1, mockUser))
        .rejects.toThrow(BadRequestException);
    });
  });
}); 