<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <!-- 404 Icon -->
        <div class="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-vet-100">
          <ExclamationTriangleIcon class="h-16 w-16 text-vet-600" />
        </div>
        
        <!-- Error Message -->
        <h1 class="mt-6 text-6xl font-bold text-gray-900">404</h1>
        <h2 class="mt-2 text-3xl font-bold text-gray-900">Página no encontrada</h2>
        <p class="mt-4 text-lg text-gray-600">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <!-- Action Buttons -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goBack"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Volver atrás
          </button>
          
          <router-link
            :to="homeRoute"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500"
          >
            <HomeIcon class="h-4 w-4 mr-2" />
            Ir al inicio
          </router-link>
        </div>
        
        <!-- Help Links -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">
            ¿Necesitas ayuda? 
            <a href="mailto:soporte@vetai.com" class="font-medium text-vet-600 hover:text-vet-500">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Heroicons
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  HomeIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

// Computed properties
const homeRoute = computed(() => {
  if (!authStore.isAuthenticated) {
    return '/login'
  }
  
  const userRole = authStore.userRole
  if (userRole === 'VET') {
    return '/vet'
  } else if (userRole === 'ADMIN') {
    return '/admin'
  } else {
    return '/dashboard'
  }
})

// Methods
const goBack = () => {
  // If there's history, go back, otherwise go to home
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push(homeRoute.value)
  }
}
</script>
