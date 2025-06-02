import { AppDataSource } from '../../config/database.config';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Client } from '../../modules/users/entities/client.entity';
import { Veterinarian } from '../../modules/users/entities/veterinarian.entity';
import { Pet, PetSpecies, PetGender } from '../../modules/pets/entities/pet.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('🌱 Iniciando seeding de la base de datos...');

    const userRepository = AppDataSource.getRepository(User);
    const clientRepository = AppDataSource.getRepository(Client);
    const veterinarianRepository = AppDataSource.getRepository(Veterinarian);
    const petRepository = AppDataSource.getRepository(Pet);

    // Limpiar datos existentes en orden correcto (respetando foreign keys)
    console.log('🧹 Limpiando datos existentes...');
    
    // Usar DELETE en lugar de TRUNCATE para evitar problemas con foreign keys
    await AppDataSource.query('DELETE FROM appointments WHERE 1=1');
    await AppDataSource.query('DELETE FROM vaccinations WHERE 1=1');
    await AppDataSource.query('DELETE FROM ai_diagnoses WHERE 1=1');
    await AppDataSource.query('DELETE FROM medical_records WHERE 1=1');
    await AppDataSource.query('DELETE FROM pets WHERE 1=1');
    await AppDataSource.query('DELETE FROM clients WHERE 1=1');
    await AppDataSource.query('DELETE FROM veterinarians WHERE 1=1');
    await AppDataSource.query('DELETE FROM users WHERE 1=1');

    console.log('🧹 Datos existentes eliminados');

    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = userRepository.create({
      email: 'admin@vetai-connect.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      phoneNumber: '+573001234567',
      role: UserRole.ADMIN,
    });
    await userRepository.save(adminUser);
    console.log('👤 Usuario administrador creado');

    // Crear veterinario de prueba
    const vetPassword = await bcrypt.hash('vet123', 12);
    const vetUser = userRepository.create({
      email: 'veterinario@vetai-connect.com',
      password: vetPassword,
      firstName: 'Dr. María',
      lastName: 'González',
      phoneNumber: '+573007654321',
      role: UserRole.VET,
    });
    const savedVetUser = await userRepository.save(vetUser);

    const veterinarian = veterinarianRepository.create({
      userId: savedVetUser.id,
      specialization: 'Medicina General Veterinaria',
      bio: 'Veterinaria con 10 años de experiencia en medicina general y cirugía menor.',
      licenseNumber: 'VET-2024-001',
      availabilityHours: {
        monday: { start: '08:00', end: '18:00', isAvailable: true },
        tuesday: { start: '08:00', end: '18:00', isAvailable: true },
        wednesday: { start: '08:00', end: '18:00', isAvailable: true },
        thursday: { start: '08:00', end: '18:00', isAvailable: true },
        friday: { start: '08:00', end: '17:00', isAvailable: true },
        saturday: { start: '09:00', end: '14:00', isAvailable: true },
        sunday: { start: '09:00', end: '13:00', isAvailable: false },
      },
    });
    await veterinarianRepository.save(veterinarian);
    console.log('🩺 Veterinario de prueba creado');

    // Crear clientes de prueba
    const clientPassword = await bcrypt.hash('cliente123', 12);
    
    // Cliente 1
    const client1User = userRepository.create({
      email: 'juan.perez@ejemplo.com',
      password: clientPassword,
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+573009876543',
      role: UserRole.CLIENT,
    });
    const savedClient1User = await userRepository.save(client1User);

    const client1 = clientRepository.create({
      userId: savedClient1User.id,
      address: 'Calle 123 #45-67, Bogotá, Colombia',
    });
    const savedClient1 = await clientRepository.save(client1);

    // Cliente 2
    const client2User = userRepository.create({
      email: 'ana.garcia@ejemplo.com',
      password: clientPassword,
      firstName: 'Ana',
      lastName: 'García',
      phoneNumber: '+573005432109',
      role: UserRole.CLIENT,
    });
    const savedClient2User = await userRepository.save(client2User);

    const client2 = clientRepository.create({
      userId: savedClient2User.id,
      address: 'Carrera 45 #12-34, Medellín, Colombia',
    });
    const savedClient2 = await clientRepository.save(client2);

    console.log('👥 Clientes de prueba creados');

    // Crear mascotas de prueba
    const pet1 = petRepository.create({
      clientId: savedClient1.id,
      name: 'Max',
      species: PetSpecies.DOG,
      breed: 'Golden Retriever',
      birthDate: new Date('2020-03-15'),
      gender: PetGender.MALE,
      weight: 28.5,
      medicalAlerts: 'Alérgico al pollo. Sensible a medicamentos con penicilina.',
    });

    const pet2 = petRepository.create({
      clientId: savedClient1.id,
      name: 'Luna',
      species: PetSpecies.CAT,
      breed: 'Siamés',
      birthDate: new Date('2021-07-22'),
      gender: PetGender.FEMALE,
      weight: 4.2,
      medicalAlerts: 'Tendencia a problemas urinarios. Dieta especial.',
    });

    const pet3 = petRepository.create({
      clientId: savedClient2.id,
      name: 'Rocky',
      species: PetSpecies.DOG,
      breed: 'Bulldog Francés',
      birthDate: new Date('2019-11-08'),
      gender: PetGender.MALE,
      weight: 12.8,
      medicalAlerts: 'Problemas respiratorios leves. Evitar ejercicio intenso.',
    });

    const pet4 = petRepository.create({
      clientId: savedClient2.id,
      name: 'Coco',
      species: PetSpecies.BIRD,
      breed: 'Canario',
      birthDate: new Date('2022-01-10'),
      gender: PetGender.UNKNOWN,
      weight: 0.02,
    });

    await petRepository.save([pet1, pet2, pet3, pet4]);
    console.log('🐕 Mascotas de prueba creadas');

    console.log('✅ Seeding completado exitosamente!');
    console.log('\n📋 Usuarios creados:');
    console.log('Admin: admin@vetai-connect.com / admin123');
    console.log('Veterinario: veterinario@vetai-connect.com / vet123');
    console.log('Cliente 1: juan.perez@ejemplo.com / cliente123');
    console.log('Cliente 2: ana.garcia@ejemplo.com / cliente123');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Ejecutar seeding si el archivo se ejecuta directamente
if (require.main === module) {
  seed();
}

export default seed; 