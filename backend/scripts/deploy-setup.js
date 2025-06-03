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

async function main() {
  log('🚀 Iniciando configuración de deploy...');

  // Variables de entorno para controlar la ejecución
  const RUN_MIGRATIONS = process.env.RUN_MIGRATIONS === 'true';
  const RUN_SEEDS = process.env.RUN_SEEDS === 'true';
  const FORCE_SETUP = process.env.FORCE_SETUP === 'true';
  const IS_FIRST_DEPLOY = process.env.IS_FIRST_DEPLOY === 'true';

  log(`Variables de configuración:`);
  log(`- RUN_MIGRATIONS: ${RUN_MIGRATIONS}`);
  log(`- RUN_SEEDS: ${RUN_SEEDS}`);
  log(`- IS_FIRST_DEPLOY: ${IS_FIRST_DEPLOY}`);
  log(`- FORCE_SETUP: ${FORCE_SETUP}`);

  // Ejecutar migraciones si está habilitado o es el primer deploy
  if (RUN_MIGRATIONS || IS_FIRST_DEPLOY || FORCE_SETUP) {
    runCommand('npm run migration:run', 'Migraciones de base de datos');
  } else {
    log('⏭️  Saltando migraciones (RUN_MIGRATIONS=false)');
  }

  // Ejecutar seeds solo si está explícitamente habilitado o es el primer deploy
  if (RUN_SEEDS || IS_FIRST_DEPLOY || FORCE_SETUP) {
    runCommand('npm run seed', 'Seeds de base de datos');
  } else {
    log('⏭️  Saltando seeds (RUN_SEEDS=false)');
  }

  log('✅ Configuración de deploy completada');
}

main().catch(error => {
  log(`❌ Error fatal: ${error.message}`);
  process.exit(1);
}); 