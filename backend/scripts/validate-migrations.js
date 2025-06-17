const fs = require('fs');
const path = require('path');

// Función para extraer timestamp de nombre de archivo
function getTimestamp(filename) {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1]) : 0;
}

// Función para validar orden de migraciones
function validateMigrationOrder() {
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
  
  console.log('\n🔍 Orden de ejecución de migraciones:');
  console.log('==========================================');
  
  allMigrations.forEach((migration, index) => {
    console.log(`${index + 1}. ${migration.file} (${migration.path})`);
  });
  
  // Validar que no hay timestamps duplicados
  const timestamps = allMigrations.map(m => m.timestamp);
  const duplicates = timestamps.filter((timestamp, index) => timestamps.indexOf(timestamp) !== index);
  
  if (duplicates.length > 0) {
    console.error('\n❌ ERROR: Timestamps duplicados encontrados:');
    duplicates.forEach(dup => console.error(`   - ${dup}`));
    return false;
  }
  
  console.log('\n✅ Validación completada: Orden de migraciones correcto');
  return true;
}

// Función para verificar integridad de migraciones
function validateMigrationIntegrity() {
  console.log('\n🔧 Verificando integridad de migraciones...');
  
  // Aquí puedes agregar más validaciones específicas
  const criticalMigrations = [
    '1749000000000-InitialDatabaseSchema.ts',
    '1750120000000-CreateDiagnosisTable.ts',
    '1750300000000-FixProductionSchema.ts'
  ];
  
  let allValid = true;
  
  criticalMigrations.forEach(migration => {
    const dbPath = path.join(__dirname, '../src/database/migrations', migration);
    const migPath = path.join(__dirname, '../src/migrations', migration);
    
    const exists = fs.existsSync(dbPath) || fs.existsSync(migPath);
    
    if (!exists) {
      console.error(`❌ Migración crítica no encontrada: ${migration}`);
      allValid = false;
    } else {
      console.log(`✅ Migración encontrada: ${migration}`);
    }
  });
  
  return allValid;
}

// Ejecutar validaciones
console.log('🚀 Iniciando validación de migraciones...');

const orderValid = validateMigrationOrder();
const integrityValid = validateMigrationIntegrity();

if (orderValid && integrityValid) {
  console.log('\n🎉 Todas las validaciones pasaron correctamente');
  process.exit(0);
} else {
  console.error('\n💥 Errores encontrados en las migraciones');
  process.exit(1);
} 