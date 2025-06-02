import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+573001234567',
    role: UserRole.CLIENT,
    createdAt: new Date(),
    updatedAt: new Date(),
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  } as User;

  const mockAuthResponse = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: {
      id: mockUser.id,
      email: mockUser.email,
      fullName: mockUser.fullName,
      role: mockUser.role,
    },
    expiresIn: 86400,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return auth response on successful login', async () => {
      // Arrange
      authService.login.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      phoneNumber: '+573001234567',
      address: 'New Address',
    };

    it('should return auth response on successful registration', async () => {
      // Arrange
      authService.register.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('refreshToken', () => {
    it('should return new auth response', async () => {
      // Arrange
      authService.refreshToken.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.refreshToken(mockUser);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      // Act
      const result = await controller.getProfile(mockUser);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      });
    });
  });
}); 