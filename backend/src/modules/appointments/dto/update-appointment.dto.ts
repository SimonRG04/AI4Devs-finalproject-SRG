import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(
  OmitType(CreateAppointmentDto, ['petId'] as const)
) {
  // Nota: Removemos petId porque una vez creada la cita, 
  // no debería cambiar la mascota asociada
} 