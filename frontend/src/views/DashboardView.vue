<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="border-b border-gray-200 pb-5">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            ¡Hola, {{ authStore.userName }}!
          </h3>
          <p class="mt-2 max-w-4xl text-sm text-gray-500">
            Aquí tienes un resumen de la información de tus mascotas y próximas citas.
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Mascotas -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <HeartIcon class="h-8 w-8 text-vet-600" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Mis Mascotas
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.totalPets }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Próximas Citas -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <CalendarIcon class="h-8 w-8 text-primary-600" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Próximas Citas
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.upcomingAppointments }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Citas Este Mes -->
          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClipboardDocumentListIcon class="h-8 w-8 text-yellow-600" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Citas Este Mes
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.monthlyAppointments }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link
              to="/client/pets"
              class="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span class="rounded-lg inline-flex p-3 bg-vet-50 text-vet-700 ring-4 ring-white">
                  <PlusIcon class="h-6 w-6" />
                </span>
              </div>
              <div class="mt-8">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true" />
                  Registrar Mascota
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Añade una nueva mascota a tu cuenta
                </p>
              </div>
              <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                <ArrowTopRightOnSquareIcon class="h-6 w-6" />
              </span>
            </router-link>

            <router-link
              to="/client/appointments/new"
              class="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span class="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                  <CalendarIcon class="h-6 w-6" />
                </span>
              </div>
              <div class="mt-8">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true" />
                  Agendar Cita
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Programa una nueva cita veterinaria
                </p>
              </div>
              <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                <ArrowTopRightOnSquareIcon class="h-6 w-6" />
              </span>
            </router-link>

            <router-link
              to="/client/pets"
              class="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span class="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <HeartIcon class="h-6 w-6" />
                </span>
              </div>
              <div class="mt-8">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true" />
                  Ver Mascotas
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Consulta la información de tus mascotas
                </p>
              </div>
              <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                <ArrowTopRightOnSquareIcon class="h-6 w-6" />
              </span>
            </router-link>

            <router-link
              to="/client/appointments"
              class="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <ClipboardDocumentListIcon class="h-6 w-6" />
                </span>
              </div>
              <div class="mt-8">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true" />
                  Mis Citas
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Revisa y gestiona tus citas programadas
                </p>
              </div>
              <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                <ArrowTopRightOnSquareIcon class="h-6 w-6" />
              </span>
            </router-link>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Próximas Citas -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Próximas Citas</h3>
            </div>
            <div class="card-body">
              <div v-if="loading" class="flex justify-center py-4">
                <div class="loading-spinner"></div>
              </div>
              <div v-else-if="upcomingAppointments.length === 0" class="text-center py-6">
                <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay citas próximas</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Programa tu primera cita veterinaria.
                </p>
                <div class="mt-6">
                  <router-link to="/client/appointments/new" class="btn-primary">
                    Agendar Cita
                  </router-link>
                </div>
              </div>
              <ul v-else class="divide-y divide-gray-200">
                <li v-for="appointment in upcomingAppointments" :key="appointment.id" class="py-4">
                  <div class="flex space-x-3">
                    <div class="flex-1 space-y-1">
                      <div class="flex items-center justify-between">
                        <h3 class="text-sm font-medium">{{ appointment.pet?.name }}</h3>
                        <p class="text-sm text-gray-500">
                          {{ formatDate(appointment.scheduledAt) }}
                        </p>
                      </div>
                      <p class="text-sm text-gray-500">
                        {{ appointment.type }}
                      </p>
                      <div class="flex items-center space-x-2">
                        <span class="badge badge-info">
                          {{ appointment.status }}
                        </span>
                        <span class="text-xs text-gray-500">
                          Dr. {{ appointment.veterinarian?.user?.firstName }} {{ appointment.veterinarian?.user?.lastName }}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Mis Mascotas Recientes -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Mis Mascotas</h3>
            </div>
            <div class="card-body">
              <div v-if="loading" class="flex justify-center py-4">
                <div class="loading-spinner"></div>
              </div>
              <div v-else-if="recentPets.length === 0" class="text-center py-6">
                <HeartIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay mascotas registradas</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Registra tu primera mascota para comenzar.
                </p>
                <div class="mt-6">
                  <router-link to="/client/pets" class="btn-primary">
                    Registrar Mascota
                  </router-link>
                </div>
              </div>
              <ul v-else class="divide-y divide-gray-200">
                <li v-for="pet in recentPets" :key="pet.id" class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <HeartIcon class="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ pet.name }}
                      </p>
                      <p class="text-sm text-gray-500 truncate">
                        {{ pet.species }} • {{ calculateAge(pet.birthDate) }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <router-link
                        :to="`/client/pets/${pet.id}`"
                        class="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        Ver detalles
                      </router-link>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="recentPets.length > 0" class="mt-6">
                <router-link to="/client/pets" class="w-full btn-secondary">
                  Ver todas las mascotas
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'vue-toastification'
import { format, differenceInYears, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  HeartIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const toast = useToast()

// Estado reactivo
const loading = ref(true)
const upcomingAppointments = ref([])
const recentPets = ref([])

// Estadísticas computadas
const stats = computed(() => ({
  totalPets: recentPets.value.length,
  upcomingAppointments: upcomingAppointments.value.length,
  monthlyAppointments: upcomingAppointments.value.filter(appointment => {
    const appointmentDate = new Date(appointment.scheduledAt)
    const now = new Date()
    return appointmentDate.getMonth() === now.getMonth() && 
           appointmentDate.getFullYear() === now.getFullYear()
  }).length
}))

// Métodos utilitarios
const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'PPp', { locale: es })
  } catch (error) {
    return 'Fecha inválida'
  }
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 'Edad desconocida'
  try {
    const age = differenceInYears(new Date(), parseISO(birthDate))
    return age === 0 ? 'Menos de 1 año' : `${age} ${age === 1 ? 'año' : 'años'}`
  } catch (error) {
    return 'Edad desconocida'
  }
}

// Cargar datos del dashboard
const loadDashboardData = async () => {
  try {
    loading.value = true
    
    // Cargar datos reales del cliente
    await Promise.all([
      loadMyPets(),
      loadUpcomingAppointments()
    ])
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    toast.error('Error al cargar los datos del dashboard')
  } finally {
    loading.value = false
  }
}

// Cargar mascotas del cliente
const loadMyPets = async () => {
  try {
    // Importar el servicio dinámicamente
    const petService = (await import('../services/petService')).default
    const response = await petService.getMyPets()
    recentPets.value = response.data || response || []
  } catch (error) {
    console.error('Error loading pets:', error)
    recentPets.value = []
  }
}

// Cargar citas próximas del cliente
const loadUpcomingAppointments = async () => {
  try {
    // Importar el servicio dinámicamente
    const appointmentService = (await import('../services/appointmentService')).default
    const response = await appointmentService.getAppointments({
      myAppointments: true,
      status: 'SCHEDULED',
      limit: 5
    })
    upcomingAppointments.value = response.data || response || []
  } catch (error) {
    console.error('Error loading appointments:', error)
    upcomingAppointments.value = []
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  loadDashboardData()
})
</script> 