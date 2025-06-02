import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://frontend-vuejs-production.up.railway.app',
      'http://frontend-vuejs-production.up.railway.app',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:3000',
    ];
    
    // En desarrollo, permitir orígenes undefined (requests locales)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por política CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['X-Total-Count'],
  optionsSuccessStatus: 200,
}; 