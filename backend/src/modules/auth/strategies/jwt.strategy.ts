import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    try {
      const user = await this.authService.validateUser(payload);
      
      // Agregar información adicional del payload JWT
      return {
        ...user,
        clientId: payload.clientId,
        veterinarianId: payload.veterinarianId,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
} 