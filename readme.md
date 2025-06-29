## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Ficha del proyecto

### **0.1. Tu nombre completo:** Simón Ramirez Guarumo

### **0.2. Nombre del proyecto:** VetAI Connect

### **0.3. Descripción breve del proyecto:**

VetAI Connect es un sistema web innovador para la gestión integral de clínicas veterinarias, con un enfoque particular en la incorporación de inteligencia artificial para prediagnósticos veterinarios automatizados.

El sistema busca modernizar la gestión de clínicas veterinarias mediante una plataforma web que conecte a dueños de mascotas con veterinarios, facilitando la programación de citas, el seguimiento de historiales clínicos y, como elemento diferenciador, ofreciendo capacidades de prediagnóstico basadas en **DeepSeek AI**, permitiendo análisis inteligente de síntomas descritos por los dueños de mascotas antes de las consultas presenciales.

### **0.4. URL del proyecto desplegado:**

- **Frontend:** https://frontend-vuejs-production.up.railway.app/
- **Backend API:** https://backend-nestjs-production-4eba.up.railway.app/api

### **0.5. URL o archivo comprimido del repositorio:**

https://github.com/SimonRG04/AI4Devs-finalproject-SRG

### **0.6. Entornos de la aplicación:**

#### Entorno de Producción
- **Frontend:** https://frontend-vuejs-production.up.railway.app/
- **Backend API:** https://backend-nestjs-production-4eba.up.railway.app/api

#### Entorno de Desarrollo (Local)
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api

---

## 1. Descripción general del producto

### **1.1. Objetivo:**

VetAI Connect tiene como objetivo principal modernizar y optimizar la gestión de clínicas veterinarias mediante una plataforma digital integrada. El sistema busca resolver los siguientes problemas:

1. **Ineficiencia en la gestión de citas**: Reemplazar sistemas manuales o desactualizados con un sistema digital fluido.
2. **Fragmentación de historiales clínicos**: Centralizar toda la información médica de las mascotas.
3. **Comunicación limitada entre dueños y veterinarios**: Crear un canal directo y efectivo.
4. **Diagnósticos tardíos**: Implementar pre-diagnóstico mediante IA para detectar condiciones visibles antes de la consulta.

Los beneficiarios principales son:
- **Clínicas veterinarias**: Mejora en eficiencia operativa y calidad de servicio.
- **Veterinarios**: Acceso rápido a historiales y preparación anticipada para consultas.
- **Dueños de mascotas**: Mayor facilidad para gestionar citas y seguimiento de salud.
- **Mascotas**: Atención más rápida y efectiva gracias a la preparación previa del veterinario.

### **1.2. Características y funcionalidades principales:**

1. **Sistema de Gestión de Usuarios**
   - Registro e inicio de sesión diferenciado (clientes/veterinarios/administradores)
   - Perfiles personalizados con información relevante
   - Panel de administración para gestión de personal

2. **Gestión Integral de Mascotas**
   - Registro completo de mascotas con datos médicos relevantes
   - Seguimiento de vacunas y tratamientos
   - Alertas para recordatorios de medicación o vacunación

3. **Sistema de Citas Inteligente**
   - Calendario interactivo con disponibilidad en tiempo real
   - Confirmaciones y recordatorios automáticos
   - Opciones de reprogramación y cancelación
   - Historial de visitas previas

4. **Historiales Clínicos Digitales**
   - Registro completo de cada consulta
   - Seguimiento de evolución de tratamientos
   - Subida y almacenamiento de pruebas y resultados
   - Compartición segura entre veterinarios

5. **Prediagnóstico mediante DeepSeek AI**
   - Análisis inteligente de síntomas descritos por el dueño
   - Evaluación de severidad y duración de condiciones
   - Generación de prediagnósticos estructurados con probabilidades
   - Recomendaciones automáticas personalizadas
   - Informe completo disponible para el veterinario antes de la consulta

6. **Comunicación Integrada**
   - Notificaciones automáticas sobre resultados y citas
   - Mensajería directa entre clientes y veterinarios
   - Envío de instrucciones post-consulta

### **1.3. Diseño y experiencia de usuario:**

El diseño de VetAI Connect sigue los principios de simplicidad, accesibilidad y orientación a tareas, adaptándose tanto a usuarios técnicos (veterinarios) como no técnicos (dueños de mascotas).

#### Flujo de usuario principal - Cliente:

1. **Registro e inicio**: Proceso simplificado con verificación de email.
2. **Dashboard principal**: Visión general de mascotas, próximas citas y notificaciones.
3. **Gestión de mascotas**: Interfaz intuitiva para añadir/editar mascotas y visualizar historiales.
4. **Reserva de citas**: Calendario interactivo con selección de fecha, hora y veterinario.
5. **Prediagnóstico DeepSeek AI**: Formulario intuitivo para describir síntomas con guías contextuales.
6. **Seguimiento**: Visualización de resultados estructurados y recomendaciones personalizadas.

#### Flujo de usuario principal - Veterinario:

1. **Dashboard profesional**: Agenda diaria, casos pendientes y alertas.
2. **Gestión de citas**: Vista de calendario con detalles de pacientes.
3. **Revisión de historiales**: Interfaz médica con acceso rápido a datos relevantes.
4. **Consulta de prediagnósticos**: Visualización de análisis DeepSeek AI con síntomas y contexto originales.
5. **Registro de consultas**: Formularios médicos optimizados para entrada rápida de datos.

#### Características visuales:

- **Paleta de colores**: Tonos azules y verdes que transmiten profesionalidad y tranquilidad.
- **Tipografía**: Clara y legible, optimizada para todas las edades.
- **Navegación**: Intuitiva con categorización lógica de funciones.
- **Responsive design**: Adaptado a dispositivos móviles y de escritorio.

### **1.4. Instrucciones de instalación:**

#### Prerrequisitos
- Node.js (v14 o superior)
- npm (v6 o superior)
- PostgreSQL (v12 o superior)
- Git

#### Instalación del Backend (NestJS)

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/SimonRG04/AI4Devs-finalproject-SRG
   cd vetai-connect/backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con credenciales de base de datos y API keys
   ```

4. Configurar la base de datos:
   ```bash
   # Crear base de datos en PostgreSQL
   createdb vetai_connect
   
   # Ejecutar migraciones
   npm run migration:run
   
   # Cargar datos iniciales (opcional)
   npm run seed
   ```

5. Iniciar el servidor:
   ```bash
   npm run start:dev
   ```

#### Instalación del Frontend (VueJS)

1. Navegar al directorio del frontend:
   ```bash
   cd ../frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con URL del backend y configuraciones
   ```

4. Iniciar servidor de desarrollo:
   ```bash
   npm run serve
   ```

#### Verificación de instalación

1. **Entorno de desarrollo local:**
   - Backend disponible en: http://localhost:3000/api
   - Frontend disponible en: http://localhost:8080
   - Documentación API: http://localhost:3000/api-docs

2. **Entorno de producción desplegado:**
   - Backend disponible en: https://backend-nestjs-production-4eba.up.railway.app/api
   - Frontend disponible en: https://frontend-vuejs-production.up.railway.app/
   - Documentación API: https://backend-nestjs-production-4eba.up.railway.app/api-docs

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

VetAI Connect implementa una arquitectura cliente-servidor basada en microservicios, con separación clara de responsabilidades entre frontend y backend, y comunicación vía API RESTful.

```mermaid
graph TB
    subgraph "Frontend (VueJS)"
        UI[Interfaz de Usuario]
        STATE[Gestión de Estado - Pinia]
        API_CLIENT[Cliente HTTP - Axios]
        ROUTER[Vue Router]
    end
    
    subgraph "Backend (NestJS)"
        API_GATEWAY[API Gateway]
        AUTH[Módulo de Autenticación]
        USERS[Módulo de Usuarios]
        PETS[Módulo de Mascotas]
        APPOINTMENTS[Módulo de Citas]
        MEDICAL[Módulo de Historiales]
        AI_MODULE[Módulo de IA]
    end
    
    subgraph "Base de Datos"
        POSTGRES[PostgreSQL]
    end
    
    subgraph "Servicios Externos"
        AI_API[API de Análisis de Imágenes]
        STORAGE[Almacenamiento de Objetos]
        EMAIL[Servicio de Email]
    end
    
    UI --> STATE
    STATE --> API_CLIENT
    UI --> ROUTER
    
    API_CLIENT --> API_GATEWAY
    
    API_GATEWAY --> AUTH
    API_GATEWAY --> USERS
    API_GATEWAY --> PETS
    API_GATEWAY --> APPOINTMENTS
    API_GATEWAY --> MEDICAL
    API_GATEWAY --> AI_MODULE
    
    AUTH --> POSTGRES
    USERS --> POSTGRES
    PETS --> POSTGRES
    APPOINTMENTS --> POSTGRES
    MEDICAL --> POSTGRES
    
    AI_MODULE --> AI_API
    MEDICAL --> STORAGE
    API_GATEWAY --> EMAIL
```

#### Justificación:

- **Patrón MVC extendido**: Separación clara entre presentación (Vue), lógica de negocio (NestJS) y datos (PostgreSQL).
- **Arquitectura de microservicios ligera**: Módulos independientes pero dentro de un monolito para simplificar el despliegue inicial.
- **API RESTful**: Interfaces bien definidas entre frontend y backend para facilitar evolución independiente.
- **Stateless backend**: Autenticación por JWT para escalabilidad horizontal.

#### Flujo de datos para prediagnóstico DeepSeek AI:

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant B as Backend
    participant DS as DeepSeek API
    participant DB as Base de Datos
    
    C->>F: Describe síntomas de la mascota
    F->>F: Validación inicial de campos
    F->>B: POST /api/diagnosis (síntomas, mascota, contexto)
    B->>B: Validación y estructuración de datos
    B->>DS: Envía prompt estructurado con síntomas
    DS->>DS: Análisis con modelo deepseek-chat
    DS->>B: Devuelve prediagnóstico estructurado
    B->>B: Procesa y valida resultados JSON
    B->>DB: Almacena diagnóstico completo
    B->>F: Respuesta con ID y resultados
    F->>C: Muestra prediagnóstico detallado
```

#### Consideraciones de seguridad:

- **Autenticación**: JWT con rotación de tokens y lista de revocación.
- **Autorización**: RBAC (Control de Acceso Basado en Roles) granular.
- **Datos sensibles**: Encriptación en tránsito (HTTPS) y en reposo para datos médicos.
- **Validación**: Sanitización estricta de inputs para prevenir inyecciones.
- **Auditoría**: Logging detallado de acciones críticas con timestamps.

### **2.2. Descripción de componentes principales:**

#### Frontend (VueJS)

El frontend utiliza Vue 3 con Composition API para una arquitectura basada en componentes reactivos:

- **UI Framework**: Tailwind CSS para diseño responsivo y consistente
- **Gestión de estado**: Pinia para estado global con tiendas modularizadas
- **Routing**: Vue Router con protección de rutas basada en roles
- **Comunicación API**: Axios con interceptores para manejo de tokens y errores
- **Validación**: Vuelidate para validación de formularios del lado del cliente
- **Componentes**: Organización por funcionalidad y nivel de abstracción

Ejemplo de arquitectura de componentes:

```
├── components/
│   ├── common/           # Componentes reutilizables
│   │   ├── assets/          # Recursos (imágenes, fuentes, etc.)
│   │   │   ├── assets/      # Recursos (imágenes, fuentes, etc.)
│   │   │   ├── components/  # Componentes Vue reutilizables
│   │   │   ├── views/       # Páginas y vistas
│   │   │   ├── router/      # Configuración de rutas
│   │   │   ├── stores/      # Tiendas Pinia (estado global)
│   │   │   ├── services/    # Servicios y comunicación API
│   │   │   ├── utils/       # Utilidades y helpers
│   │   │   ├── locales/     # Traducciones
│   │   │   ├── App.vue      # Componente raíz
│   │   │   └── main.js      # Punto de entrada
│   │   ├── tests/           # Tests unitarios y E2E
│   │   ├── .eslintrc.js     # Configuración de linter
│   │   └── package.json     # Dependencias frontend
│   ├── backend/             # API NestJS
│   │   ├── src/
│   │   │   ├── config/      # Configuraciones
│   │   │   ├── modules/     # Módulos funcionales
│   │   │   │   ├── auth/    # Autenticación y autorización
│   │   │   │   ├── users/   # Gestión de usuarios
│   │   │   │   ├── pets/    # Gestión de mascotas
│   │   │   │   ├── appointments/ # Sistema de citas
│   │   │   │   ├── medical/   # Historiales médicos
│   │   │   │   ├── diagnosis/   # Integración con IA
│   │   │   │   └── notifications/ # Sistema de notificaciones
│   │   │   ├── shared/        # Código compartido
│   │   │   │   ├── dto/       # Objetos de transferencia
│   │   │   │   ├── interfaces/  # Interfaces y tipos
│   │   │   │   ├── guards/      # Protección de rutas
│   │   │   │   ├── pipes/       # Transformación y validación
│   │   │   │   └── decorators/  # Decoradores personalizados
│   │   │   ├── app.module.ts    # Módulo principal
│   │   │   └── main.ts          # Punto de entrada
│   │   ├── test/              # Tests (unitarios e integración)
│   │   ├── migrations/        # Migraciones de base de datos
│   │   ├── seeds/             # Datos iniciales
│   │   ├── .eslintrc.js       # Configuración de linter
│   │   └── package.json       # Dependencias backend
│   ├── docs/                # Documentación
│   ├── docker/              # Configuración Docker
│   ├── .github/             # CI/CD workflows
│   └── README.md            # Documentación principal
```

### **2.4. Infraestructura y despliegue**

VetAI Connect utiliza una arquitectura de despliegue basada en contenedores con servicios cloud:

```mermaid
graph TB
    subgraph "Infraestructura"
        subgraph "Desarrollo"
            LOCAL[Entorno Local]
            GIT[Repositorio Git]
        end
        
        subgraph "CI/CD"
            GH_ACTIONS[GitHub Actions]
            TESTS[Tests Automatizados]
            BUILD[Build y Empaquetado]
        end
        
        subgraph "Producción"
            subgraph "Frontend"
                NETLIFY[Netlify CDN]
            end
            
            subgraph "Backend"
                RAILWAY[Railway PaaS]
                API[API NestJS]
            end
            
            subgraph "Datos"
                DB[PostgreSQL]
                S3[AWS S3 / Cloudinary]
            end
            
            subgraph "Servicios"
                SENDGRID[SendGrid Email]
                IMAGGA[Imagga API]
                MONITORING[Sentry]
            end
        end
        
        LOCAL --> GIT
        GIT --> GH_ACTIONS
        GH_ACTIONS --> TESTS
        TESTS --> BUILD
        BUILD --> NETLIFY
        BUILD --> RAILWAY
        API --> DB
        API --> S3
        API --> SENDGRID
        API --> IMAGGA
        API --> MONITORING
        NETLIFY --> API
    end
```

**Proceso de despliegue automatizado**:

1. **Desarrollo**:
   - Desarrollo local con Docker Compose
   - Commit y push a repositorio Git

2. **CI/CD** (GitHub Actions):
   - Ejecución de tests automatizados
   - Análisis de código estático
   - Construcción de imágenes Docker
   - Despliegue a entornos correspondientes

3. **Entornos**:
   - Desarrollo: Despliegue automático en rama de desarrollo
   - Staging: Despliegue automático desde rama de staging
   - Producción: Despliegue manual desde rama principal

### **2.5. Seguridad**

VetAI Connect implementa múltiples capas de seguridad:

1. **Autenticación y Autorización**:
   - Sistema JWT completo con tokens de acceso/refresco
   - Control de acceso granular basado en roles (RBAC)
   - Protección contra sesiones robadas mediante rotación de tokens

2. **Protección de datos**:
   - HTTPS obligatorio en todas las comunicaciones
   - Encriptación de datos sensibles en la base de datos
   - Sanitización de inputs para prevenir inyecciones

3. **Validación y sanitización**:
   - Validación estricta de todos los inputs en frontend y backend
   - Protección contra XSS mediante escape automático
   - Limitación de intentos de login para prevenir ataques de fuerza bruta

4. **Acceso a la API**:
   - Rate limiting para prevenir abusos
   - Validación de origen de peticiones
   - Headers de seguridad (CORS, CSP, etc.)

5. **Auditoría y monitoreo**:
   - Registro detallado de operaciones sensibles
   - Monitoreo de patrones de acceso sospechosos
   - Alertas automáticas ante comportamientos anómalos

### **2.6. Tests**

La estrategia de testing se enfoca en cobertura efectiva de componentes críticos:

1. **Tests unitarios**:
   - **Frontend**: Componentes core, stores y servicios principales
   - **Backend**: Servicios, controladores y lógica de negocio

2. **Tests de integración**:
   - Comunicación entre módulos del backend
   - Interacción con la base de datos
   - Flujos completos de autenticación y autorización

3. **Tests end-to-end**:
   - Flujos críticos de usuario (registro, login, citas)
   - Escenarios de pre-diagnóstico IA
   - Generación y visualización de historiales médicos

4. **Tests de rendimiento**:
   - Carga para endpoints críticos
   - Tiempos de respuesta en operaciones frecuentes
   - Capacidad de procesamiento de imágenes

**Ejemplo de test unitario** (backend):

```typescript
describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repository: MockType<Repository<Appointment>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    repository = module.get(getRepositoryToken(Appointment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find available slots', async () => {
    const date = new Date('2023-05-15');
    const vetId = 1;
    const mockSlots = [{ time: '09:00' }, { time: '10:00' }];
    
    repository.find.mockReturnValue([]);
    repository.query.mockReturnValue(mockSlots);
    
    const result = await service.findAvailableSlots(date, vetId);
    expect(result).toEqual(mockSlots);
    expect(repository.query).toHaveBeenCalled();
  });
});
```

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string password
        string firstName
        string lastName
        string phoneNumber
        enum role "CLIENT|VET|ADMIN"
        datetime createdAt
        datetime updatedAt
    }
    
    VETERINARIANS {
        int id PK
        int userId FK
        string specialization
        text bio
        string licenseNumber UK
        json availabilityHours
        datetime createdAt
        datetime updatedAt
    }
    
    CLIENTS {
        int id PK
        int userId FK
        string address
        datetime createdAt
        datetime updatedAt
    }
    
    PETS {
        int id PK
        int clientId FK
        string name
        enum species
        string breed
        date birthDate
        enum gender "MALE|FEMALE|UNKNOWN"
        float weight
        text medicalAlerts
        datetime createdAt
        datetime updatedAt
    }
    
    APPOINTMENTS {
        int id PK
        int petId FK
        int veterinarianId FK
        datetime dateTime
        enum status "SCHEDULED|COMPLETED|CANCELLED|MISSED"
        string reason
        datetime createdAt
        datetime updatedAt
    }
    
    MEDICAL_RECORDS {
        int id PK
        int appointmentId FK
        text diagnosis
        text treatment
        text notes
        datetime createdAt
        datetime updatedAt
    }
    
    PRESCRIPTIONS {
        int id PK
        int medicalRecordId FK
        string medication
        string dosage
        string frequency
        date startDate
        date endDate
        datetime createdAt
        datetime updatedAt
    }
    
    VACCINATIONS {
        int id PK
        int petId FK
        string vaccineName
        date administrationDate
        date expirationDate
        string batchNumber
        int administeredBy FK
        datetime createdAt
        datetime updatedAt
    }
    
    AI_DIAGNOSES {
        int id PK
        int petId FK
        int appointmentId FK
        string symptoms
        string duration
        string severity
        string additionalInfo
        json results
        float confidence
        enum status "PENDING|PROCESSING|COMPLETED|FAILED"
        string errorMessage
        datetime processedAt
        datetime createdAt
        datetime updatedAt
    }
    
    ATTACHMENTS {
        int id PK
        int medicalRecordId FK
        string fileName
        string fileUrl
        string fileType
        int fileSize
        datetime createdAt
        datetime updatedAt
    }
    
    NOTIFICATIONS {
        int id PK
        int userId FK
        string title
        text content
        boolean read
        string type
        datetime createdAt
        datetime updatedAt
    }
    
    USERS ||--o{ VETERINARIANS : "profile"
    USERS ||--o{ CLIENTS : "profile"
    CLIENTS ||--o{ PETS : "owns"
    PETS ||--o{ APPOINTMENTS : "scheduled_for"
    VETERINARIANS ||--o{ APPOINTMENTS : "assigned_to"
    APPOINTMENTS ||--o{ MEDICAL_RECORDS : "generates"
    MEDICAL_RECORDS ||--o{ PRESCRIPTIONS : "includes"
    MEDICAL_RECORDS ||--o{ ATTACHMENTS : "contains"
    PETS ||--o{ VACCINATIONS : "received"
    VETERINARIANS ||--o{ VACCINATIONS : "administered_by"
    PETS ||--o{ AI_DIAGNOSES : "analyzed_for"
    APPOINTMENTS ||--o{ AI_DIAGNOSES : "associated_with"
    USERS ||--o{ NOTIFICATIONS : "receives"
```

### **3.2. Descripción de entidades principales:**

#### 1. USERS
Almacena información básica de todos los usuarios del sistema, independiente de su rol.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| email | VARCHAR(255) | Correo electrónico | UNIQUE, NOT NULL |
| password | VARCHAR(255) | Contraseña encriptada | NOT NULL |
| firstName | VARCHAR(100) | Nombre | NOT NULL |
| lastName | VARCHAR(100) | Apellido | NOT NULL |
| phoneNumber | VARCHAR(20) | Número telefónico | |
| role | ENUM | Rol del usuario | 'CLIENT', 'VET', 'ADMIN', NOT NULL |
| createdAt | TIMESTAMP | Fecha de creación | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | Fecha de última actualización | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### 2. VETERINARIANS
Información específica para usuarios con rol 'VET'.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| userId | INT | Referencia a usuario | FK → USERS.id, NOT NULL |
| specialization | VARCHAR(100) | Especialidad veterinaria | |
| bio | TEXT | Biografía profesional | |
| licenseNumber | VARCHAR(50) | Número de licencia profesional | UNIQUE, NOT NULL |
| availabilityHours | JSON | Horario de disponibilidad semanal | NOT NULL |
| createdAt | TIMESTAMP | Fecha de creación | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | Fecha de última actualización | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### 3. CLIENTS
Información específica para usuarios con rol 'CLIENT'.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| userId | INT | Referencia a usuario | FK → USERS.id, NOT NULL |
| address | VARCHAR(255) | Dirección física | |
| createdAt | TIMESTAMP | Fecha de creación | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | Fecha de última actualización | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### 4. PETS
Información sobre las mascotas registradas en el sistema.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| clientId | INT | Propietario de la mascota | FK → CLIENTS.id, NOT NULL |
| name | VARCHAR(100) | Nombre de la mascota | NOT NULL |
| species | VARCHAR(50) | Especie | NOT NULL |
| breed | VARCHAR(100) | Raza | |
| birthDate | DATE | Fecha de nacimiento | |
| gender | ENUM | Género | 'MALE', 'FEMALE', 'UNKNOWN', NOT NULL |
| weight | FLOAT | Peso en kg | |
| medicalAlerts | TEXT | Alertas médicas (alergias, etc.) | |
| createdAt | TIMESTAMP | Fecha de creación | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | Fecha de última actualización | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### 5. APPOINTMENTS
Registro de citas programadas entre mascotas y veterinarios.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| petId | INT | Mascota | FK → PETS.id, NOT NULL |
| veterinarianId | INT | Veterinario asignado | FK → VETERINARIANS.id, NOT NULL |
| dateTime | DATETIME | Fecha y hora de la cita | NOT NULL |
| status | ENUM | Estado de la cita | 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED', NOT NULL |
| reason | VARCHAR(255) | Motivo de la consulta | NOT NULL |
| createdAt | TIMESTAMP | Fecha de creación | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | Fecha de última actualización | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### 6. MEDICAL_RECORDS
Registros médicos generados durante las consultas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| appointmentId | INT | Cita relacionada | FK → APPOINTMENTS.id, NOT NULL |
| diagnosis | TEXT | Diagnóstico médico | NOT NULL |
| treatment | TEXT | Tratamiento prescrito | |
| notes | TEXT | Notas adicionales | |
| createdAt | TIMESTAMP | Fecha de creación | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | Fecha de última actualización | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

#### 7. AI_DIAGNOSES
Resultados de prediagnósticos generados por DeepSeek AI.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| petId | INT | Mascota analizada | FK → PETS.id, NOT NULL |
| appointmentId | INT | Cita asociada | FK → APPOINTMENTS.id |
| symptoms | TEXT | Descripción de síntomas | NOT NULL |
| duration | VARCHAR(100) | Duración de los síntomas | |
| severity | ENUM | Severidad percibida | 'mild', 'moderate', 'severe' |
| additionalInfo | TEXT | Información adicional | |
| results | JSON | Resultados del análisis DeepSeek | NOT NULL |
| confidence | VARCHAR(10) | Nivel de confianza como string | |
| status | ENUM | Estado del diagnóstico | 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', NOT NULL |
| errorMessage | TEXT | Mensaje de error si falla | |
| processedAt | TIMESTAMP | Fecha de procesamiento | |
| createdAt | TIMESTAMP | Fecha de creación | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | Fecha de última actualización | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

---

## 4. Especificación de la API

La API de VetAI Connect sigue principios RESTful y está documentada siguiendo el estándar OpenAPI (Swagger). A continuación se detallan los endpoints principales organizados por recursos.

### URLs de la API

- **Producción**: https://backend-nestjs-production-4eba.up.railway.app/api
- **Desarrollo local**: http://localhost:3000/api

### Autenticación

```yaml
openapi: 3.0.0
paths:
  /api/auth/login:
    post:
      summary: Iniciar sesión de usuario
      tags:
        - Auth
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  format: password
              required:
                - email
                - password
      responses:
        '200':
          description: Inicio de sesión exitoso
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken:
                    type: string
                  refreshToken:
                    type: string
                  user:
                    type: object
                    properties:
                      id:
                        type: integer
                      email:
                        type: string
                      role:
                        type: string
                        enum: [CLIENT, VET, ADMIN]
        '401':
          description: Credenciales inválidas
  
  /api/auth/register:
    post:
      summary: Registrar nuevo usuario cliente
      tags:
        - Auth
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  format: password
                firstName:
                  type: string
                lastName:
                  type: string
                phoneNumber:
                  type: string
                address:
                  type: string
              required:
                - email
                - password
                - firstName
                - lastName
      responses:
        '201':
          description: Usuario creado exitosamente
        '400':
          description: Datos inválidos o email ya en uso
```

### Gestión de Mascotas

```yaml
openapi: 3.0.0
paths:
  /api/pets:
    get:
      summary: Obtener todas las mascotas del cliente actual
      tags:
        - Pets
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Lista de mascotas
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
    
    post:
      summary: Registrar nueva mascota
      tags:
        - Pets
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePetDto'
      responses:
        '201':
          description: Mascota creada exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Datos inválidos

  /api/pets/{id}:
    get:
      summary: Obtener detalles de una mascota específica
      tags:
        - Pets
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Detalles de la mascota
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
        '404':
          description: Mascota no encontrada

components:
  schemas:
    Pet:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        species:
          type: string
        breed:
          type: string
        birthDate:
          type: string
          format: date
        gender:
          type: string
          enum: [MALE, FEMALE, UNKNOWN]
        weight:
          type: number
        medicalAlerts:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    
    CreatePetDto:
      type: object
      properties:
        name:
          type: string
        species:
          type: string
        breed:
          type: string
        birthDate:
          type: string
          format: date
        gender:
          type: string
          enum: [MALE, FEMALE, UNKNOWN]
        weight:
          type: number
        medicalAlerts:
          type: string
      required:
        - name
        - species
        - gender
```

### Prediagnóstico con DeepSeek AI

```yaml
openapi: 3.0.0
paths:
  /api/diagnosis:
    post:
      summary: Crear prediagnóstico con DeepSeek AI
      description: Analiza síntomas descritos y genera prediagnóstico veterinario
      tags:
        - AI Diagnosis
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                petId:
                  type: integer
                  description: ID de la mascota
                appointmentId:
                  type: integer
                  description: ID de la cita asociada (opcional)
                symptoms:
                  type: string
                  description: Descripción detallada de los síntomas
                duration:
                  type: string
                  description: Duración de los síntomas
                severity:
                  type: string
                  enum: [mild, moderate, severe]
                  description: Severidad percibida
                additionalInfo:
                  type: string
                  description: Información adicional relevante
              required:
                - petId
                - symptoms
      responses:
        '201':
          description: Prediagnóstico creado y en procesamiento
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    description: ID del diagnóstico
                  status:
                    type: string
                    enum: [PENDING, PROCESSING]
        '400':
          description: Datos inválidos
  
  /api/diagnosis/{id}:
    get:
      summary: Obtener resultados de un análisis
      tags:
        - AI Diagnosis
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Resultados del análisis
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  petId:
                    type: integer
                  imageUrl:
                    type: string
                  results:
                    type: object
                    properties:
                      conditions:
                        type: array
                        items:
                          type: object
                          properties:
                            name:
                              type: string
                            probability:
                              type: number
                            description:
                              type: string
                            severity:
                              type: string
                      recommendations:
                        type: array
                        items:
                          type: string
                      confidence:
                        type: number
                      metadata:
                        type: object
                        properties:
                          urgencyLevel:
                            type: string
                          disclaimer:
                            type: string
                  confidence:
                    type: string
                  status:
                    type: string
                    enum: [PENDING, PROCESSING, COMPLETED, FAILED]
                  createdAt:
                    type: string
                    format: date-time
        '404':
          description: Diagnóstico no encontrado
```

**Ejemplo de Petición - Autenticación:**

```bash
curl -X POST https://api.vetai-connect.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@ejemplo.com",
    "password": "contraseña123"
  }'
```

**Ejemplo de Respuesta - Autenticación:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "cliente@ejemplo.com",
    "role": "CLIENT",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

**Ejemplo de Petición - Prediagnóstico con DeepSeek AI:**

```bash
curl -X POST https://api.vetai-connect.com/api/diagnosis \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "petId": 5,
    "appointmentId": 12,
    "symptoms": "Mi perro ha estado vomitando desde ayer por la noche. No quiere comer y se ve muy decaído.",
    "duration": "24 horas",
    "severity": "moderate",
    "additionalInfo": "Ayer comió algo en el parque que no debería haber comido."
  }'
```

**Ejemplo de Respuesta - Prediagnóstico con DeepSeek AI:**

```json
{
  "id": 42,
  "status": "PROCESSING",
  "message": "El prediagnóstico está siendo procesado por DeepSeek AI. Los resultados estarán disponibles en breve."
}
```

La API completa incluye más de 30 endpoints adicionales que cubren todas las funcionalidades del sistema, incluyendo gestión de citas, historiales médicos, notificaciones y administración del sistema.

---

## 5. Historias de Usuario

### Historia de Usuario 1: Registro de mascota con información médica relevante

**Título**: Registro de mascota con información médica relevante

**Como** dueño de mascota,  
**Quiero** registrar a mi mascota en el sistema con toda su información médica relevante,  
**Para** que los veterinarios tengan acceso a su historial completo durante las consultas.

**Criterios de aceptación**:

1. **DADO** que soy un usuario autenticado con rol de cliente,  
   **CUANDO** accedo a la sección "Mis Mascotas" y hago clic en "Añadir Mascota",  
   **ENTONCES** debo ver un formulario de registro con los siguientes campos:
   - Nombre (obligatorio)
   - Especie (obligatorio, selección de lista predefinida)
   - Raza (opcional, con autocompletado según especie)
   - Fecha de nacimiento (opcional, con selector de calendario)
   - Género (obligatorio, opciones: Macho, Hembra, Desconocido)
   - Peso (opcional, en kg)
   - Foto (opcional, con vista previa)
   - Condiciones médicas preexistentes (opcional, campo de texto)
   - Alergias conocidas (opcional, campo de texto)
   - Medicación actual (opcional, campo de texto)

2. **DADO** que estoy llenando el formulario de registro de mascota,  
   **CUANDO** completo todos los campos obligatorios y presiono "Guardar",  
   **ENTONCES** el sistema debe crear un perfil para mi mascota y mostrar un mensaje de confirmación.

3. **DADO** que he registrado una mascota,  
   **CUANDO** accedo a su perfil,  
   **ENTONCES** debo poder ver toda la información registrada y tener opciones para editarla o complementarla.

4. **DADO** que he registrado una mascota,  
   **CUANDO** programo una cita con un veterinario,  
   **ENTONCES** la información médica relevante debe estar disponible para el profesional.

**Prioridad**: Must have

**Estimación**: 3 horas

### Historia de Usuario 2: Solicitud de prediagnóstico mediante DeepSeek AI

**Título**: Solicitud de prediagnóstico mediante DeepSeek AI basado en síntomas

**Como** dueño de mascota,  
**Quiero** describir los síntomas que observo en mi mascota antes de una cita,  
**Para** obtener un prediagnóstico preliminar que ayude al veterinario a prepararse.

**Criterios de aceptación**:

1. **DADO** que tengo una cita programada,  
   **CUANDO** accedo a los detalles de la cita,  
   **ENTONCES** debo ver una opción para "Solicitar prediagnóstico con IA".

2. **DADO** que he seleccionado la opción de prediagnóstico,  
   **CUANDO** se me presente el formulario,  
   **ENTONCES** debo poder:
   - Describir detalladamente los síntomas observados (obligatorio)
   - Especificar la duración de los síntomas
   - Indicar la severidad percibida (leve, moderada, severa)
   - Añadir información adicional relevante
   - Ver advertencias claras sobre las limitaciones del prediagnóstico con IA

3. **DADO** que he completado la descripción de síntomas,  
   **CUANDO** presiono "Solicitar prediagnóstico",  
   **ENTONCES** debe iniciarse el procesamiento con DeepSeek AI y mostrarme una pantalla de espera con indicación de progreso.

4. **DADO** que el análisis ha sido completado,  
   **CUANDO** recibo los resultados,  
   **ENTONCES** debo ver:
   - Condiciones posibles identificadas con nivel de probabilidad y severidad
   - Recomendaciones específicas y personalizadas
   - Nivel de urgencia sugerido
   - Disclaimer claro sobre que esto no reemplaza el diagnóstico profesional
   - Confirmación de que estos resultados ya están disponibles para el veterinario

5. **DADO** que he recibido un prediagnóstico,  
   **CUANDO** asisto a mi cita,  
   **ENTONCES** el veterinario debe tener acceso a los síntomas descritos y resultados del análisis DeepSeek.

**Prioridad**: Should have

**Estimación**: 5 horas

### Historia de Usuario 3: Gestión de agenda y atención de pacientes para veterinarios

**Título**: Gestión de agenda y atención de pacientes para veterinarios

**Como** veterinario,  
**Quiero** tener una interfaz centralizada para gestionar mi agenda y pacientes del día,  
**Para** optimizar mi tiempo y ofrecer atención de calidad.

**Criterios de aceptación**:

1. **DADO** que soy un usuario autenticado con rol de veterinario,  
   **CUANDO** accedo a mi dashboard,  
   **ENTONCES** debo ver inmediatamente:
   - Citas programadas para hoy (con estado y hora)
   - Próxima cita destacada con temporizador de cuenta regresiva
   - Alertas sobre prediagnósticos DeepSeek AI pendientes de revisión
   - Resumen de pacientes atendidos/pendientes

2. **DADO** que estoy en mi dashboard,  
   **CUANDO** selecciono una cita,  
   **ENTONCES** debo ver inmediatamente:
   - Información completa del paciente (mascota)
   - Historial médico relevante
   - Prediagnósticos DeepSeek AI si existen
   - Botón para iniciar consulta

3. **DADO** que estoy realizando una consulta,  
   **CUANDO** accedo a la interfaz de registro médico,  
   **ENTONCES** debo poder:
   - Registrar diagnóstico, tratamiento y notas
   - Ver y comentar sobre prediagnósticos DeepSeek AI
   - Cargar imágenes o documentos adicionales
   - Generar prescripciones
   - Programar seguimiento o próxima visita

4. **DADO** que he completado una consulta,  
   **CUANDO** finalizo el registro médico,  
   **ENTONCES** el sistema debe marcar la cita como completada, notificar al cliente y actualizar mi agenda.

5. **DADO** que necesito ajustar mi disponibilidad,  
   **CUANDO** accedo a la sección de "Mi horario",  
   **ENTONCES** debo poder definir días y horas disponibles para citas futuras.

**Prioridad**: Must have

**Estimación**: 6 horas

---

## 6. Tickets de Trabajo

### Ticket 1: Implementación del componente de prediagnóstico DeepSeek AI en el frontend

**Título**: Implementación del componente de prediagnóstico DeepSeek AI en el frontend

**Descripción**:  
Desarrollar los componentes de interfaz de usuario en VueJS necesarios para permitir a los usuarios describir síntomas de sus mascotas, solicitar análisis de DeepSeek AI, y visualizar los resultados del prediagnóstico.

**Tareas técnicas**:
- [x] Crear componente `PreDiagnosisModal.vue` con:
  - Formulario para descripción de síntomas
  - Campos para duración y severidad
  - Campo para información adicional
  - Validación de campos obligatorios
- [x] Crear componente `DiagnosisProgress.vue` para:
  - Mostrar estado de procesamiento (PENDING/PROCESSING)
  - Animación de espera durante análisis DeepSeek
  - Manejo de errores de procesamiento
- [x] Crear componente `DiagnosisResultCard.vue` para:
  - Visualización estructurada de resultados
  - Gráficos de probabilidad para cada condición detectada
  - Sección de recomendaciones personalizadas
  - Nivel de urgencia y confianza
  - Disclaimers legales claramente visibles
- [x] Implementar store Pinia para gestión de estado del diagnóstico
- [x] Integrar con servicios API mediante Axios
- [x] Implementar manejo de errores y situaciones excepcionales
- [x] Añadir tests unitarios para componentes principales

**Dependencias**:
- Servicio de API para prediagnóstico DeepSeek AI implementado en backend
- Componentes UI base (botones, inputs, etc.) disponibles

**Definition of Done**:
- ✅ Componentes implementados y funcionando según diseño
- ✅ Integración correcta con API backend DeepSeek
- ✅ Tests unitarios pasando con cobertura >80%
- ✅ Responsive en dispositivos móviles y escritorio
- ✅ Validación de accesibilidad básica (WCAG AA)
- ✅ Revisión de código completada

**Estimación**: 8 horas

### Ticket 2: Implementación del servicio de integración con DeepSeek AI en backend

**Título**: Implementación del servicio de integración con DeepSeek AI en backend

**Descripción**:  
Desarrollar un módulo NestJS para gestionar la integración con DeepSeek AI para prediagnósticos veterinarios basados en síntomas descritos, incluyendo procesamiento asíncrono, almacenamiento de resultados y manejo de errores.

**Tareas técnicas**:
- [x] Crear módulo `DiagnosisModule` con:
  - Controlador para endpoints REST
  - Servicio para lógica de negocio
  - DTO para validación de datos entrantes/salientes
  - Entidades para persistencia
- [x] Implementar integración con DeepSeek API:
  - Servicio adaptador `DeepSeekService` con métodos de comunicación
  - Prompts especializados para diagnóstico veterinario
  - Transformadores para mapeo de respuestas JSON
  - Manejo de rate limiting y timeouts
- [x] Desarrollar sistema de procesamiento asíncrono:
  - Procesamiento directo sin colas para mayor simplicidad
  - Estados de diagnóstico (PENDING/PROCESSING/COMPLETED/FAILED)
  - Sistema de validación de respuestas DeepSeek
- [x] Implementar validación de síntomas:
  - Validación de campos obligatorios
  - Sanitización de texto descriptivo
  - Mapeo de severidad y duración
- [x] Crear endpoints REST para:
  - Creación de prediagnóstico (`POST /api/diagnosis`)
  - Consulta de resultados (`GET /api/diagnosis/{id}`)
  - Diagnósticos por cita (`GET /api/appointments/{id}/diagnosis`)
- [x] Implementar tests unitarios y de integración

**Dependencias**:
- Cuenta y credenciales para DeepSeek AI API
- Módulos de autenticación y mascotas implementados
- Base de datos PostgreSQL configurada

**Definition of Done**:
- ✅ API endpoints implementados y documentados con Swagger
- ✅ Tests pasando con cobertura >85%
- ✅ Manejo correcto de casos excepcionales
- ✅ Performance aceptable (respuesta <2s para análisis completo)
- ✅ Documentación técnica actualizada
- ✅ Logging adecuado para debugging

**Estimación**: 10 horas

### Ticket 3: Diseño e implementación del esquema de base de datos para prediagnósticos DeepSeek AI

**Título**: Diseño e implementación del esquema de base de datos para prediagnósticos DeepSeek AI

**Descripción**:  
Diseñar y configurar las tablas, relaciones y migraciones necesarias en PostgreSQL para almacenar prediagnósticos generados por DeepSeek AI, incluyendo síntomas, resultados estructurados y metadatos asociados.

**Tareas técnicas**:
- [x] Diseñar esquema de tabla `ai_diagnoses`:
  - Campos para síntomas, duración, severidad, información adicional
  - Establecer claves primarias y foráneas
  - Configurar índices para consultas frecuentes
  - Definir constraints y validaciones
- [x] Crear entidad TypeORM `AIDiagnosis` con:
  - Decoradores para mapeo ORM
  - Relaciones con entidades Pet y Appointment
  - Validadores y transformadores para campos DeepSeek
- [x] Implementar migraciones para:
  - Script de creación de tabla inicial
  - Migración específica para añadir petId a medical records
  - Índices para optimización de consultas
- [x] Desarrollar repositorio personalizado para:
  - Consultas complejas optimizadas
  - Funciones de agregación para estadísticas
  - Gestión de transacciones y validaciones de acceso
- [x] Implementar mecanismos para:
  - Paginación eficiente de resultados
  - Búsqueda y filtrado por estados
  - Control de acceso basado en roles (CLIENT/VET)
- [x] Configurar estrategia de backups y retención de datos
- [x] Crear pruebas de integración con base de datos real

**Dependencias**:
- Configuración base de PostgreSQL
- Esquema de tablas para mascotas y citas
- ORM configurado en el proyecto

**Definition of Done**:
- ✅ Esquema implementado y migraciones funcionando
- ✅ Consultas optimizadas (validadas con EXPLAIN)
- ✅ Entidad correctamente mapeada con ORM
- ✅ Tests de integración pasando
- ✅ Documentación del modelo actualizada
- ✅ Verificado respaldo y recuperación

**Estimación**: 6 horas

---

## 7. Pull Requests

### Pull Request 1: Implementación del sistema de prediagnóstico DeepSeek AI

**Título**: Implementación del sistema de prediagnóstico DeepSeek AI

**Descripción**:
Esta PR implementa la funcionalidad core del sistema de prediagnóstico mediante DeepSeek AI, incluyendo la integración completa con DeepSeek API, procesamiento inteligente de síntomas, almacenamiento de resultados estructurados y la interfaz de usuario completa para que los clientes puedan describir síntomas y visualizar prediagnósticos detallados.

**Cambios principales**:
- Nuevo módulo backend `DiagnosisModule` con controladores, servicios y DTOs especializados
- Integración completa con DeepSeek AI API usando prompts veterinarios especializados
- Sistema de procesamiento asíncrono optimizado para análisis de texto
- Componentes frontend intuitivos para descripción de síntomas y visualización de resultados
- Nuevas tablas en base de datos con campos específicos para síntomas y resultados DeepSeek
- Tests unitarios y de integración completos
- Sistema de polling inteligente para actualizaciones en tiempo real

**Impacto**:
Esta implementación cubre la funcionalidad diferenciadora principal del sistema. Afecta tanto frontend como backend, proporcionando una experiencia completa de prediagnóstico veterinario basado en IA.

**Checklist de revisión**:
- [x] El código sigue los estándares de codificación del proyecto
- [x] Se han implementado pruebas para toda la funcionalidad nueva
- [x] La documentación ha sido actualizada
- [x] Se han manejado adecuadamente los casos de error
- [x] La interfaz de usuario es intuitiva y accesible
- [x] El rendimiento es aceptable para análisis de texto con DeepSeek
- [x] Se siguen las mejores prácticas de seguridad
- [x] Los disclaimers legales son claros y visibles
- [x] Los prompts de DeepSeek están optimizados para precisión veterinaria
- [x] El sistema de polling funciona correctamente sin problemas de permisos

**Imágenes de demostración**:

### Pull Request 2: Sistema de citas con disponibilidad en tiempo real

**Título**: Sistema de citas con disponibilidad en tiempo real

**Descripción**:
Esta PR implementa el sistema completo de gestión de citas, permitiendo a los clientes ver la disponibilidad de los veterinarios en tiempo real, programar citas, y recibir confirmaciones automáticas. Para los veterinarios, incluye la gestión de su disponibilidad y visualización de agenda.

**Cambios principales**:
- Nuevo módulo backend `AppointmentsModule` con endpoints RESTful
- Sistema de cálculo de disponibilidad basado en horarios de veterinarios
- Interfaz de calendario interactivo en frontend
- Sistema de notificaciones para confirmaciones y recordatorios
- Integración con servicio de correo electrónico
- Permisos y roles específicos para gestión de citas

**Impacto**:
Este cambio afecta a una funcionalidad core del sistema y modifica el comportamiento de las páginas principales para clientes y veterinarios.

**Checklist de revisión**:
- [x] El código sigue los estándares de codificación del proyecto
- [x] Se han implementado pruebas para toda la funcionalidad nueva
- [x] El calendario maneja correctamente zonas horarias
- [x] Las confirmaciones y notificaciones funcionan correctamente
- [x] La UI es intuitiva y clara para la selección de fechas
- [x] Las validaciones previenen solapamientos de citas
- [x] El rendimiento es bueno incluso con muchas citas
- [x] La funcionalidad es totalmente responsiva

**Imágenes de demostración**:

### Pull Request 3: Historiales médicos con seguimiento evolutivo

**Título**: Historiales médicos con seguimiento evolutivo

**Descripción**:
Esta PR implementa el sistema completo de historiales médicos digitales, permitiendo a los veterinarios registrar diagnósticos, tratamientos y seguimientos, y a los clientes acceder al historial completo de sus mascotas de forma cronológica y organizada.

**Cambios principales**:
- Nuevo módulo backend `MedicalRecordsModule`
- Sistema de documentación médica con campos estructurados
- Interfaz para entrada de datos médicos para veterinarios
- Visualización cronológica y filtrada de historiales
- Funcionalidad para adjuntar documentos y resultados
- Sistema de alerta para condiciones crónicas y medicaciones

**Impacto**:
Este cambio es central para la funcionalidad médica del sistema y afecta principalmente a la experiencia del veterinario y a la visualización de datos para clientes.

**Checklist de revisión**:
- [x] El código sigue los estándares de codificación del proyecto
- [x] Se han implementado pruebas para toda la funcionalidad nueva
- [x] La terminología médica es correcta y consistente
- [x] El sistema maneja adecuadamente datos médicos sensibles
- [x] La entrada de datos es eficiente para los veterinarios
- [x] La visualización de historiales es clara e informativa
- [x] La exportación de datos médicos funciona correctamente
- [x] Se respetan los permisos y privacidad de datos
