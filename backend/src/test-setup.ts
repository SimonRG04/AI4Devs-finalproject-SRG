// Configuración global para tests
import 'reflect-metadata';

// Mock de variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_PORT = '5432';
process.env.DATABASE_USERNAME = 'test';
process.env.DATABASE_PASSWORD = 'test';
process.env.DATABASE_NAME = 'vetai_connect_test';

// Configuración de timeout para tests
jest.setTimeout(30000); 