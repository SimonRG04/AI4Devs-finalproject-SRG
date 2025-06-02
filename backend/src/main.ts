import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Eliminar propiedades no definidas en DTOs
      forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas
      transform: true, // Transformar automáticamente tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración CORS
  app.enableCors(corsConfig);

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api', {
    exclude: ['/health', '/'],
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('VetAI Connect API')
    .setDescription('API REST para la plataforma de gestión veterinaria VetAI Connect')
    .setVersion('1.0.0')
    .setContact(
      'Simón Ramirez Guarumo',
      'https://github.com/simonramirez',
      'simon.ramirez@ejemplo.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Desarrollo')
    .addServer('https://api.vetai-connect.com', 'Producción')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Autenticación', 'Endpoints para login, registro y gestión de tokens')
    .addTag('Usuarios', 'Gestión de usuarios, clientes y veterinarios')
    .addTag('Mascotas', 'CRUD de mascotas y sus datos médicos')
    .addTag('Citas', 'Sistema de agendamiento de citas veterinarias')
    .addTag('Registros Médicos', 'Historiales médicos y prescripciones')
    .addTag('Diagnóstico IA', 'Análisis de imágenes con inteligencia artificial')
    .addTag('Notificaciones', 'Sistema de notificaciones y alertas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'VetAI Connect API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c5aa0 }
    `,
  });

  // Health check endpoint
  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: configService.get('NODE_ENV'),
      version: '1.0.0',
    });
  });

  // Puerto del servidor
  const port = configService.get('PORT') || 3000;
  
  await app.listen(port);
  
  logger.log(`🚀 Servidor ejecutándose en puerto ${port}`);
  logger.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health check: http://localhost:${port}/health`);
  logger.log(`🌍 Entorno: ${configService.get('NODE_ENV')}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error al iniciar la aplicación:', error);
  process.exit(1);
}); 