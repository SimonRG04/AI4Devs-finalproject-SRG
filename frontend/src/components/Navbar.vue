<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link :to="homeRoute" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-vet-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">V</span>
              </div>
              <span class="text-xl font-bold text-gray-900">VetAI Connect</span>
            </router-link>
          </div>

          <!-- Navigation Links (Desktop) -->
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.href"
              :class="[
                item.current
                  ? 'border-vet-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
              ]"
            >
              <component :is="item.icon" class="h-5 w-5 mr-2" />
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- User Menu -->
        <div class="flex items-center">
          <!-- Notifications Bell -->
          <button
            type="button"
            class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500"
          >
            <span class="sr-only">Ver notificaciones</span>
            <BellIcon class="h-6 w-6" />
          </button>

          <!-- Profile Dropdown -->
          <Popover class="ml-3 relative">
            <PopoverButton class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500">
              <span class="sr-only">Abrir menú de usuario</span>
              <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon class="h-5 w-5 text-gray-600" />
              </div>
            </PopoverButton>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <PopoverPanel class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <p class="font-medium">{{ user?.first_name }} {{ user?.last_name }}</p>
                  <p class="text-xs text-gray-500">{{ user?.email }}</p>
                </div>
                
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </router-link>
                
                <router-link
                  v-if="userRole === 'VET'"
                  to="/vet/schedule"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Horario
                </router-link>
                
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </PopoverPanel>
            </transition>
          </Popover>

          <!-- Mobile menu button -->
          <DisclosureButton class="md:hidden ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-vet-500">
            <span class="sr-only">Abrir menú principal</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" />
            <XMarkIcon v-else class="block h-6 w-6" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <DisclosurePanel class="md:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          :class="[
            item.current
              ? 'bg-vet-50 border-vet-500 text-vet-700'
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
            'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
          ]"
        >
          <div class="flex items-center">
            <component :is="item.icon" class="h-5 w-5 mr-3" />
            {{ item.name }}
          </div>
        </router-link>
      </div>
      
      <!-- Mobile User Menu -->
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="px-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon class="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user?.first_name }} {{ user?.last_name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
            </div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <router-link
            to="/profile"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Mi Perfil
          </router-link>
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </DisclosurePanel>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

// Heroicons
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon, 
  BellIcon,
  HomeIcon,
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  UsersIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Computed properties
const user = computed(() => authStore.user)
const userRole = computed(() => authStore.userRole)

const homeRoute = computed(() => {
  switch (userRole.value) {
    case 'CLIENT':
      return '/dashboard'
    case 'VET':
      return '/vet'
    case 'ADMIN':
      return '/admin'
    default:
      return '/'
  }
})

const isCurrentRoute = (path) => {
  return route.path.startsWith(path)
}

const navigationItems = computed(() => {
  const items = []
  
  if (userRole.value === 'CLIENT') {
    items.push(
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: isCurrentRoute('/dashboard') },
      { name: 'Mis Mascotas', href: '/client/pets', icon: HeartIcon, current: isCurrentRoute('/client/pets') },
      { name: 'Mis Citas', href: '/client/appointments', icon: CalendarIcon, current: isCurrentRoute('/client/appointments') }
    )
  } else if (userRole.value === 'VET') {
    items.push(
      { name: 'Dashboard', href: '/vet', icon: HomeIcon, current: isCurrentRoute('/vet') },
      { name: 'Pacientes', href: '/vet/patients', icon: HeartIcon, current: isCurrentRoute('/vet/patients') },
      { name: 'Citas', href: '/vet/appointments', icon: CalendarIcon, current: isCurrentRoute('/vet/appointments') },
      { name: 'Registros Médicos', href: '/vet/medical-records', icon: DocumentTextIcon, current: isCurrentRoute('/vet/medical-records') },
      { name: 'Horarios', href: '/vet/schedule', icon: ClockIcon, current: isCurrentRoute('/vet/schedule') }
    )
  } else if (userRole.value === 'ADMIN') {
    items.push(
      { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: isCurrentRoute('/admin') },
      { name: 'Usuarios', href: '/admin/users', icon: UsersIcon, current: isCurrentRoute('/admin/users') },
      { name: 'Configuración', href: '/admin/settings', icon: CogIcon, current: isCurrentRoute('/admin/settings') }
    )
  }
  
  return items
})

// Methods
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>