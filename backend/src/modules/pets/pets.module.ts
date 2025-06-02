import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { Pet } from './entities/pet.entity';
import { Client } from '../users/entities/client.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet, Client]),
    AuthModule,
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService, TypeOrmModule],
})
export class PetsModule {} 