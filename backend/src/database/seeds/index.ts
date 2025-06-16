import { AppDataSource } from '../../config/database.config';
import * as bcrypt from 'bcrypt';

// Entidades
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Client } from '../../modules/users/entities/client.entity';
import { Veterinarian } from '../../modules/users/entities/veterinarian.entity';
import { Pet, PetSpecies, PetGender } from '../../modules/pets/entities/pet.entity';
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentType, 
  AppointmentPriority 
} from '../../modules/appointments/entities/appointment.entity';

async function runSeeds() {
  console.log('🌱 Iniciando seeds de base de datos...');

  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const clientRepository = AppDataSource.getRepository(Client);
  const veterinarianRepository = AppDataSource.getRepository(Veterinarian);
  const petRepository = AppDataSource.getRepository(Pet);
  const appointmentRepository = AppDataSource.getRepository(Appointment);

  try {
    // Limpiar datos existentes usando consultas SQL directas
    console.log('🧹 Limpiando datos existentes...');
    await AppDataSource.query('DELETE FROM appointments WHERE 1=1');
    await AppDataSource.query('DELETE FROM pets WHERE 1=1');
    await AppDataSource.query('DELETE FROM veterinarians WHERE 1=1');
    await AppDataSource.query('DELETE FROM clients WHERE 1=1');
    await AppDataSource.query('DELETE FROM users WHERE 1=1');

    // Hash para contraseñas
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    // 1. Crear usuarios y veterinarios
    console.log('👨‍⚕️ Creando veterinarios...');
    
    const vetUser1 = userRepository.create({
      email: 'dr.garcia@vetai.com',
      password: hashedPassword,
      firstName: 'María',
      lastName: 'García',
      phoneNumber: '+1234567890',
      role: UserRole.VET,
    });
    const savedVetUser1 = await userRepository.save(vetUser1);

    const veterinarian1 = veterinarianRepository.create({
      userId: savedVetUser1.id,
      licenseNumber: 'VET-001-2024',
      specialization: 'Medicina General y Cirugía',
      bio: 'Veterinaria especializada en medicina general con experiencia en cirugía menor y medicina preventiva.',
    });
    await veterinarianRepository.save(veterinarian1);

    const vetUser2 = userRepository.create({
      email: 'dr.rodriguez@vetai.com',
      password: hashedPassword,
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      phoneNumber: '+1234567891',
      role: UserRole.VET,
    });
    const savedVetUser2 = await userRepository.save(vetUser2);

    const veterinarian2 = veterinarianRepository.create({
      userId: savedVetUser2.id,
      licenseNumber: 'VET-002-2024',
      specialization: 'Dermatología y Alergias',
      bio: 'Especialista en dermatología veterinaria y tratamiento de alergias en mascotas.',
    });
    await veterinarianRepository.save(veterinarian2);

    // 2. Crear usuarios clientes
    console.log('👥 Creando clientes...');
    
    const clientUser1 = userRepository.create({
      email: 'ana.martinez@email.com',
      password: hashedPassword,
      firstName: 'Ana',
      lastName: 'Martínez',
      phoneNumber: '+1234567892',
      role: UserRole.CLIENT,
    });
    const savedClientUser1 = await userRepository.save(clientUser1);

    const client1 = clientRepository.create({
      userId: savedClientUser1.id,
      address: 'Calle 123 #45-67, Bogotá',
    });
    const savedClient1 = await clientRepository.save(client1);

    const clientUser2 = userRepository.create({
      email: 'luis.torres@email.com',
      password: hashedPassword,
      firstName: 'Luis',
      lastName: 'Torres',
      phoneNumber: '+1234567894',
      role: UserRole.CLIENT,
    });
    const savedClientUser2 = await userRepository.save(clientUser2);

    const client2 = clientRepository.create({
      userId: savedClientUser2.id,
      address: 'Carrera 50 #12-34, Medellín',
    });
    const savedClient2 = await clientRepository.save(client2);

    const clientUser3 = userRepository.create({
      email: 'sofia.hernandez@email.com',
      password: hashedPassword,
      firstName: 'Sofía',
      lastName: 'Hernández',
      phoneNumber: '+1234567896',
      role: UserRole.CLIENT,
    });
    const savedClientUser3 = await userRepository.save(clientUser3);

    const client3 = clientRepository.create({
      userId: savedClientUser3.id,
      address: 'Avenida 80 #25-45, Cali',
    });
    const savedClient3 = await clientRepository.save(client3);

    // 3. Crear mascotas
    console.log('🐕 Creando mascotas...');
    
    const pet1 = petRepository.create({
      clientId: savedClient1.id,
      name: 'Max',
      species: PetSpecies.DOG,
      breed: 'Golden Retriever',
      gender: PetGender.MALE,
      birthDate: new Date('2020-03-15'),
      weight: 28.5,
    });
    const savedPet1 = await petRepository.save(pet1);

    const pet2 = petRepository.create({
      clientId: savedClient1.id,
      name: 'Luna',
      species: PetSpecies.CAT,
      breed: 'Persa',
      gender: PetGender.FEMALE,
      birthDate: new Date('2021-07-22'),
      weight: 4.2,
    });
    const savedPet2 = await petRepository.save(pet2);

    const pet3 = petRepository.create({
      clientId: savedClient2.id,
      name: 'Rocky',
      species: PetSpecies.DOG,
      breed: 'Bulldog Francés',
      gender: PetGender.MALE,
      birthDate: new Date('2019-11-08'),
      weight: 12.8,
    });
    const savedPet3 = await petRepository.save(pet3);

    const pet4 = petRepository.create({
      clientId: savedClient3.id,
      name: 'Bella',
      species: PetSpecies.DOG,
      breed: 'Labrador',
      gender: PetGender.FEMALE,
      birthDate: new Date('2022-01-10'),
      weight: 22.0,
    });
    const savedPet4 = await petRepository.save(pet4);

    // 4. Crear citas de ejemplo
    console.log('📅 Creando citas de ejemplo...');
    
    // Cita futura - programada
    const appointment1 = appointmentRepository.create({
      petId: savedPet1.id,
      veterinarianId: veterinarian1.id,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde hoy
      type: AppointmentType.CONSULTATION,
      status: AppointmentStatus.SCHEDULED,
      duration: 30,
      priority: AppointmentPriority.NORMAL,
      notes: 'Chequeo general y vacunación programada',
    });
    await appointmentRepository.save(appointment1);

    // Cita futura - programada  
    const appointment2 = appointmentRepository.create({
      petId: savedPet2.id,
      veterinarianId: veterinarian2.id,
      scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días desde hoy
      type: AppointmentType.CONSULTATION,
      status: AppointmentStatus.SCHEDULED,
      duration: 45,
      priority: AppointmentPriority.NORMAL,
      notes: 'Control dermatológico y revisión de alergias',
    });
    await appointmentRepository.save(appointment2);

    // 5. Crear usuario administrador
    console.log('👑 Creando usuario administrador...');
    
    const adminUser = userRepository.create({
      email: 'admin@vetai.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'VetAI',
      phoneNumber: '+1234567999',
      role: UserRole.ADMIN,
    });
    await userRepository.save(adminUser);

    console.log('✅ Seeds completados exitosamente!');
    console.log('\n📊 Datos creados:');
    console.log('• 6 usuarios (2 veterinarios, 3 clientes, 1 admin)');
    console.log('• 2 veterinarios');
    console.log('• 3 clientes');
    console.log('• 4 mascotas');
    console.log('• 2 citas');
    console.log('\n🔑 Credenciales de acceso:');
    console.log('Veterinarios:');
    console.log('  • dr.garcia@vetai.com / 123456');
    console.log('  • dr.rodriguez@vetai.com / 123456');
    console.log('Clientes:');
    console.log('  • ana.martinez@email.com / 123456');
    console.log('  • luis.torres@email.com / 123456');
    console.log('  • sofia.hernandez@email.com / 123456');
    console.log('Admin:');
    console.log('  • admin@vetai.com / 123456');

  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds(); 