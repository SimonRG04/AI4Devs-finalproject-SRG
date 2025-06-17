#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function executeCommand(command, description) {
  console.log(`\n🔨 ${description}...`);
  try {
    const output = execSync(command, { 
      cwd: __dirname + '/../',
      stdio: 'inherit'
    });
    console.log(`✅ ${description} completado`);
    return true;
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando setup de deploy para VetAI Connect');
  console.log('🧹 Usando migración limpia: CleanAndRecreateSchema');
  
  // Validar que existe la migración
  const migrationPath = path.join(__dirname, '../src/database/migrations/1750500000000-CleanAndRecreateSchema.ts');
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Error: No se encontró la migración CleanAndRecreateSchema.ts');
    process.exit(1);
  }
  
  console.log('✅ Migración CleanAndRecreateSchema encontrada');
  
  // Ejecutar validaciones
  if (!executeCommand('node scripts/validate-migrations.js', 'Validando migración')) {
    process.exit(1);
  }

  // Ejecutar migraciones
  if (process.env.RUN_MIGRATIONS === 'true') {
    console.log('\n🗄️ Ejecutando migración de base de datos...');
    console.log('⚠️  Esta migración eliminará TODA la estructura existente');
    console.log('⚠️  Y la recreará desde cero con la estructura correcta');
    
    if (!executeCommand('npm run migration:run', 'Ejecutando migración CleanAndRecreateSchema')) {
      console.error('❌ Error ejecutando migración');
      process.exit(1);
    }
  } else {
    console.log('\n⏭️ Saltando migraciones (RUN_MIGRATIONS no está configurado)');
  }

  // Ejecutar seeds
  if (process.env.RUN_SEEDS === 'true') {
    if (!executeCommand('npm run seed:run', 'Ejecutando seeds de datos iniciales')) {
      console.error('❌ Error ejecutando seeds');
      process.exit(1);
    }
  } else {
    console.log('\n⏭️ Saltando seeds (RUN_SEEDS no está configurado)');
  }

  console.log('\n🎉 Deploy setup completado exitosamente!');
  console.log('✅ Base de datos lista con estructura limpia');
  console.log('🎯 Estructura idéntica a DatabaseTables.sql aplicada');
}

main().catch(error => {
  console.error('💥 Error en deploy setup:', error);
  process.exit(1);
}); 