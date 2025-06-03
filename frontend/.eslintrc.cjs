/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Permitir console.log en desarrollo
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // Reglas de Vue
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'warn',
    
    // Reglas generales
    'no-unused-vars': 'warn',
    'prefer-const': 'warn',
    'no-var': 'error'
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  }
} 