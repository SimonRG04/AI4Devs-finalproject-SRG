import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTest(): { message: string; timestamp: string } {
    return {
      message: 'Hello World desde el backend de VetAI Connect!',
      timestamp: new Date().toISOString(),
    };
  }
} 