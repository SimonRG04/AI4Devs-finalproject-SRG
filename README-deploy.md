# VetAI Connect - Prueba de Conectividad

Este proyecto implementa una estructura mínima funcional para verificar la correcta comunicación entre el frontend y backend de VetAI Connect, así como la preparación para despliegue en Railway.

## Estructura del Proyecto

```
vetai-connect/
├── backend/                # API NestJS
│   ├── src/                # Código fuente
│   │   ├── config/         # Configuraciones
│   │   └── shared/         # Utilidades compartidas
│   ├── .env                # Variables de entorno locales
│   ├── package.json        # Dependencias de Node.js
│   ├── tsconfig.json       # Configuración de TypeScript
│   └── railway.json        # Configuración para Railway
├── frontend/               # Aplicación Vue.js
│   ├── public/             # Archivos estáticos
│   ├── src/                # Código fuente
│   │   ├── assets/         # Imágenes, estilos, etc.
│   │   ├── components/     # Componentes Vue
│   │   ├── router/         # Configuración de rutas
│   │   ├── services/       # Servicios para API
│   │   ├── stores/         # Stores Pinia
│   │   └── views/          # Vistas/Páginas
│   ├── .env                # Variables de entorno locales
│   ├── package.json        # Dependencias de Node.js
│   └── railway.json        # Configuración para Railway
```

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Git
- Cuenta en Railway (para el despliegue)

## Ejecución Local

### Backend (NestJS)

1. Navegar al directorio del backend:
   ```bash
   cd backend
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` basado en `.env.example` (si no existe ya):
   ```bash
   cp .env.example .env
   ```

4. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```

El servidor estará disponible en: `http://localhost:3000/api`

### Frontend (Vue.js)

1. Navegar al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` (si no existe ya):
   ```bash
   echo "VITE_API_URL=http://localhost:3000/api" > .env
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend estará disponible en: `http://localhost:5173`

## Despliegue en Railway

Railway permite desplegar aplicaciones fácilmente desde GitHub. Sigue estos pasos para desplegar tanto el backend como el frontend:

### Preparación

1. Crea una cuenta en [Railway](https://railway.app/) si aún no tienes una.
2. Instala la CLI de Railway (opcional pero recomendado):
   ```bash
   npm i -g @railway/cli
   ```
3. Inicia sesión desde la CLI:
   ```bash
   railway login
   ```

### Despliegue del Backend

1. Desde la dashboard de Railway, crea un nuevo proyecto:
   - Selecciona "Deploy from GitHub repo"
   - Elige el repositorio que contiene el proyecto
   - Configura Railway para que use el subdirectorio `/backend`

2. Configura las variables de entorno necesarias en Railway:
   ```
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://tu-frontend-url.railway.app
   DATABASE_HOST=...
   DATABASE_PORT=5432
   DATABASE_USERNAME=...
   DATABASE_PASSWORD=...
   DATABASE_NAME=...
   JWT_SECRET=...
   JWT_EXPIRES_IN=1d
   ```

3. Railway detectará automáticamente el archivo `railway.json` y utilizará la configuración de despliegue definida.

### Despliegue del Frontend

1. Crea otro servicio en el mismo proyecto de Railway:
   - Selecciona "Deploy from GitHub repo" nuevamente
   - Elige el mismo repositorio
   - Configura Railway para que use el subdirectorio `/frontend`

2. Configura las variables de entorno necesarias:
   ```
   VITE_API_URL=https://tu-backend-url.railway.app/api
   ```

3. Railway utilizará el archivo `railway.json` del frontend para la configuración de despliegue.

### Configuración de Dominio (Opcional)

Railway permite configurar dominios personalizados para tus servicios:

1. En la sección "Settings" de tu servicio, navega a "Domains".
2. Puedes generar un subdominio de Railway o configurar tu propio dominio.

## Verificación de Conectividad

Una vez desplegada la aplicación, puedes verificar la conectividad visitando la URL del frontend. La página principal muestra un botón para probar la conexión con el backend, que debería mostrar un mensaje exitoso si todo está correctamente configurado.

## Variables de Entorno

### Backend

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto en el que se ejecuta el servidor | 3000 |
| NODE_ENV | Entorno de ejecución | development |
| FRONTEND_URL | URL del frontend para CORS | http://localhost:5173 |
| DATABASE_HOST | Host de la base de datos | localhost |
| DATABASE_PORT | Puerto de la base de datos | 5432 |
| DATABASE_USERNAME | Usuario de la base de datos | postgres |
| DATABASE_PASSWORD | Contraseña de la base de datos | postgres |
| DATABASE_NAME | Nombre de la base de datos | vetai_connect |
| JWT_SECRET | Clave secreta para JWT | test-secret-key-change-in-production |
| JWT_EXPIRES_IN | Tiempo de expiración del JWT | 1d |

### Frontend

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| VITE_API_URL | URL base de la API | http://localhost:3000/api |

## Consideraciones para el Despliegue en Railway

- **Plan gratuito**: Railway ofrece un plan gratuito con límites de tiempo de ejecución y recursos. Para proyectos en producción, considera actualizar a un plan de pago.
- **Base de datos**: Para una aplicación completa, necesitarás configurar una base de datos PostgreSQL en Railway o conectar a una externa.
- **Variables de entorno**: Asegúrate de configurar todas las variables de entorno necesarias en Railway, especialmente las URLs que conectan frontend y backend.
- **Dominios personalizados**: Para un entorno de producción, considera configurar dominios personalizados para mejorar la experiencia del usuario.
- **Monitoreo**: Utiliza las herramientas de monitoreo de Railway para supervisar el rendimiento y los logs de tu aplicación.

## Escalabilidad de la Estructura

Esta implementación mínima está diseñada para ser escalable:

- La estructura de directorios sigue las convenciones estándar para NestJS y Vue.js
- Los servicios están separados para permitir un desarrollo independiente
- La configuración de Railway facilita la integración continua y el despliegue
- La gestión de variables de entorno permite diferentes configuraciones según el entorno 