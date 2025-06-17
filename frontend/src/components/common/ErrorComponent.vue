<template>
  <div 
    class="error-component"
    :class="containerClasses"
  >
    <div class="error-content">
      <!-- Icono de error -->
      <div class="error-icon">
        <svg 
          class="w-12 h-12 text-red-500"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <!-- Título del error -->
      <h3 class="error-title">
        {{ title || 'Ha ocurrido un error' }}
      </h3>

      <!-- Mensaje del error -->
      <p class="error-message">
        {{ message || 'Algo salió mal. Por favor, intenta nuevamente.' }}
      </p>

      <!-- Detalles técnicos (solo en desarrollo) -->
      <details 
        v-if="showDetails && isDev" 
        class="error-details"
      >
        <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          Detalles técnicos
        </summary>
        <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{{ errorDetails }}</pre>
      </details>

      <!-- Botones de acción -->
      <div class="error-actions">
        <button
          v-if="showRetry"
          @click="$emit('retry')"
          class="btn-retry"
        >
          {{ retryText }}
        </button>
        
        <button
          v-if="showGoBack"
          @click="goBack"
          class="btn-back"
        >
          {{ backText }}
        </button>
        
        <button
          v-if="showHome"
          @click="goHome"
          class="btn-home"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  message: {
    type: String,
    default: null
  },
  error: {
    type: [Error, Object],
    default: null
  },
  centered: {
    type: Boolean,
    default: true
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  showGoBack: {
    type: Boolean,
    default: true
  },
  showHome: {
    type: Boolean,
    default: false
  },
  showDetails: {
    type: Boolean,
    default: true
  },
  retryText: {
    type: String,
    default: 'Reintentar'
  },
  backText: {
    type: String,
    default: 'Volver'
  }
})

const emit = defineEmits(['retry'])

const router = useRouter()

const isDev = computed(() => import.meta.env.DEV)

const containerClasses = computed(() => [
  'p-6 bg-white rounded-lg shadow-sm border border-red-200',
  {
    'flex items-center justify-center min-h-64': props.centered
  }
])

const errorDetails = computed(() => {
  if (!props.error) return null
  
  return JSON.stringify({
    name: props.error.name,
    message: props.error.message,
    stack: props.error.stack,
    ...props.error
  }, null, 2)
})

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-component {
  @apply max-w-md mx-auto;
}

.error-content {
  @apply text-center space-y-4;
}

.error-icon {
  @apply flex justify-center;
}

.error-title {
  @apply text-lg font-semibold text-gray-900;
}

.error-message {
  @apply text-gray-600;
}

.error-details {
  @apply text-left mt-4;
}

.error-details pre {
  @apply max-h-32;
}

.error-actions {
  @apply flex flex-col sm:flex-row gap-3 justify-center pt-4;
}

.btn-retry {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}

.btn-back {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors;
}

.btn-home {
  @apply px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors;
}
</style> 