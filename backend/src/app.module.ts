import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';

// Importar entidades
import { User } from './modules/users/entities/user.entity';
import { Client } from './modules/users/entities/client.entity';
import { Veterinarian } from './modules/users/entities/veterinarian.entity';
import { Pet } from './modules/pets/entities/pet.entity';
import { Appointment } from './modules/appointments/entities/appointment.entity';
import { MedicalRecord } from './modules/medical/entities/medical-record.entity';
import { Prescription } from './modules/medical/entities/prescription.entity';
import { Vaccination } from './modules/medical/entities/vaccination.entity';
import { AIDiagnosis } from './modules/diagnosis/entities/ai-diagnosis.entity';
import { Attachment } from './modules/medical/entities/attachment.entity';
import { Notification } from './modules/notifications/entities/notification.entity';

// Importar módulos cuando estén creados
import { AuthModule } from './modules/auth/auth.module';
import { PetsModule } from './modules/pets/pets.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { MedicalModule } from './modules/medical/medical.module';
// import { UsersModule } from './modules/users/users.module';
// import { DiagnosisModule } from './modules/diagnosis/diagnosis.module';
// import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    
    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [
          User,
          Client,
          Veterinarian,
          Pet,
          Appointment,
          MedicalRecord,
          Prescription,
          Vaccination,
          AIDiagnosis,
          Attachment,
          Notification,
        ],
        synchronize: false, // En producción siempre false
        logging: configService.get('NODE_ENV') === 'development',
        retryAttempts: 3,
        retryDelay: 3000,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    // Módulos funcionales (se añadirán conforme se implementen)
    AuthModule,
    PetsModule,
    AppointmentsModule,
    MedicalModule,
    // UsersModule,
    // DiagnosisModule,
    // NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 