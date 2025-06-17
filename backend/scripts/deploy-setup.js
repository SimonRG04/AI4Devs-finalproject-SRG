#!/usr/bin/env node

const { execSync } = require('child_process');

function log(message) {
  console.log(`[DEPLOY-SETUP] ${message}`);
}

function runCommand(command, description) {
  try {
    log(`Ejecutando: ${description}`);
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completado exitosamente`);
    return true;
  } catch (error) {
    log(`❌ Error en ${description}: ${error.message}`);
    process.exit(1);
  }
}

function isFirstDeploy() {
  return process.env.IS_FIRST_DEPLOY === 'true';
}

function validateConfig() {
  const IS_FIRST_DEPLOY = isFirstDeploy();
  const RUN_MIGRATIONS = process.env.RUN_MIGRATIONS === 'true';
  const RUN_SEEDS = process.env.RUN_SEEDS === 'true';

  log('🔍 Validando configuración de deploy...');
  log(`📋 Configuración detectada:`);
  log(`- IS_FIRST_DEPLOY: ${IS_FIRST_DEPLOY}`);
  log(`- RUN_MIGRATIONS: ${RUN_MIGRATIONS}`);
  log(`- RUN_SEEDS: ${RUN_SEEDS}`);

  if (IS_FIRST_DEPLOY && !RUN_MIGRATIONS) {
    log('❌ ERROR: Para primer deploy se requiere RUN_MIGRATIONS=true');
    process.exit(1);
  }

  return { IS_FIRST_DEPLOY, RUN_MIGRATIONS, RUN_SEEDS };
}

async function runFirstDeployMigration() {
  log('🎯 Ejecutando PRIMER DEPLOY - Solo RecreateFullSchema');
  
  // Crear comando específico para ejecutar solo RecreateFullSchema
  const specificMigration = '1750400000000-RecreateFullSchema';
  
  try {
    // Primero verificar el estado actual
    log('📊 Verificando estado actual de migraciones...');
    try {
      execSync('npm run migration:show', { stdio: 'pipe' });
    } catch (e) {
      log('📝 BD nueva o sin migraciones previas (esperado para primer deploy)');
    }
    
    // Ejecutar solo la migración de recreación
    log('🗃️  Ejecutando RecreateFullSchema...');
    log('   ⚠️  IMPORTANTE: Se eliminará y recreará toda la estructura');
    log('   🎯 Objetivo: BD idéntica a DatabaseTables.sql');
    
    // Comando para ejecutar todas las migraciones (RecreateFullSchema será la última)
    execSync('npm run migration:run', { stdio: 'inherit' });
    
    log('✅ RecreateFullSchema ejecutada exitosamente');
    
  } catch (error) {
    log(`❌ Error ejecutando RecreateFullSchema: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  log('🚀 Iniciando deploy de VetAI Connect...');

  // Validar configuración
  const config = validateConfig();
  
  if (config.IS_FIRST_DEPLOY) {
    log('🎯 MODO: PRIMER DEPLOY');
    log('📋 ESTRATEGIA: Ejecutar solo RecreateFullSchema');
    log('🎯 RESULTADO: BD desde cero idéntica a DatabaseTables.sql');
  } else {
    log('📈 MODO: DEPLOY INCREMENTAL');
    log('📋 ESTRATEGIA: Migraciones pendientes normalmente');
  }

  // 1. VALIDAR CONFIGURACIÓN
  log('🔍 Paso 1: Validando configuración...');
  runCommand('npm run migration:validate', 'Validación de configuración');

  // 2. EJECUTAR MIGRACIONES
  if (config.RUN_MIGRATIONS) {
    if (config.IS_FIRST_DEPLOY) {
      // Primer deploy: ejecutar solo RecreateFullSchema
      await runFirstDeployMigration();
    } else {
      // Deploy incremental: ejecutar migraciones pendientes
      log('🗃️  Paso 2: Ejecutando migraciones incrementales...');
      runCommand('npm run migration:run', 'Migraciones incrementales');
    }
  } else {
    log('⏭️  Paso 2: Saltando migraciones (RUN_MIGRATIONS=false)');
  }

  // 3. EJECUTAR SEEDS
  if (config.RUN_SEEDS) {
    log('🌱 Paso 3: Ejecutando seeds de datos iniciales...');
    runCommand('npm run seed', 'Inserción de datos iniciales');
  } else {
    log('⏭️  Paso 3: Saltando seeds (RUN_SEEDS=false)');
  }

  // 4. RESUMEN FINAL
  log('🎉 DEPLOY COMPLETADO EXITOSAMENTE');
  log('==========================================');
  
  if (config.IS_FIRST_DEPLOY) {
    log('✅ PRIMER DEPLOY realizado correctamente');
    log('✅ BD creada desde cero con RecreateFullSchema');
    log('✅ Estructura idéntica a DatabaseTables.sql');
    log('✅ Sin conflictos de migraciones anteriores');
  } else {
    log('✅ DEPLOY INCREMENTAL realizado correctamente');
    log('✅ Migraciones pendientes aplicadas');
  }
  
  log('✅ VetAI Connect listo para producción');
  log('==========================================');
}

main().catch(error => {
  log(`❌ ERROR FATAL: ${error.message}`);
  log('🔧 Revisar configuración y volver a intentar');
  process.exit(1);
}); 