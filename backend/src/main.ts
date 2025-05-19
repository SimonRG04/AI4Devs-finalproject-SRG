import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración global
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const configService = app.get(ConfigService);
  
  // Configuración CORS para permitir solicitudes del frontend
  const frontendUrl = configService.get('FRONTEND_URL');
  const corsOrigins = [
    'https://frontend-vuejs-production.up.railway.app',
    'http://frontend-vuejs-production.up.railway.app',
    'http://localhost:5173'
  ];
  
  // Si hay una URL configurada, añadirla también
  if (frontendUrl && !corsOrigins.includes(frontendUrl)) {
    corsOrigins.push(frontendUrl);
  }
  
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = configService.get('PORT') || 3000;
  
  await app.listen(port, '0.0.0.0'); // Escuchar en todas las interfaces de red
  console.log(`Application is running on port: ${port}`);
}
bootstrap(); 