import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMedicalRecordDto } from './create-medical-record.dto';

export class UpdateMedicalRecordDto extends PartialType(
  OmitType(CreateMedicalRecordDto, ['appointmentId'] as const),
) {
  // Heredamos todas las propiedades de CreateMedicalRecordDto como opcionales
  // excepto appointmentId que no debe poder modificarse
} 