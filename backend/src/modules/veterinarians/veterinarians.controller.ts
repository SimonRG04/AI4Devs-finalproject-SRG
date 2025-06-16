import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VeterinariansService } from './veterinarians.service';
import { VeterinarianQueryDto } from './dto/veterinarian-query.dto';
import { VeterinarianResponseDto } from './dto/veterinarian-response.dto';

@Controller('veterinarians')
@UseGuards(JwtAuthGuard)
export class VeterinariansController {
  constructor(private readonly veterinariansService: VeterinariansService) {}

  @Get()
  async findAll(@Query() query: VeterinarianQueryDto) {
    return this.veterinariansService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<VeterinarianResponseDto> {
    return this.veterinariansService.findOne(id);
  }
} 