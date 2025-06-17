# Plan de Desarrollo VetAI Connect
## Planificación Secuencial Backend → Frontend

### Información del Proyecto
- **Nombre**: VetAI Connect
- **Desarrollador**: Simón Ramirez Guarumo
- **Repositorio**: https://github.com/SimonRG04/AI4Devs-finalproject-SRG
- **Tech Stack**: NestJS + PostgreSQL + VueJS + Railway + DeepSeek AI
- **Tiempo Estimado Total**: 30 horas

---

## FASE 1: BACKEND Y TESTING (20 horas)
*Fundación completa del sistema*

### 1.1. Configuración e Infraestructura Base (4 horas)

#### Estructura del Proyecto Backend
```
backend/
├── src/
│   ├── config/              # Configuraciones globales
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── env.config.ts
│   │   └── cors.config.ts
│   ├── shared/              # Código compartido
│   │   ├── dto/             # DTOs base
│   │   ├── interfaces/      # Interfaces globales
│   │   ├── guards/          # Guards de autenticación
│   │   ├── pipes/           # Pipes de validación
│   │   ├── decorators/      # Decoradores personalizados
│   │   └── exceptions/      # Excepciones personalizadas
│   ├── modules/             # Módulos funcionales
│   ├── app.module.ts
│   └── main.ts
├── test/                    # Tests de integración
├── migrations/              # Migraciones DB
├── seeds/                   # Datos iniciales
├── package.json
├── nest-cli.json
├── tsconfig.json
└── .env.example
```

#### Tareas Específicas:
- [x] **Configuración inicial NestJS**
  - Instalación y configuración de dependencias base
  - Configuración TypeScript y ESLint
  - Estructura de carpetas según arquitectura definida

- [x] **Configuración de base de datos**
  - Configuración TypeORM con PostgreSQL
  - Variables de entorno para conexión
  - Configuración para desarrollo y producción

- [x] **Configuración de autenticación**
  - JWT configuration
  - Passport.js setup
  - Guards y estrategias base

- [x] **Configuración CORS y middleware**
  - CORS para comunicación con frontend
  - Middleware de logging y validación
  - Configuración de headers de seguridad

#### Criterios de Completitud:
- ✅ Servidor NestJS ejecutándose en puerto 3000
- ✅ Conexión exitosa a PostgreSQL
- ✅ Variables de entorno configuradas
- ✅ CORS habilitado para frontend

### 1.2. Modelo de Datos y Migraciones (3 horas)

#### Entidades a Implementar:
```typescript
// Entidades según diseño del readme.md
├── entities/
│   ├── user.entity.ts       # Usuarios base
│   ├── client.entity.ts     # Clientes (dueños de mascotas)
│   ├── veterinarian.entity.ts # Veterinarios
│   ├── pet.entity.ts        # Mascotas
│   ├── appointment.entity.ts # Citas
│   ├── medical-record.entity.ts # Historiales médicos
│   ├── prescription.entity.ts # Prescripciones
│   ├── vaccination.entity.ts # Vacunaciones
│   ├── ai-diagnosis.entity.ts # Diagnósticos IA con DeepSeek
│   ├── attachment.entity.ts # Archivos adjuntos
│   └── notification.entity.ts # Notificaciones
```

#### Tareas Específicas:
- [x] **Implementación de entidades TypeORM**
  - Definir todas las entidades según ERD del readme
  - Configurar relaciones entre entidades
  - Validadores y decoradores necesarios

- [x] **Creación de migraciones**
  - Migración inicial para todas las tablas
  - Índices para optimización de consultas
  - Constraints y validaciones a nivel DB

- [x] **Implementación de seeds**
  - Datos iniciales para roles y tipos
  - Usuarios de prueba (admin, vet, cliente)
  - Mascotas y citas de ejemplo

#### Criterios de Completitud:
- ✅ Todas las entidades creadas y mapeadas
- ✅ Migraciones ejecutándose correctamente
- ✅ Relaciones funcionando adecuadamente
- ✅ Seeds cargando datos de prueba

### 1.3. Módulo de Autenticación y Usuarios (4 horas)

#### Estructura del Módulo Auth:
```
modules/auth/
├── auth.controller.ts       # Endpoints de autenticación
├── auth.service.ts          # Lógica de autenticación
├── auth.module.ts           # Configuración del módulo
├── strategies/
│   ├── jwt.strategy.ts      # Estrategia JWT
│   └── local.strategy.ts    # Estrategia local
├── guards/
│   ├── jwt-auth.guard.ts    # Guard JWT
│   ├── roles.guard.ts       # Guard de roles
│   └── local-auth.guard.ts  # Guard local
└── dto/
    ├── login.dto.ts         # DTO para login
    ├── register.dto.ts      # DTO para registro
    └── auth-response.dto.ts # DTO de respuesta
```

#### Endpoints a Implementar:
```typescript
// Según especificación API del readme.md
POST /api/auth/login         # Inicio de sesión
POST /api/auth/register      # Registro de cliente
POST /api/auth/refresh       # Renovación de token
POST /api/auth/logout        # Cerrar sesión
GET  /api/auth/profile       # Perfil del usuario
PUT  /api/auth/profile       # Actualizar perfil
```

#### Tareas Específicas:
- [x] **Implementación de autenticación JWT**
  - Login con email y password
  - Generación y validación de tokens
  - Refresh token mechanism

- [x] **Sistema de roles y permisos**
  - Roles: CLIENT, VET, ADMIN
  - Guards para proteger endpoints
  - Decoradores para verificar roles

- [x] **Gestión de usuarios**
  - Registro de nuevos clientes
  - Gestión de perfiles de usuario
  - Validaciones y sanitización

#### Criterios de Completitud:
- ✅ Login funcionando correctamente
- ✅ Tokens JWT válidos generándose
- ✅ Protección de rutas por rol
- ✅ Tests unitarios > 85% cobertura

### 1.4. Módulos Core del Negocio (6 horas)

#### Módulo de Mascotas:
```
modules/pets/
├── pets.controller.ts       # CRUD de mascotas
├── pets.service.ts          # Lógica de negocio
├── pets.module.ts           # Configuración
├── dto/
│   ├── create-pet.dto.ts    # Creación de mascota
│   ├── update-pet.dto.ts    # Actualización
│   └── pet-response.dto.ts  # Respuesta
└── pets.repository.ts       # Repository personalizado
```

#### Módulo de Citas:
```
modules/appointments/
├── appointments.controller.ts
├── appointments.service.ts
├── appointments.module.ts
├── dto/
│   ├── create-appointment.dto.ts
│   ├── update-appointment.dto.ts
│   └── availability.dto.ts
└── appointments.repository.ts
```

#### Módulo de Historiales Médicos:
```
modules/medical/
├── medical.controller.ts
├── medical.service.ts
├── medical.module.ts
├── dto/
│   ├── create-record.dto.ts
│   ├── prescription.dto.ts
│   └── vaccination.dto.ts
└── medical.repository.ts
```

#### Endpoints por Módulo:
```typescript
// Mascotas
GET    /api/pets              # Listar mascotas del cliente
POST   /api/pets              # Crear mascota
GET    /api/pets/:id          # Obtener mascota
PUT    /api/pets/:id          # Actualizar mascota
DELETE /api/pets/:id          # Eliminar mascota

// Citas  
GET    /api/appointments      # Listar citas
POST   /api/appointments      # Crear cita
GET    /api/appointments/:id  # Obtener cita
PUT    /api/appointments/:id  # Actualizar cita
DELETE /api/appointments/:id  # Cancelar cita
GET    /api/vets/:id/availability # Disponibilidad veterinario

// Historiales
GET    /api/pets/:id/medical  # Historial de mascota
POST   /api/medical           # Crear registro médico
GET    /api/medical/:id       # Obtener registro
PUT    /api/medical/:id       # Actualizar registro
POST   /api/medical/:id/prescriptions # Añadir prescripción
POST   /api/medical/:id/attachments   # Añadir archivo
```

#### Criterios de Completitud:
- ✅ CRUD completo para cada entidad
- ✅ Validaciones de negocio implementadas
- ✅ Relaciones entre entidades funcionando
- ✅ Autorización por roles funcionando

### 1.5. Módulo de IA y Diagnóstico con DeepSeek (3 horas)

#### Estructura del Módulo Diagnosis:
```
modules/diagnosis/
├── diagnosis.controller.ts   # Endpoints de IA
├── diagnosis.service.ts      # Lógica de IA
├── diagnosis.module.ts       # Configuración
├── providers/
│   ├── deepseek.service.ts   # Integración DeepSeek API
│   └── diagnosis-processor.service.ts # Procesamiento
├── entities/
│   └── ai-diagnosis.entity.ts # Entidad diagnósticos IA
├── dto/
│   ├── create-diagnosis.dto.ts
│   ├── diagnosis-response.dto.ts
│   └── diagnosis-request.dto.ts
└── diagnosis.repository.ts
```

#### Funcionalidades Clave:
- [x] **Integración con DeepSeek API**
  - Configuración de credenciales y endpoints
  - Adaptador para comunicación con DeepSeek Chat
  - Prompts especializados para diagnóstico veterinario
  - Manejo de rate limiting y timeouts

- [x] **Procesamiento inteligente de síntomas**
  - Análisis de texto descriptivo de síntomas
  - Procesamiento de contexto adicional (edad, raza, peso)
  - Evaluación de severidad y duración
  - Generación de recomendaciones personalizadas

- [x] **Sistema asíncrono robusto**
  - Procesamiento asíncrono de solicitudes
  - Estados de diagnóstico (PENDING/PROCESSING/COMPLETED/FAILED)
  - Sistema de notificaciones automáticas
  - Retry logic para fallos temporales

#### Endpoints del Módulo:
```typescript
POST /api/diagnosis             # Crear prediagnóstico
GET  /api/diagnosis/:id         # Obtener resultados específicos
GET  /api/appointments/:id/diagnosis # Diagnósticos de cita
DELETE /api/diagnosis/:id       # Eliminar diagnóstico
```

#### Integración DeepSeek:
```typescript
// Configuración DeepSeek
interface DeepSeekConfig {
  apiUrl: 'https://api.deepseek.com/v1/chat/completions'
  model: 'deepseek-chat'
  temperature: 0.3  // Para mayor precisión médica
  maxTokens: 1500   // Suficiente para diagnósticos detallados
}

// Prompt especializado para veterinaria
const VETERINARY_PROMPT = `
Eres un asistente de prediagnóstico veterinario especializado.
Analiza los síntomas proporcionados y genera un prediagnóstico estructurado.
Incluye: condiciones posibles, probabilidades, severidad y recomendaciones.
Siempre incluye disclaimer sobre consulta profesional necesaria.
`
```

#### Criterios de Completitud:
- ✅ Integración con DeepSeek funcionando
- ✅ Procesamiento de síntomas descriptivos
- ✅ Generación de prediagnósticos estructurados
- ✅ Sistema de confianza y probabilidades
- ✅ Resultados almacenándose correctamente

### 1.6. Testing y Documentación (2 horas)

#### Estructura de Tests:
```
test/
├── unit/                    # Tests unitarios
│   ├── auth/
│   ├── pets/
│   ├── appointments/
│   ├── medical/
│   └── diagnosis/           # Tests del módulo DeepSeek
├── integration/             # Tests de integración
│   ├── auth.e2e-spec.ts
│   ├── pets.e2e-spec.ts
│   ├── appointments.e2e-spec.ts
│   └── diagnosis.e2e-spec.ts # Tests E2E del prediagnóstico
└── fixtures/                # Datos de prueba
    ├── users.fixture.ts
    ├── pets.fixture.ts
    ├── appointments.fixture.ts
    └── diagnosis.fixture.ts # Datos de prueba para IA
```

#### Cobertura de Tests:
- [x] **Tests unitarios (>85% cobertura)**
  - Servicios de cada módulo
  - Controladores principales
  - Validaciones y transformaciones
  - Integración DeepSeek mockeada

- [x] **Tests de integración**
  - Flujos completos de autenticación
  - CRUD de entidades principales
  - Integración con DeepSeek (con mocks)
  - Flujo completo de prediagnóstico

- [x] **Documentación Swagger**
  - Todos los endpoints documentados
  - Ejemplos de request/response
  - Esquemas de autenticación
  - Documentación específica de prediagnóstico IA

#### Criterios de Completitud:
- ✅ Cobertura de tests >85%
- ✅ Documentación Swagger completa
- ✅ Tests de integración pasando
- ✅ Pipeline CI/CD funcionando

---

## FASE 2: FRONTEND (10 horas)
*Interfaz de usuario integrada con backend*

### 2.1. Configuración e Infraestructura Frontend (2 horas)

#### Estructura del Proyecto Frontend:
```
frontend/
├── src/
│   ├── assets/              # Recursos estáticos
│   ├── components/          # Componentes reutilizables
│   │   ├── common/          # Componentes base
│   │   ├── forms/           # Formularios
│   │   ├── diagnosis/       # Componentes prediagnóstico
│   │   └── layout/          # Layout components
│   ├── views/               # Páginas principales
│   │   ├── auth/            # Páginas de autenticación
│   │   ├── dashboard/       # Dashboards
│   │   ├── pets/            # Gestión de mascotas
│   │   ├── appointments/    # Gestión de citas
│   │   └── diagnosis/       # Diagnósticos IA
│   ├── router/              # Configuración de rutas
│   ├── stores/              # Estado global (Pinia)
│   ├── services/            # Servicios API
│   ├── utils/               # Utilidades
│   ├── composables/         # Composables Vue 3
│   └── types/               # Tipos TypeScript
├── public/
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

#### Tareas Específicas:
- [x] **Configuración Vue 3 + Vite**
  - Instalación y configuración base
  - TypeScript setup
  - Tailwind CSS configuration

- [x] **Configuración de routing**
  - Vue Router con protección de rutas
  - Guards basados en autenticación
  - Rutas anidadas para cada módulo

- [x] **Configuración de estado global**
  - Pinia stores para cada módulo
  - Store de autenticación global
  - Store específico para diagnósticos IA
  - Persistencia de estado en localStorage

#### Criterios de Completitud:
- ✅ Aplicación Vue ejecutándose en puerto 5173
- ✅ Routing funcionando correctamente
- ✅ Comunicación básica con backend API

### 2.2. Sistema de Autenticación Frontend (2 horas)

#### Componentes de Autenticación:
```
components/auth/
├── LoginForm.vue            # Formulario de login
├── RegisterForm.vue         # Formulario de registro
├── PasswordReset.vue        # Reseteo de contraseña
└── ProfileForm.vue          # Edición de perfil

views/auth/
├── LoginView.vue            # Página de login
├── RegisterView.vue         # Página de registro
└── ProfileView.vue          # Página de perfil
```

#### Store de Autenticación:
```typescript
// stores/auth.ts
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  role: UserRole | null
}

interface AuthActions {
  login(credentials: LoginDto): Promise<void>
  register(userData: RegisterDto): Promise<void>
  logout(): void
  refreshToken(): Promise<void>
  updateProfile(data: UpdateProfileDto): Promise<void>
}
```

#### Criterios de Completitud:
- ✅ Login y registro funcionando
- ✅ Protección de rutas por roles
- ✅ Manejo de tokens automático
- ✅ UI intuitiva y responsiva

### 2.3. Gestión de Mascotas (2 horas)

#### Componentes de Mascotas:
```
components/pets/
├── PetCard.vue              # Tarjeta de mascota
├── PetForm.vue              # Formulario CRUD
├── PetList.vue              # Lista de mascotas
├── PetDetails.vue           # Detalles completos
└── MedicalTimeline.vue      # Timeline médico

views/pets/
├── PetsView.vue             # Lista principal
├── PetDetailView.vue        # Detalles de mascota
├── AddPetView.vue           # Añadir mascota
└── EditPetView.vue          # Editar mascota
```

#### Store de Mascotas:
```typescript
// stores/pets.ts
interface PetsState {
  pets: Pet[]
  currentPet: Pet | null
  loading: boolean
  filters: PetFilters
}

interface PetsActions {
  fetchPets(): Promise<void>
  fetchPet(id: number): Promise<void>
  createPet(petData: CreatePetDto): Promise<void>
  updatePet(id: number, petData: UpdatePetDto): Promise<void>
  deletePet(id: number): Promise<void>
}
```

#### Criterios de Completitud:
- ✅ CRUD completo de mascotas
- ✅ Validaciones del lado cliente
- ✅ Interfaz intuitiva para datos médicos
- ✅ Responsive design

### 2.4. Sistema de Citas (2 horas)

#### Componentes de Citas:
```
components/appointments/
├── Calendar.vue             # Calendario interactivo
├── AppointmentForm.vue      # Formulario de cita
├── AppointmentCard.vue      # Tarjeta de cita
├── AvailabilitySelector.vue # Selector de disponibilidad
└── VetSchedule.vue          # Horario del veterinario

views/appointments/
├── AppointmentsView.vue     # Lista de citas
├── CalendarView.vue         # Vista de calendario
├── BookAppointmentView.vue  # Reservar cita
└── AppointmentDetailView.vue # Detalles de cita
```

#### Store de Citas:
```typescript
// stores/appointments.ts
interface AppointmentsState {
  appointments: Appointment[]
  availability: AvailabilitySlot[]
  currentAppointment: Appointment | null
  calendarDate: Date
}

interface AppointmentsActions {
  fetchAppointments(): Promise<void>
  fetchAvailability(vetId: number, date: Date): Promise<void>
  bookAppointment(appointmentData: CreateAppointmentDto): Promise<void>
  updateAppointment(id: number, data: UpdateAppointmentDto): Promise<void>
  cancelAppointment(id: number): Promise<void>
}
```

#### Criterios de Completitud:
- ✅ Calendario interactivo funcionando
- ✅ Disponibilidad en tiempo real
- ✅ Confirmaciones y notificaciones
- ✅ Interfaz clara para selección

### 2.5. Sistema de Prediagnóstico con DeepSeek IA (2 horas)

#### Componentes de Diagnóstico:
```
components/diagnosis/
├── PreDiagnosisModal.vue    # Modal para crear prediagnóstico
├── DiagnosisResultCard.vue  # Tarjeta de resultados
├── DiagnosisProgress.vue    # Progreso de análisis
├── SymptomForm.vue          # Formulario de síntomas
└── ConditionCard.vue        # Tarjeta de condición detectada

views/diagnosis/
├── DiagnosisView.vue        # Vista principal (si aplicable)
├── CreateDiagnosisView.vue  # Crear prediagnóstico
├── ResultsView.vue          # Ver resultados
└── HistoryView.vue          # Historial de diagnósticos
```

#### Store de Diagnóstico:
```typescript
// stores/diagnosis.ts
interface DiagnosisState {
  diagnoses: AIDiagnosis[]
  currentDiagnosis: AIDiagnosis | null
  loading: boolean
  error: string | null
}

interface DiagnosisActions {
  createPreDiagnosis(data: CreateDiagnosisDto): Promise<AIDiagnosis>
  fetchDiagnosis(id: number): Promise<void>
  fetchPetDiagnoses(petId: number): Promise<void>
  deleteDiagnosis(id: number): Promise<void>
  refreshDiagnosis(id: number): Promise<void>
}
```

#### Integración con DeepSeek:
- **Flujo de usuario simplificado**: Solo descripción de síntomas, sin imágenes
- **Formulario intuitivo**: Campos para síntomas, duración, severidad
- **Resultados estructurados**: Condiciones posibles, probabilidades, recomendaciones
- **Polling inteligente**: Actualización automática de estado del diagnóstico
- **UI profesional**: Visualización clara de resultados con disclaimers

#### Criterios de Completitud:
- ✅ Formulario de síntomas funcional
- ✅ Integración completa con backend DeepSeek
- ✅ Visualización profesional de resultados
- ✅ Sistema de polling para estados
- ✅ Disclaimers legales visibles

---

## DEPENDENCIAS ENTRE FASES

### Dependencias Técnicas:
1. **Fase 2 depende completamente de Fase 1**
   - API endpoints implementados y funcionando
   - Autenticación JWT operativa
   - Base de datos con datos de prueba

2. **Servicios externos requeridos para Fase 1**
   - Cuenta DeepSeek API (modelo deepseek-chat)
   - PostgreSQL (Railway gratuito)
   - Almacenamiento de archivos (Railway/Cloudinary gratuito)

### Dependencias de Configuración:
```bash
# Variables de entorno requeridas
DATABASE_URL=postgresql://...
JWT_SECRET=...
DEEPSEEK_API_KEY=...
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL=deepseek-chat
```

---

## CRITERIOS DE COMPLETITUD GLOBAL

### Fase 1 Completada Cuando:
- ✅ Todos los endpoints API funcionando según especificación
- ✅ Tests pasando con cobertura >85%
- ✅ Documentación Swagger actualizada
- ✅ Integración DeepSeek funcionando completamente
- ✅ Despliegue en Railway exitoso

### Fase 2 Completada Cuando:
- ✅ Todas las vistas implementadas y funcionales
- ✅ Integración completa con backend
- ✅ Prediagnóstico IA funcionando end-to-end
- ✅ UI/UX responsiva y accesible
- ✅ Manejo de errores robusto
- ✅ Despliegue frontend en Railway exitoso

### Proyecto Completado Cuando:
- ✅ Flujos end-to-end funcionando
- ✅ Sistema de pre-diagnóstico IA operativo con DeepSeek
- ✅ Gestión completa de citas y mascotas
- ✅ Ambos entornos desplegados y accesibles
- ✅ Documentación técnica completa

---

## CONSIDERACIONES DE COSTOS

### Servicios Gratuitos/Bajo Costo:
- **Railway**: Plan gratuito para desarrollo y testing
- **PostgreSQL**: Incluido en Railway gratuito
- **DeepSeek API**: Modelo altamente eficiente y costo-efectivo
- **GitHub**: Repositorio y CI/CD gratuito

### Estimación de Costos Actuales:
- **Desarrollo**: $0 (servicios gratuitos)
- **Producción**: <$5/mes (Railway básico)
- **DeepSeek API**: ~$1-3/mes según uso (muy económico)
- **Total estimado**: <$10/mes para producción completa

### Ventajas de DeepSeek vs Imagga:
- **Costo**: Significativamente más económico que Imagga
- **Versatilidad**: Mejor comprensión de contexto y síntomas descriptivos
- **Precisión**: Resultados más detallados y estructurados
- **Escalabilidad**: Mejor manejo de volumen y complejidad
- **Mantenimiento**: Menor necesidad de procesamiento de imágenes

Este plan estructura el desarrollo de manera eficiente, asegurando una base sólida antes de construir la interfaz de usuario, manteniendo costos mínimos y siguiendo las especificaciones técnicas definidas en el readme.md, ahora con la integración exitosa de DeepSeek para prediagnósticos veterinarios inteligentes. 