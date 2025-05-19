<template>
  <div class="min-h-screen flex flex-col">
    <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto w-full">
      <h1 class="text-2xl font-bold text-blue-700 mb-4">Prueba de conectividad</h1>
      
      <div v-if="loading" class="flex justify-center my-6">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>
      
      <div v-else-if="backendResponse" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-4">
        <h2 class="font-bold text-lg">¡Conexión exitosa!</h2>
        <p class="mt-2"><strong>Mensaje:</strong> {{ backendResponse.message }}</p>
        <p><strong>Timestamp:</strong> {{ new Date(backendResponse.timestamp).toLocaleString() }}</p>
      </div>
      
      <button 
        @click="testConnection" 
        class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        :disabled="loading"
      >
        {{ loading ? 'Probando...' : 'Probar conexión con backend' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApiStore } from '../stores/api'

const apiStore = useApiStore()
const loading = ref(false)
const error = ref(null)
const backendResponse = ref(null)

const testConnection = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiStore.testConnection()
    backendResponse.value = response
  } catch (err) {
    error.value = err.message || 'Error desconocido al conectar con el backend'
  } finally {
    loading.value = false
  }
}

// Probar la conexión automáticamente al cargar la vista
testConnection()
</script> 