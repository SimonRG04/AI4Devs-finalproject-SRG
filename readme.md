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

Estoy desarrollando un sistema web innovador para la gestión integral de una clínica veterinaria, con un enfoque particular en la incorporación de inteligencia artificial para diagnósticos preliminares.

El sistema "VetAI Connect" busca modernizar la gestión de clínicas veterinarias mediante una plataforma web que conecte a dueños de mascotas con veterinarios, facilitando la programación de citas, el seguimiento de historiales clínicos y, como elemento diferenciador, ofreciendo capacidades de pre-diagnóstico basadas en inteligencia artificial.

### **0.4. URL del proyecto:**

Por definir 🧊

### 0.5. URL o archivo comprimido del repositorio

https://github.com/SimonRG04/AI4Devs-finalproject-SRG

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

5. **Pre-diagnóstico mediante IA**
   - Subida de imágenes previas a la consulta
   - Análisis preliminar de condiciones visibles
   - Informe automatizado para el veterinario
   - Sugerencias de preparación para la consulta

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
5. **Pre-diagnóstico IA**: Interfaz simple para subir imágenes con guía clara.
6. **Seguimiento**: Visualización de resultados y recomendaciones.

#### Flujo de usuario principal - Veterinario:

1. **Dashboard profesional**: Agenda diaria, casos pendientes y alertas.
2. **Gestión de citas**: Vista de calendario con detalles de pacientes.
3. **Revisión de historiales**: Interfaz médica con acceso rápido a datos relevantes.
4. **Consulta de pre-diagnósticos**: Visualización de resultados IA con imágenes originales.
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

1. Backend disponible en: http://localhost:3000
2. Frontend disponible en: http://localhost:8080
3. Documentación API: http://localhost:3000/api-docs

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

#### Flujo de datos para pre-diagnóstico IA:

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant B as Backend
    participant IA as API IA
    participant DB as Base de Datos
    
    C->>F: Sube imagen de mascota
    F->>F: Validación inicial (formato/tamaño)
    F->>B: POST /api/diagnosis/pre-analysis
    B->>B: Validación y pre-procesamiento
    B->>IA: Envía imagen para análisis
    IA->>IA: Procesamiento con modelo ML
    IA->>B: Devuelve resultados
    B->>B: Procesa y formatea resultados
    B->>DB: Almacena resultados
    B->>F: Respuesta con ID de diagnóstico
    F->>C: Muestra resultados preliminares
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
│   ├── layout/           # Estructuras de página
│   ├── auth/             # Componentes de autenticación
│   ├── pets/             # Gestión de mascotas
│   ├── appointments/     # Sistema de citas
│   ├── medical/          # Historiales médicos
│   └── ai-diagnosis/     # Componentes de IA
```

#### Backend (NestJS)

El backend implementa una arquitectura modular siguiendo los principios SOLID:

- **Controladores**: Manejo de rutas HTTP y validación inicial
- **Servicios**: Lógica de negocio encapsulada y reutilizable
- **Repositorios**: Patrón Repository para abstracción de base de datos
- **DTOs**: Objetos de transferencia de datos para validación
- **Guards**: Protección de rutas basada en roles y permisos
- **Pipes**: Transformación y validación de datos entrantes
- **Interceptores**: Manipulación uniforme de respuestas

Módulos principales:

1. **AuthModule**: Autenticación, autorización y gestión de sesiones
2. **UsersModule**: Gestión de perfiles y roles
3. **PetsModule**: Registro y gestión de mascotas
4. **AppointmentsModule**: Sistema de citas y disponibilidad
5. **MedicalRecordsModule**: Historiales clínicos y tratamientos
6. **DiagnosisModule**: Integración con IA para pre-diagnósticos
7. **NotificationsModule**: Sistema de alertas y comunicaciones

#### Base de Datos (PostgreSQL)

Diseño relacional optimizado para:

- **Integridad referencial**: Uso extensivo de claves foráneas
- **Normalización**: Esquema normalizado para reducir redundancia
- **Indexes**: Índices estratégicos para consultas frecuentes
- **Constraints**: Restricciones a nivel de base de datos para integridad
- **Triggers**: Para ciertas operaciones automáticas (historial, auditoría)

#### Integración IA

La integración con servicios de IA externa se realiza mediante:

- **Adapter Pattern**: Abstracción para posibilitar cambios de proveedor
- **Queue System**: Procesamiento asíncrono para tareas intensivas
- **Retry Logic**: Manejo de fallos en comunicación con APIs externas
- **Result Caching**: Almacenamiento local de resultados para reducir llamadas

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

La organización del proyecto sigue una estructura modular con separación clara entre frontend y backend:

```
vetai-connect/
├── frontend/                # Aplicación VueJS
│   ├── public/              # Archivos estáticos
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
        string imageUrl
        json results
        float confidence
        enum status "PENDING|COMPLETED|FAILED"
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
Resultados de pre-diagnósticos generados por IA.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| petId | INT | Mascota analizada | FK → PETS.id, NOT NULL |
| appointmentId | INT | Cita asociada | FK → APPOINTMENTS.id |
| imageUrl | VARCHAR(255) | URL de la imagen analizada | NOT NULL |
| results | JSON | Resultados del análisis | NOT NULL |
| confidence | FLOAT | Nivel de confianza (0-1) | |
| status | ENUM | Estado del diagnóstico | 'PENDING', 'COMPLETED', 'FAILED', NOT NULL |
| createdAt | TIMESTAMP | Fecha de creación | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | Fecha de última actualización | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

---

## 4. Especificación de la API

La API de VetAI Connect sigue principios RESTful y está documentada siguiendo el estándar OpenAPI (Swagger). A continuación se detallan los endpoints principales organizados por recursos.

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

### Diagnóstico con IA

```yaml
openapi: 3.0.0
paths:
  /api/diagnosis/analyze:
    post:
      summary: Solicitar análisis de imagen con IA
      description: Envía una imagen para análisis automatizado
      tags:
        - AI Diagnosis
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                petId:
                  type: integer
                  description: ID de la mascota
                appointmentId:
                  type: integer
                  description: ID de la cita asociada (opcional)
                image:
                  type: string
                  format: binary
                  description: Imagen para analizar
                description:
                  type: string
                  description: Descripción del problema o síntomas
              required:
                - petId
                - image
      responses:
        '202':
          description: Análisis iniciado
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
                    enum: [PENDING]
        '400':
          description: Datos inválidos o imagen no procesable
  
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
                      recommendations:
                        type: array
                        items:
                          type: string
                  confidence:
                    type: number
                  status:
                    type: string
                    enum: [PENDING, COMPLETED, FAILED]
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

**Ejemplo de Petición - Diagnóstico con IA:**

```bash
curl -X POST https://api.vetai-connect.com/api/diagnosis/analyze \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "petId=5" \
  -F "description=Mancha rojiza en la piel que apareció hace 3 días" \
  -F "image=@foto_mascota.jpg"
```

**Ejemplo de Respuesta - Diagnóstico con IA:**

```json
{
  "id": 42,
  "status": "PENDING",
  "message": "La imagen ha sido enviada para análisis. Los resultados estarán disponibles en breve."
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

### Historia de Usuario 2: Solicitud de pre-diagnóstico mediante IA

**Título**: Solicitud de pre-diagnóstico mediante IA para condición visible

**Como** dueño de mascota,  
**Quiero** enviar imágenes de una condición visible en mi mascota antes de una cita,  
**Para** obtener un pre-diagnóstico preliminar que ayude al veterinario a prepararse.

**Criterios de aceptación**:

1. **DADO** que tengo una cita programada,  
   **CUANDO** accedo a los detalles de la cita,  
   **ENTONCES** debo ver una opción para "Solicitar pre-diagnóstico con IA".

2. **DADO** que he seleccionado la opción de pre-diagnóstico,  
   **CUANDO** se me presente la interfaz de carga,  
   **ENTONCES** debo poder:
   - Subir hasta 3 imágenes claras de la condición
   - Añadir una descripción breve del problema (obligatorio)
   - Ver consejos sobre cómo tomar buenas fotografías
   - Ver advertencias claras sobre las limitaciones del pre-diagnóstico con IA

3. **DADO** que he cargado imágenes y descripción,  
   **CUANDO** presiono "Solicitar análisis",  
   **ENTONCES** debe iniciarse el procesamiento y mostrarme una pantalla de espera con indicación de progreso.

4. **DADO** que el análisis ha sido completado,  
   **CUANDO** recibo los resultados,  
   **ENTONCES** debo ver:
   - Posibles condiciones identificadas con nivel de probabilidad
   - Recomendaciones generales
   - Disclaimer claro sobre que esto no reemplaza el diagnóstico profesional
   - Confirmación de que estos resultados ya están disponibles para el veterinario

5. **DADO** que he recibido un pre-diagnóstico,  
   **CUANDO** asisto a mi cita,  
   **ENTONCES** el veterinario debe tener acceso a las imágenes enviadas y resultados del análisis.

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
   - Alertas sobre pre-diagnósticos IA pendientes de revisión
   - Resumen de pacientes atendidos/pendientes

2. **DADO** que estoy en mi dashboard,  
   **CUANDO** selecciono una cita,  
   **ENTONCES** debo ver inmediatamente:
   - Información completa del paciente (mascota)
   - Historial médico relevante
   - Pre-diagnósticos IA si existen
   - Botón para iniciar consulta

3. **DADO** que estoy realizando una consulta,  
   **CUANDO** accedo a la interfaz de registro médico,  
   **ENTONCES** debo poder:
   - Registrar diagnóstico, tratamiento y notas
   - Ver y comentar sobre pre-diagnósticos IA
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

### Ticket 1: Implementación del componente de pre-diagnóstico IA en el frontend

**Título**: Implementación del componente de pre-diagnóstico IA en el frontend

**Descripción**:  
Desarrollar los componentes de interfaz de usuario en VueJS necesarios para permitir a los usuarios subir imágenes de sus mascotas, solicitar análisis de IA, y visualizar los resultados del pre-diagnóstico.

**Tareas técnicas**:
- [ ] Crear componente `AIDiagnosisUploader.vue` con:
  - Dropzone para carga de imágenes con vista previa
  - Validación de formato y tamaño (JPG/PNG, máx 5MB)
  - Campo para descripción del problema
  - Indicadores de progreso de carga
- [ ] Crear componente `AIDiagnosisProcess.vue` para:
  - Mostrar estado de procesamiento
  - Animación de espera durante análisis
  - Manejo de errores de procesamiento
- [ ] Crear componente `AIDiagnosisResults.vue` para:
  - Visualización estructurada de resultados
  - Gráficos de confianza para cada condición detectada
  - Sección de recomendaciones
  - Disclaimers legales claramente visibles
- [ ] Implementar store Pinia para gestión de estado del diagnóstico
- [ ] Integrar con servicios API mediante Axios
- [ ] Implementar manejo de errores y situaciones excepcionales
- [ ] Añadir tests unitarios para componentes principales

**Dependencias**:
- Servicio de API para diagnóstico IA implementado en backend
- Componentes UI base (botones, inputs, etc.) disponibles

**Definition of Done**:
- Componentes implementados y funcionando según diseño
- Integración correcta con API backend
- Tests unitarios pasando con cobertura >80%
- Responsive en dispositivos móviles y escritorio
- Validación de accesibilidad básica (WCAG AA)
- Revisión de código completada

**Estimación**: 8 horas

### Ticket 2: Implementación del servicio de integración con API de IA en backend

**Título**: Implementación del servicio de integración con API de IA en backend

**Descripción**:  
Desarrollar un módulo NestJS para gestionar la integración con APIs externas de análisis de imágenes para pre-diagnósticos veterinarios, incluyendo procesamiento asíncrono, almacenamiento de resultados y manejo de errores.

**Tareas técnicas**:
- [ ] Crear módulo `DiagnosisModule` con:
  - Controlador para endpoints REST
  - Servicio para lógica de negocio
  - DTO para validación de datos entrantes/salientes
  - Entidades para persistencia
- [ ] Implementar integración con API Imagga:
  - Servicio adaptador con métodos de comunicación
  - Transformadores para mapeo de respuestas
  - Manejo de rate limiting y reintentos
- [ ] Desarrollar sistema de procesamiento asíncrono:
  - Cola de trabajos con Bull/Redis
  - Procesadores para jobs de análisis
  - Sistema de notificaciones al completar
- [ ] Implementar almacenamiento de imágenes:
  - Integración con AWS S3 o alternativa
  - Generación de URLs firmadas
  - Validación y sanitización de archivos
- [ ] Crear endpoints REST para:
  - Solicitud de análisis (`POST /api/diagnosis/analyze`)
  - Consulta de resultados (`GET /api/diagnosis/{id}`)
  - Listado de diagnósticos por mascota (`GET /api/pets/{id}/diagnoses`)
- [ ] Implementar tests unitarios y de integración

**Dependencias**:
- Cuenta y credenciales para API de Imagga
- Bucket S3 o sistema de almacenamiento configurado
- Módulos de autenticación y mascotas implementados

**Definition of Done**:
- API endpoints implementados y documentados con Swagger
- Tests pasando con cobertura >85%
- Manejo correcto de casos excepcionales
- Performance aceptable (respuesta <200ms para consultas)
- Documentación técnica actualizada
- Logging adecuado para debugging

**Estimación**: 10 horas

### Ticket 3: Diseño e implementación del esquema de base de datos para diagnósticos IA

**Título**: Diseño e implementación del esquema de base de datos para diagnósticos IA

**Descripción**:  
Diseñar y configurar las tablas, relaciones y migraciones necesarias en PostgreSQL para almacenar diagnósticos generados por IA, incluyendo imágenes, resultados y metadatos asociados.

**Tareas técnicas**:
- [ ] Diseñar esquema de tabla `ai_diagnoses`:
  - Definir todos los campos necesarios
  - Establecer claves primarias y foráneas
  - Configurar índices para consultas frecuentes
  - Definir constraints y validaciones
- [ ] Crear entidad TypeORM `AIDiagnosis` con:
  - Decoradores para mapeo ORM
  - Relaciones con entidades Pet y Appointment
  - Validadores y transformadores
- [ ] Implementar migración para creación inicial:
  - Script de creación de tabla
  - Índices para optimización
  - Datos iniciales de prueba
- [ ] Desarrollar repositorio personalizado para:
  - Consultas complejas optimizadas
  - Funciones de agregación para estadísticas
  - Gestión de transacciones
- [ ] Implementar mecanismos para:
  - Paginación eficiente de resultados
  - Búsqueda y filtrado
  - Eliminación segura con soft delete
- [ ] Configurar estrategia de backups y retención de datos
- [ ] Crear pruebas de integración con base de datos real

**Dependencias**:
- Configuración base de PostgreSQL
- Esquema de tablas para mascotas y citas
- ORM configurado en el proyecto

**Definition of Done**:
- Esquema implementado y migraciones funcionando
- Consultas optimizadas (validadas con EXPLAIN)
- Entidad correctamente mapeada con ORM
- Tests de integración pasando
- Documentación del modelo actualizada
- Verificado respaldo y recuperación

**Estimación**: 6 horas

---

## 7. Pull Requests

### Pull Request 1: Implementación del sistema de pre-diagnóstico IA

**Título**: Implementación del sistema de pre-diagnóstico IA

**Descripción**:
Esta PR implementa la funcionalidad core del sistema de pre-diagnóstico mediante IA, incluyendo la integración con Imagga API, procesamiento asincrónico de imágenes, almacenamiento de resultados y la interfaz de usuario completa para que los clientes puedan subir imágenes y visualizar resultados.

**Cambios principales**:
- Nuevo módulo backend `DiagnosisModule` con controladores, servicios y DTOs
- Integración con Imagga API para análisis de imágenes
- Sistema de procesamiento asincrónico con Bull/Redis
- Componentes frontend para carga y visualización de diagnósticos
- Nuevas tablas en base de datos y migraciones correspondientes
- Tests unitarios y de integración

**Impacto**:
Esta implementación cubre la funcionalidad diferenciadora principal del sistema. Afecta tanto frontend como backend y requiere la configuración de servicios externos.

**Checklist de revisión**:
- [x] El código sigue los estándares de codificación del proyecto
- [x] Se han implementado pruebas para toda la funcionalidad nueva
- [x] La documentación ha sido actualizada
- [x] Se han manejado adecuadamente los casos de error
- [x] La interfaz de usuario es intuitiva y accesible
- [x] El rendimiento es aceptable incluso con imágenes grandes
- [x] Se siguen las mejores prácticas de seguridad
- [x] Los disclaimers legales son claros y visibles

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
