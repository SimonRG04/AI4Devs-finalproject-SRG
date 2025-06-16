import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veterinarian } from '../users/entities/veterinarian.entity';
import { VeterinariansController } from './veterinarians.controller';
import { VeterinariansService } from './veterinarians.service';

@Module({
  imports: [TypeOrmModule.forFeature([Veterinarian])],
  controllers: [VeterinariansController],
  providers: [VeterinariansService],
  exports: [VeterinariansService],
})
export class VeterinariansModule {} 