<template>
  <Disclosure as="nav" class="bg-white border-b border-gray-200 fixed w-full z-30 top-0" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo y navegación principal -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/dashboard" class="flex items-center">
              <HeartIcon class="h-8 w-8 text-primary-600" />
              <span class="ml-2 text-xl font-bold text-gray-900">VetAI Connect</span>
            </router-link>
          </div>
          
          <!-- Navegación desktop -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <template v-if="authStore.isClient">
              <router-link
                to="/dashboard"
                class="nav-link"
                :class="{ 'nav-link-active': route.name === 'dashboard' }"
              >
                Dashboard
              </router-link>
              <router-link
                to="/pets"
                class="nav-link"
                :class="{ 'nav-link-active': route.name?.includes('pet') }"
              >
                Mis Mascotas
              </router-link>
              <router-link
                to="/appointments"
                class="nav-link"
                :class="{ 'nav-link-active': route.name?.includes('appointment') }"
              >
                Citas
              </router-link>
            </template>
            
            <template v-else-if="authStore.isVet">
              <router-link
                to="/vet"
                class="nav-link"
                :class="{ 'nav-link-active': route.name === 'vet-dashboard' }"
              >
                Dashboard
              </router-link>
              <router-link
                to="/vet/patients"
                class="nav-link"
                :class="{ 'nav-link-active': route.name === 'vet-patients' }"
              >
                Pacientes
              </router-link>
              <router-link
                to="/vet/schedule"
                class="nav-link"
                :class="{ 'nav-link-active': route.name === 'vet-schedule' }"
              >
                Agenda
              </router-link>
              <router-link
                to="/vet/medical-records"
                class="nav-link"
                :class="{ 'nav-link-active': route.name === 'medical-records' }"
              >
                Registros Médicos
              </router-link>
            </template>
          </div>
        </div>
        
        <!-- Acciones de usuario -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Notificaciones -->
          <button
            type="button"
            class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span class="sr-only">Ver notificaciones</span>
            <BellIcon class="h-6 w-6" />
          </button>
          
          <!-- Menú de perfil -->
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton class="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <span class="sr-only">Abrir menú de usuario</span>
                <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon class="h-5 w-5 text-primary-600" />
                </div>
              </MenuButton>
            </div>
            
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <div class="font-medium">{{ authStore.userName }}</div>
                  <div class="text-gray-500">{{ authStore.user?.email }}</div>
                </div>
                
                <MenuItem v-slot="{ active }">
                  <router-link
                    to="/profile"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    ]"
                  >
                    Mi Perfil
                  </router-link>
                </MenuItem>
                
                <MenuItem v-slot="{ active }">
                  <button
                    @click="handleLogout"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block w-full text-left px-4 py-2 text-sm text-gray-700'
                    ]"
                  >
                    Cerrar Sesión
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        
        <!-- Menú móvil button -->
        <div class="-mr-2 flex items-center sm:hidden">
          <DisclosureButton class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
            <span class="sr-only">Abrir menú principal</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" />
            <XMarkIcon v-else class="block h-6 w-6" />
          </DisclosureButton>
        </div>
      </div>
    </div>
    
    <!-- Menú móvil -->
    <DisclosurePanel class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <template v-if="authStore.isClient">
          <DisclosureButton
            as="router-link"
            to="/dashboard"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': route.name === 'dashboard' }"
          >
            Dashboard
          </DisclosureButton>
          <DisclosureButton
            as="router-link"
            to="/pets"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': route.name?.includes('pet') }"
          >
            Mis Mascotas
          </DisclosureButton>
          <DisclosureButton
            as="router-link"
            to="/appointments"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': route.name?.includes('appointment') }"
          >
            Citas
          </DisclosureButton>
        </template>
        
        <template v-else-if="authStore.isVet">
          <DisclosureButton
            as="router-link"
            to="/vet"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': route.name === 'vet-dashboard' }"
          >
            Dashboard
          </DisclosureButton>
          <DisclosureButton
            as="router-link"
            to="/vet/patients"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': route.name === 'vet-patients' }"
          >
            Pacientes
          </DisclosureButton>
          <DisclosureButton
            as="router-link"
            to="/vet/schedule"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': route.name === 'vet-schedule' }"
          >
            Agenda
          </DisclosureButton>
        </template>
      </div>
      
      <!-- Usuario móvil -->
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <UserIcon class="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ authStore.userName }}</div>
            <div class="text-sm font-medium text-gray-500">{{ authStore.user?.email }}</div>
          </div>
          <button
            type="button"
            class="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span class="sr-only">Ver notificaciones</span>
            <BellIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="mt-3 space-y-1">
          <DisclosureButton
            as="router-link"
            to="/profile"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Mi Perfil
          </DisclosureButton>
          <DisclosureButton
            as="button"
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Cerrar Sesión
          </DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from 'vue-toastification'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('Sesión cerrada correctamente')
    router.push('/login')
  } catch (error) {
    toast.error('Error al cerrar sesión')
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.nav-link {
  @apply border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200;
}

.nav-link-active {
  @apply border-primary-500 text-gray-900;
}

.mobile-nav-link {
  @apply border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200;
}

.mobile-nav-link-active {
  @apply bg-primary-50 border-primary-500 text-primary-700;
}
</style> 