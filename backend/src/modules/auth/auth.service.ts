import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Client } from '../users/entities/client.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  clientId?: number;
  veterinarianId?: number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['client', 'veterinarian'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Agregar IDs específicos según el rol
    if (user.role === UserRole.CLIENT && user.client) {
      payload.clientId = user.client.id;
    } else if (user.role === UserRole.VET && user.veterinarian) {
      payload.veterinarianId = user.veterinarian.id;
    }

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: this.mapToUserResponse(user),
      expiresIn: 86400, // 24 horas en segundos
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phoneNumber, address } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role: UserRole.CLIENT, // Por defecto, los registros son clientes
    });

    try {
      const savedUser = await this.userRepository.save(user);

      // Crear perfil de cliente
      const client = this.clientRepository.create({
        userId: savedUser.id,
        address,
      });

      const savedClient = await this.clientRepository.save(client);

      // Cargar relaciones
      const userWithRelations = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['client'],
      });

      // Generar tokens
      const payload: JwtPayload = {
        sub: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        clientId: savedClient.id,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        accessToken,
        refreshToken,
        user: this.mapToUserResponse(userWithRelations),
        expiresIn: 86400,
      };
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['client', 'veterinarian'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  async refreshToken(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Agregar IDs específicos según el rol
    if (user.role === UserRole.CLIENT && user.client) {
      payload.clientId = user.client.id;
    } else if (user.role === UserRole.VET && user.veterinarian) {
      payload.veterinarianId = user.veterinarian.id;
    }

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: this.mapToUserResponse(user),
      expiresIn: 86400,
    };
  }

  private mapToUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['client', 'veterinarian'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }
} 