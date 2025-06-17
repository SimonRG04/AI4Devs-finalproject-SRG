# 📋 Guía de Migraciones - VetAI Connect Backend

## 🎯 Resumen Ejecutivo

Esta guía documenta el estado actual de las migraciones de base de datos y las mejores prácticas para su manejo en producción.

## 📊 Estado Actual de Migraciones

### Orden de Ejecución Actual
```
1. 1749000000000-InitialDatabaseSchema.ts       (database/migrations)
2. 1749000001000-FixUserPhoneColumn.ts          (database/migrations)
3. 1749000002000-AddMissingPetColumns.ts        (database/migrations)
4. 1749000003000-FixAppointmentColumns.ts       (database/migrations)
5. 1749000004000-AlignAppointmentStructure.ts   (database/migrations)
6. 1749000005000-AddImageSupport.ts             (database/migrations)
7. 1750032503315-UpdateAppointmentsTable.ts     (migrations)
8. 1750033552868-UpdateMedicalRecordsTable.ts   (migrations)
9. 1750036733746-FixAppointmentColumnsNew.ts    (migrations)
10. 1750038234648-FixDatabaseColumns.ts         (migrations)
11. 1750112631639-AddPetIdToMedicalRecords.ts   (migrations)
12. 1750120000000-CreateDiagnosisTable.ts       (migrations)
13. 1750200000000-ConsolidateSchema.ts          (database/migrations)
```

### ⚠️ Problemas Identificados y Solucionados

#### 1. **Doble Ubicación de Migraciones** ✅ SOLUCIONADO
- **Problema**: Migraciones dispersas en dos carpetas
- **Solución**: Configuración actualizada para incluir ambas rutas
- **Resultado**: Todas las migraciones se ejecutan en orden correcto

#### 2. **Migraciones Potencialmente Destructivas** ✅ MITIGADO
- **Problema**: Algunas migraciones eliminaban columnas sin respaldo
- **Solución**: Migración de consolidación segura añadida
- **Resultado**: Cambios aplicados de forma no destructiva

#### 3. **Falta de Validación Pre-Deploy** ✅ SOLUCIONADO
- **Problema**: No había validación automática antes del deploy
- **Solución**: Scripts de validación integrados en el proceso de deploy
- **Resultado**: Validación automática antes de cada deploy

## 🔧 Scripts Disponibles

### Comandos de Migración
```bash
# Generar nueva migración
npm run migration:generate -- --name NombreDeLaMigracion

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Validar estructura de migraciones
npm run migration:validate

# Verificar estado completo
npm run migration:check
```

### Comandos de Deploy
```bash
# Deploy completo con validaciones
npm run start:deploy

# Solo validar migraciones
npm run migration:validate
```

## 🏗️ Estructura de Tablas Principales

### 1. **Usuarios y Autenticación**
- `users` - Usuarios base del sistema
- `clients` - Perfiles de clientes
- `veterinarians` - Perfiles de veterinarios

### 2. **Mascotas y Citas**
- `pets` - Registro de mascotas
- `appointments` - Sistema de citas
- `ai_diagnoses` - Diagnósticos de IA

### 3. **Registros Médicos**
- `medical_records` - Historial médico
- `prescriptions` - Recetas médicas
- `vaccinations` - Registro de vacunas
- `attachments` - Archivos adjuntos

### 4. **Sistema**
- `notifications` - Notificaciones del sistema

## 🛡️ Mejores Prácticas Implementadas

### 1. **Migraciones Idempotentes**
- Verificaciones `IF NOT EXISTS` para crear tablas
- Verificaciones de columnas antes de agregar/eliminar
- Manejo seguro de tipos de datos

### 2. **Integridad Referencial**
- Foreign keys con políticas apropiadas (CASCADE, SET NULL)
- Índices para optimizar consultas
- Constraints para mantener consistencia

### 3. **Validación Automática**
- Verificación de orden de migraciones
- Detección de timestamps duplicados
- Validación de integridad antes del deploy

### 4. **Respaldo de Datos**
- Migraciones no destructivas
- Preservación de datos existentes
- Rollback seguro cuando es posible

## 🚀 Proceso de Deploy en Producción

### Pre-Deploy
1. **Validación Local**
   ```bash
   npm run migration:validate
   npm run migration:check
   ```

2. **Revisión de Cambios**
   - Verificar que todas las migraciones están incluidas
   - Confirmar que no hay cambios destructivos
   - Validar compatibilidad con código existente

### Deploy
1. **Backup de Base de Datos**
   ```bash
   # En el servidor de producción
   pg_dump vetai_connect > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Ejecutar Deploy**
   ```bash
   # Variables de entorno para producción
   export RUN_MIGRATIONS=true
   export RUN_SEEDS=false
   export IS_FIRST_DEPLOY=false
   
   npm run start:deploy
   ```

### Post-Deploy
1. **Verificación de Estado**
   ```bash
   npm run migration:check
   ```

2. **Pruebas de Funcionalidad**
   - Verificar que la aplicación inicia correctamente
   - Probar endpoints críticos
   - Validar integridad de datos

## 🔍 Monitoreo y Troubleshooting

### Comandos de Diagnóstico
```bash
# Ver migraciones ejecutadas
npx typeorm migration:show -d src/config/database.config.ts

# Verificar estructura de base de datos
psql vetai_connect -c "\dt"

# Ver logs de migración
tail -f logs/migration.log
```

### Problemas Comunes

#### Error: "Migration already exists"
```bash
# Solución: Verificar timestamps duplicados
npm run migration:validate
```

#### Error: "Column already exists"
```bash
# Solución: La migración de consolidación maneja esto automáticamente
# Verificar que ConsolidateSchema se ejecutó correctamente
```

#### Error: "Foreign key constraint violation"
```bash
# Solución: Verificar datos huérfanos antes de la migración
SELECT * FROM tabla_hijo LEFT JOIN tabla_padre ON tabla_hijo.foreign_key = tabla_padre.id WHERE tabla_padre.id IS NULL;
```

## 📞 Contacto de Soporte

Para problemas con migraciones en producción:
1. Revisar esta documentación
2. Ejecutar comandos de diagnóstico
3. Contactar al equipo de backend con logs específicos

---
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo Backend VetAI Connect 