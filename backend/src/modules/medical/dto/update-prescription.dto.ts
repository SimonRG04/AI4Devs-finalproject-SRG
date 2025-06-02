import { PartialType } from '@nestjs/swagger';
import { CreatePrescriptionDto } from './create-prescription.dto';

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {
  // Heredamos todas las propiedades de CreatePrescriptionDto como opcionales
} 