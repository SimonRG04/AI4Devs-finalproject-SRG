import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET') || 'vetai-connect-jwt-secret-change-in-production',
    signOptions: {
      expiresIn: configService.get('JWT_EXPIRES_IN') || '24h',
      issuer: 'vetai-connect',
      audience: 'vetai-connect-users',
    },
  }),
  inject: [ConfigService],
}; 