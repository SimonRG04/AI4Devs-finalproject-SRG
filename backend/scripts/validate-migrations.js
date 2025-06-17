const fs = require('fs');
const path = require('path');

async function validateMigrations() {
  console.log('🔍 Validando migración limpia...');

  const migrationPath = path.join(__dirname, '../src/database/migrations/1750500000000-CleanAndRecreateSchema.ts');
  
  // Verificar que la migración existe
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Error: No se encontró la migración CleanAndRecreateSchema');
    process.exit(1);
  }

  console.log('✅ Migración CleanAndRecreateSchema encontrada');
  
  // Leer el contenido de la migración
  const migrationContent = fs.readFileSync(migrationPath, 'utf8');
  
  // Verificaciones básicas
  const checks = [
    {
      name: 'Contiene DROP TABLE statements',
      test: () => migrationContent.includes('DROP TABLE IF EXISTS')
    },
    {
      name: 'Contiene DROP TYPE statements',
      test: () => migrationContent.includes('DROP TYPE IF EXISTS')
    },
    {
      name: 'Contiene CREATE TYPE statements',
      test: () => migrationContent.includes('CREATE TYPE')
    },
    {
      name: 'Contiene CREATE TABLE statements',
      test: () => migrationContent.includes('CREATE TABLE IF NOT EXISTS')
    },
    {
      name: 'Contiene CREATE INDEX statements',
      test: () => migrationContent.includes('CREATE INDEX IF NOT EXISTS')
    },
    {
      name: 'Contiene todas las tablas principales',
      test: () => {
        const tables = ['users', 'clients', 'veterinarians', 'pets', 'appointments', 'medical_records', 'ai_diagnoses'];
        return tables.every(table => migrationContent.includes(`"${table}"`));
      }
    }
  ];

  let allPassed = true;
  for (const check of checks) {
    if (check.test()) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n🎉 Validación exitosa: La migración está lista para producción');
    console.log('📋 Esta migración eliminará toda la estructura existente y la recreará');
    console.log('⚠️  IMPORTANTE: Usar solo en primer deploy o cuando se quiera limpiar completamente la BD');
  } else {
    console.error('\n❌ Validación fallida: La migración tiene problemas');
    process.exit(1);
  }
}

if (require.main === module) {
  validateMigrations().catch(console.error);
} 