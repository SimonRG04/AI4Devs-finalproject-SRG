<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="statusConfig.bgColor"
          >
            <svg class="w-6 h-6" :class="statusConfig.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="statusConfig.icon" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Prediagnóstico con IA</h3>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <span>{{ formatDate(diagnosis.createdAt) }}</span>
              <span v-if="diagnosis.pet">• {{ diagnosis.pet.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- Estado del diagnóstico -->
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :class="`bg-${statusConfig.color}-100 text-${statusConfig.color}-800`"
          >
            <div v-if="diagnosis.status === 'PROCESSING'" 
              class="w-3 h-3 mr-2 rounded-full animate-pulse bg-blue-600"
            ></div>
            {{ statusConfig.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="diagnosis.status === 'PROCESSING'" class="px-6 py-8">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Analizando síntomas con inteligencia artificial...</p>
        <p class="text-sm text-gray-500 mt-2">Esto puede tomar unos momentos</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="diagnosis.status === 'FAILED'" class="px-6 py-8">
      <div class="text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-900 font-medium mb-2">Error en el procesamiento</p>
        <p class="text-gray-600 text-sm">{{ diagnosis.errorMessage || 'No se pudo completar el análisis' }}</p>
        <button 
          @click="$emit('retry', diagnosis.id)"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>

    <!-- Completed Results -->
    <div v-else-if="diagnosis.status === 'COMPLETED' && diagnosis.results" class="px-6 py-6 space-y-6">
      <!-- Síntomas analizados -->
      <div v-if="diagnosis.description">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Síntomas analizados:</h4>
        <p class="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">{{ diagnosis.description }}</p>
      </div>

      <!-- Condiciones posibles -->
      <div v-if="diagnosis.results.conditions?.length">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Condiciones posibles:</h4>
        <div class="space-y-3">
          <div 
            v-for="(condition, index) in diagnosis.results.conditions" 
            :key="index"
            class="border rounded-lg p-4"
            :class="index === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'"
          >
            <div class="flex items-center justify-between mb-2">
              <h5 class="font-medium text-gray-900">{{ condition.name }}</h5>
              <div class="flex items-center space-x-2">
                <div class="flex items-center">
                  <span class="text-sm text-gray-600">{{ Math.round(condition.probability * 100) }}%</span>
                  <div class="w-16 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      class="h-2 rounded-full"
                      :class="getSeverityColor(condition.severity)"
                      :style="{ width: `${condition.probability * 100}%` }"
                    ></div>
                  </div>
                </div>
                <span 
                  class="inline-flex px-2 py-1 text-xs rounded-full"
                  :class="getSeverityClasses(condition.severity)"
                >
                  {{ formatSeverity(condition.severity) }}
                </span>
              </div>
            </div>
            <p class="text-gray-600 text-sm">{{ condition.description }}</p>
          </div>
        </div>
      </div>

      <!-- Recomendaciones -->
      <div v-if="diagnosis.results.recommendations?.length">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Recomendaciones:</h4>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <ul class="space-y-2">
            <li 
              v-for="(recommendation, index) in diagnosis.results.recommendations" 
              :key="index"
              class="flex items-start space-x-2 text-sm text-green-800"
            >
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ recommendation }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Nivel de urgencia -->
      <div v-if="diagnosis.results.metadata?.urgencyLevel">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Nivel de urgencia:</h4>
        <div class="flex items-center space-x-3">
          <span 
            class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium"
            :class="getUrgencyClasses(diagnosis.results.metadata.urgencyLevel)"
          >
            <span class="w-2 h-2 rounded-full mr-2" 
              :class="getUrgencyDotColor(diagnosis.results.metadata.urgencyLevel)"
            ></span>
            {{ formatUrgency(diagnosis.results.metadata.urgencyLevel) }}
          </span>
          <span class="text-sm text-gray-600">
            {{ getUrgencyDescription(diagnosis.results.metadata.urgencyLevel) }}
          </span>
        </div>
      </div>

      <!-- Nivel de confianza -->
      <div v-if="diagnosis.confidence">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Nivel de confianza:</h4>
        <div class="flex items-center space-x-3">
          <div class="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              class="h-3 rounded-full transition-all duration-300"
              :class="getConfidenceColor(diagnosis.confidence)"
              :style="{ width: `${diagnosis.confidence * 100}%` }"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-700">
            {{ Math.round(diagnosis.confidence * 100) }}%
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ getConfidenceDescription(diagnosis.confidence) }}
        </p>
      </div>

      <!-- Disclaimer -->
      <div v-if="diagnosis.results.metadata?.disclaimer" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p class="text-sm text-yellow-800">{{ diagnosis.results.metadata.disclaimer }}</p>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div v-if="diagnosis.status === 'COMPLETED'" class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500">
          Procesado: {{ formatDate(diagnosis.processedAt) }}
        </div>
        <div class="flex items-center space-x-3">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import diagnosisService from '@/services/diagnosisService'

const props = defineProps({
  diagnosis: {
    type: Object,
    required: true
  }
})

defineEmits(['retry', 'share', 'schedule'])

// Computed properties
const statusConfig = computed(() => {
  const configs = {
    'PENDING': {
      text: 'Pendiente',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    'PROCESSING': {
      text: 'Procesando',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    },
    'COMPLETED': {
      text: 'Completado',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      icon: 'M5 13l4 4L19 7'
    },
    'FAILED': {
      text: 'Fallido',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }
  return configs[props.diagnosis.status] || configs['PENDING']
})

// Methods
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatSeverity = (severity) => {
  const map = {
    'LOW': 'Bajo',
    'MEDIUM': 'Medio',
    'HIGH': 'Alto'
  }
  return map[severity] || severity
}

const formatUrgency = (urgency) => {
  const map = {
    'LOW': 'Baja',
    'MEDIUM': 'Media',
    'HIGH': 'Alta',
    'URGENT': 'Urgente'
  }
  return map[urgency] || urgency
}

const getSeverityColor = (severity) => {
  const colors = {
    'LOW': 'bg-green-500',
    'MEDIUM': 'bg-yellow-500',
    'HIGH': 'bg-red-500'
  }
  return colors[severity] || 'bg-gray-500'
}

const getSeverityClasses = (severity) => {
  const classes = {
    'LOW': 'bg-green-100 text-green-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'HIGH': 'bg-red-100 text-red-800'
  }
  return classes[severity] || 'bg-gray-100 text-gray-800'
}

const getUrgencyClasses = (urgency) => {
  const classes = {
    'LOW': 'bg-green-100 text-green-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'URGENT': 'bg-red-100 text-red-800'
  }
  return classes[urgency] || 'bg-gray-100 text-gray-800'
}

const getUrgencyDotColor = (urgency) => {
  const colors = {
    'LOW': 'bg-green-500',
    'MEDIUM': 'bg-yellow-500',
    'HIGH': 'bg-orange-500',
    'URGENT': 'bg-red-500'
  }
  return colors[urgency] || 'bg-gray-500'
}

const getUrgencyDescription = (urgency) => {
  const descriptions = {
    'LOW': 'Monitoreo recomendado',
    'MEDIUM': 'Consulta en los próximos días',
    'HIGH': 'Consulta pronto recomendada',
    'URGENT': 'Consulta inmediata necesaria'
  }
  return descriptions[urgency] || ''
}

const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return 'bg-green-500'
  if (confidence >= 0.6) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getConfidenceDescription = (confidence) => {
  if (confidence >= 0.8) return 'Alta confianza en el análisis'
  if (confidence >= 0.6) return 'Confianza moderada'
  return 'Confianza baja - Recomendamos consulta veterinaria'
}
</script> 