const fs = require('fs');
const path = require('path');

// Función para extraer timestamp de nombre de archivo
function getTimestamp(filename) {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1]) : 0;
}

// Función para detectar si es primer deploy
function isFirstDeploy() {
  return process.env.IS_FIRST_DEPLOY === 'true';
}

// Función para validar configuración de primer deploy
function validateFirstDeployConfig() {
  console.log('\n🔍 Detectando tipo de deploy...');
  
  if (isFirstDeploy()) {
    console.log('✅ MODO: PRIMER DEPLOY');
    console.log('🎯 OBJETIVO: Crear BD desde cero idéntica a DatabaseTables.sql');
    console.log('📋 ESTRATEGIA: Ejecutar SOLO RecreateFullSchema');
    
    // Verificar que existe RecreateFullSchema
    const recreateMigration = '1750400000000-RecreateFullSchema.ts';
    const migrationPath = path.join(__dirname, '../src/database/migrations', recreateMigration);
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ ERROR: ${recreateMigration} no encontrada`);
      return false;
    }
    
    console.log(`✅ RecreateFullSchema encontrada: ${recreateMigration}`);
    return true;
  } else {
    console.log('📈 MODO: DEPLOY INCREMENTAL');
    console.log('📋 ESTRATEGIA: Ejecutar migraciones pendientes normalmente');
    return validateAllMigrations();
  }
}

// Función para validar todas las migraciones (modo incremental)
function validateAllMigrations() {
  const databaseMigrationsPath = path.join(__dirname, '../src/database/migrations');
  const migrationsPath = path.join(__dirname, '../src/migrations');
  
  const allMigrations = [];
  
  // Leer migraciones de database/migrations
  if (fs.existsSync(databaseMigrationsPath)) {
    const dbMigrations = fs.readdirSync(databaseMigrationsPath)
      .filter(file => file.endsWith('.ts'))
      .map(file => ({
        file,
        timestamp: getTimestamp(file),
        path: 'database/migrations'
      }));
    allMigrations.push(...dbMigrations);
  }
  
  // Leer migraciones de migrations
  if (fs.existsSync(migrationsPath)) {
    const migrations = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.ts'))
      .map(file => ({
        file,
        timestamp: getTimestamp(file),
        path: 'migrations'
      }));
    allMigrations.push(...migrations);
  }
  
  // Ordenar por timestamp
  allMigrations.sort((a, b) => a.timestamp - b.timestamp);
  
  console.log('\n📝 Migraciones a ejecutar (orden):');
  allMigrations.forEach((migration, index) => {
    const isRecreate = migration.file.includes('RecreateFullSchema');
    const icon = isRecreate ? '🎯' : '📝';
    console.log(`${index + 1}. ${icon} ${migration.file}`);
  });
  
  return true;
}

// Función para verificar variables de entorno
function validateEnvironment() {
  console.log('\n🔧 Verificando variables de entorno...');
  
  const requiredVars = [
    'DATABASE_HOST',
    'DATABASE_USERNAME', 
    'DATABASE_PASSWORD',
    'DATABASE_NAME'
  ];
  
  let allValid = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.error(`❌ Variable faltante: ${varName}`);
      allValid = false;
    } else {
      console.log(`✅ ${varName}: configurada`);
    }
  });
  
  // Validar configuración específica para primer deploy
  if (isFirstDeploy()) {
    const deployVars = ['RUN_MIGRATIONS', 'RUN_SEEDS'];
    console.log('\n📋 Variables de primer deploy:');
    deployVars.forEach(varName => {
      const value = process.env[varName];
      if (value === 'true') {
        console.log(`✅ ${varName}: ${value}`);
      } else {
        console.warn(`⚠️  ${varName}: ${value || 'undefined'} (recomendado: true)`);
      }
    });
  }
  
  return allValid;
}

// Función para mostrar resumen de ejecución
function showExecutionSummary() {
  console.log('\n📋 RESUMEN DE EJECUCIÓN:');
  console.log('==========================================');
  
  if (isFirstDeploy()) {
    console.log('🎯 PRIMER DEPLOY - Creación desde cero');
    console.log('📝 Acciones que se ejecutarán:');
    console.log('  1. ❌ SKIP todas las migraciones anteriores');
    console.log('  2. ✅ EJECUTAR solo RecreateFullSchema');
    console.log('  3. ✅ DROP/CREATE toda la estructura');
    console.log('  4. ✅ INSERTAR seeds de datos iniciales');
    console.log('');
    console.log('🎯 RESULTADO: BD idéntica a DatabaseTables.sql');
    console.log('✅ GARANTÍA: Sin conflictos de migraciones anteriores');
  } else {
    console.log('📈 DEPLOY INCREMENTAL');
    console.log('📝 Se ejecutarán migraciones pendientes en orden');
    console.log('🎯 RESULTADO: BD actualizada incrementalmente');
  }
  
  console.log('==========================================');
}

// Ejecutar validaciones
console.log('🚀 Iniciando validación para VetAI Connect...');

const configValid = validateFirstDeployConfig();
const envValid = validateEnvironment();

if (configValid && envValid) {
  showExecutionSummary();
  console.log('\n🎉 Validación completada - Configuración correcta');
  console.log('✅ Listo para proceder con el deploy');
  process.exit(0);
} else {
  console.error('\n💥 Errores encontrados en la configuración');
  console.error('❌ Revisar y corregir antes del deploy');
  process.exit(1);
} 