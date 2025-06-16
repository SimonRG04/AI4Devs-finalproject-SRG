export class VeterinarianResponseDto {
  id: number;
  specialization: string;
  licenseNumber: string;
  availabilityHours: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
} 