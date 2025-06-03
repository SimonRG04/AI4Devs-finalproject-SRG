# VetAI Connect - Backend API

Backend API para VetAI Connect, una plataforma de gestión veterinaria con diagnóstico asistido por IA.

## 🚀 Tecnologías

- **Framework**: NestJS 10.x
- **Base de datos**: PostgreSQL 15+
- **ORM**: TypeORM
- **Autenticación**: JWT + Passport
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **Lenguaje**: TypeScript

## 📋 Prerrequisitos

- Node.js 18+ 
- npm 9+
- PostgreSQL 15+
- Git

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd vetai-connect/backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` basado en `.env.example`:

```bash
# Configuración del servidor
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Configuración de base de datos PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=vetai_connect
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vetai_connect

# Configuración JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Configuración de APIs externas
IMAGGA_API_KEY=your-imagga-api-key
IMAGGA_API_SECRET=your-imagga-api-secret
IMAGGA_BASE_URL=https://api.imagga.com/v2

# Configuración de almacenamiento (opcional)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Configuración de correo electrónico (opcional)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@vetai-connect.com

# Configuración de logs
LOG_LEVEL=debug

# Configuración de seguridad
BCRYPT_ROUNDS=12
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
```

### 4. Configurar base de datos

#### Crear base de datos PostgreSQL:
```sql
CREATE DATABASE vetai_connect;
CREATE USER vetai_user WITH PASSWORD 'vetai_password';
GRANT ALL PRIVILEGES ON DATABASE vetai_connect TO vetai_user;
```

#### Ejecutar migraciones:
```bash
npm run migration:run
```

#### Cargar datos de prueba (opcional):
```bash
npm run seed
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Testing
```bash
# Tests unitarios
npm run test

# Tests con watch mode
npm run test:watch

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 📚 API Documentation

Una vez ejecutado el servidor, la documentación Swagger estará disponible en:
- **Desarrollo**: http://localhost:3000/api/docs
- **Producción**: https://your-domain.com/api/docs

## 🗂️ Estructura del Proyecto

```
src/
├── config/                 # Configuraciones
│   ├── configuration.ts    # Configuración general
│   ├── database.config.ts  # Configuración de BD
│   ├── jwt.config.ts       # Configuración JWT
│   └── cors.config.ts      # Configuración CORS
├── database/               # Base de datos
│   ├── migrations/         # Migraciones
│   └── seeds/             # Datos de prueba
├── modules/               # Módulos funcionales
│   ├── auth/              # Autenticación
│   ├── users/             # Usuarios
│   ├── pets/              # Mascotas
│   ├── appointments/      # Citas
│   ├── medical/           # Registros médicos
│   ├── diagnosis/         # Diagnóstico IA
│   └── notifications/     # Notificaciones
├── common/                # Utilidades comunes
│   ├── decorators/        # Decoradores
│   ├── filters/           # Filtros de excepción
│   ├── guards/            # Guards
│   ├── interceptors/      # Interceptores
│   └── pipes/             # Pipes de validación
├── app.module.ts          # Módulo principal
└── main.ts               # Punto de entrada
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación:

### Endpoints públicos:
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar cliente

### Endpoints protegidos:
- `GET /auth/profile` - Perfil del usuario
- `POST /auth/refresh` - Renovar token

### Roles de usuario:
- **CLIENT**: Clientes con mascotas
- **VET**: Veterinarios
- **ADMIN**: Administradores del sistema

## 🧪 Testing

### Estructura de tests:
```
src/
├── modules/
│   └── auth/
│       ├── auth.service.spec.ts      # Tests unitarios
│       ├── auth.controller.spec.ts   # Tests de controlador
│       └── auth.e2e-spec.ts         # Tests e2e
```

### Comandos de testing:
```bash
# Ejecutar todos los tests
npm test

# Tests con watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Tests específicos
npm test -- auth.service.spec.ts
```

## 🚀 Despliegue

### Variables de entorno para producción:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-production-jwt-secret
```

### Docker (opcional):
```bash
# Construir imagen
docker build -t vetai-connect-backend .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env vetai-connect-backend
```

## 📊 Monitoreo y Logs

### Logs estructurados:
- Nivel de log configurable via `LOG_LEVEL`
- Logs en formato JSON para producción
- Integración con servicios de monitoreo

### Health checks:
- `GET /health` - Estado del servidor
- `GET /health/database` - Estado de la BD

## 🔧 Scripts NPM

```bash
# Desarrollo
npm run start:dev          # Servidor con hot reload
npm run start:debug        # Servidor con debug

# Construcción
npm run build              # Compilar TypeScript
npm run start:prod         # Servidor de producción

# Base de datos
npm run migration:generate # Generar migración
npm run migration:run      # Ejecutar migraciones
npm run migration:revert   # Revertir migración
npm run seed              # Cargar datos de prueba

# Calidad de código
npm run lint              # ESLint
npm run format            # Prettier
npm run test              # Tests
npm run test:cov          # Coverage
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico:
- 📧 Email: soporte@vetai-connect.com
- 📱 WhatsApp: +57 300 123 4567
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🔄 Changelog

### v1.0.0 (2024-01-XX)
- ✅ Sistema de autenticación JWT
- ✅ Gestión de usuarios y roles
- ✅ CRUD de mascotas
- ✅ Sistema de citas
- ✅ Registros médicos
- ✅ Integración con IA para diagnóstico
- ✅ Sistema de notificaciones
- ✅ API REST completa
- ✅ Documentación Swagger
- ✅ Tests unitarios e integración 

## 🚀 Deploy en Railway

### Variables de Entorno para Deploy

Para controlar la ejecución de migraciones y seeds durante el deploy, configura estas variables de entorno en Railway:

| Variable | Descripción | Valores | Default |
|----------|-------------|---------|---------|
| `IS_FIRST_DEPLOY` | Ejecuta migraciones y seeds en el primer deploy | `true`/`false` | `false` |
| `RUN_MIGRATIONS` | Fuerza la ejecución de migraciones | `true`/`false` | `false` |
| `RUN_SEEDS` | Fuerza la ejecución de seeds | `true`/`false` | `false` |
| `FORCE_SETUP` | Ejecuta tanto migraciones como seeds | `true`/`false` | `false` |

### Escenarios de Uso

#### Primer Deploy (Configuración inicial)
```bash
IS_FIRST_DEPLOY=true
```
Esto ejecutará automáticamente migraciones y seeds.

#### Deploy Regular (Solo migraciones)
```bash
RUN_MIGRATIONS=true
RUN_SEEDS=false
```

#### Deploy de Emergencia (Configuración completa)
```bash
FORCE_SETUP=true
```

#### Deploy Normal (Sin cambios en DB)
```bash
# No configurar ninguna variable o todas en false
```

### Variables de Base de Datos

También asegúrate de configurar las variables de la base de datos:

```bash
DATABASE_HOST=<tu-host>
DATABASE_PORT=5432
DATABASE_USERNAME=<tu-usuario>
DATABASE_PASSWORD=<tu-password>
DATABASE_NAME=<tu-base-de-datos>
NODE_ENV=production
``` 