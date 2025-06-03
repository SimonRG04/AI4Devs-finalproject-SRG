<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <Navbar v-if="showNavbar" />
    
    <!-- Main Content -->
    <main :class="mainClasses">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Toast Container -->
    <Toast />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Navbar from './components/layout/Navbar.vue'
import Toast from 'primevue/toast'

const route = useRoute()
const authStore = useAuthStore()

// Ocultar navbar en ciertas páginas
const showNavbar = computed(() => {
  const hiddenRoutes = ['login', 'register', 'home']
  return !hiddenRoutes.includes(route.name) && authStore.isAuthenticated
})

// Clases dinámicas para el contenido principal
const mainClasses = computed(() => {
  if (!showNavbar.value) {
    return 'w-full'
  }
  return 'pt-16' // Espacio para navbar fijo
})
</script>

<style>
/* Transiciones de páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos globales de la app */
#app {
  font-family: 'Inter', ui-sans-serif, system-ui;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Personalización de scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Estilos para PrimeVue */
.p-toast {
  z-index: 9999;
}

/* Mejoras de accesibilidad */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style> 