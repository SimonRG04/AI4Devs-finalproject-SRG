<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Veterinario</h1>
        <p class="mt-2 text-gray-600">
          Bienvenido Dr. {{ user?.first_name }} {{ user?.last_name }}
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CalendarIcon class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Citas Hoy</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.todayAppointments }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link :to="{ name: 'vet-appointments', query: { date: today } }" class="font-medium text-blue-600 hover:text-blue-500">
                Ver todas
              </router-link>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClockIcon class="h-6 w-6 text-yellow-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Próximas Citas</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.upcomingAppointments }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link to="/vet/appointments" class="font-medium text-yellow-600 hover:text-yellow-500">
                Ver agenda
              </router-link>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <span class="text-green-400 text-2xl">🐾</span>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Pacientes</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalPatients }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link to="/vet/patients" class="font-medium text-green-600 hover:text-green-500">
                Ver pacientes
              </router-link>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Alertas Médicas</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.patientsWithAlerts }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link :to="{ name: 'vet-patients', query: { alerts: 'with' } }" class="font-medium text-red-600 hover:text-red-500">
                Revisar alertas
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Citas de Hoy -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Citas de Hoy</h3>
                <router-link 
                  to="/vet/appointments/new"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
                >
                  <PlusIcon class="h-4 w-4 mr-1" />
                  Nueva Cita
                </router-link>
              </div>

              <!-- Loading -->
              <div v-if="loadingAppointments" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-vet-600"></div>
              </div>

              <!-- Empty State -->
              <div v-else-if="todayAppointments.length === 0" class="text-center py-8">
                <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay citas programadas</h3>
                <p class="mt-1 text-sm text-gray-500">¡Perfecto día para ponerse al día!</p>
              </div>

              <!-- Appointments List -->
              <div v-else class="space-y-4">
                <div
                  v-for="appointment in todayAppointments"
                  :key="appointment.id"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <img
                          v-if="appointment.pet?.photo_url"
                          :src="appointment.pet.photo_url"
                          :alt="appointment.pet.name"
                          class="h-10 w-10 rounded-full object-cover"
                        />
                        <div v-else class="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span class="text-gray-500 text-lg">🐾</span>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">{{ appointment.pet?.name }}</h4>
                        <p class="text-sm text-gray-500">
                          {{ appointment.pet?.client?.user?.first_name }} {{ appointment.pet?.client?.user?.last_name }}
                        </p>
                        <p class="text-xs text-gray-400">{{ appointment.reason }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <div class="text-right">
                        <p class="text-sm font-medium text-gray-900">{{ formatTime(appointment.dateTime) }}</p>
                        <p class="text-xs text-gray-500">{{ appointment.durationMinutes }} min</p>
                      </div>
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(appointment.status)
                        ]"
                      >
                        {{ getStatusText(appointment.status) }}
                      </span>
                      <div class="flex space-x-2">
                        <button
                          @click="viewAppointment(appointment)"
                          class="text-vet-600 hover:text-vet-700 text-sm font-medium"
                        >
                          Ver
                        </button>
                        <button
                          v-if="appointment.status === 'SCHEDULED'"
                          @click="confirmAppointment(appointment)"
                          class="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Recent Activity -->
        <div class="space-y-8">
          <!-- Quick Actions -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div class="space-y-3">
                <router-link
                  to="/vet/appointments/new"
                  class="w-full flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700"
                >
                  <CalendarIcon class="h-4 w-4 mr-2" />
                  Agendar Cita
                </router-link>
                <router-link
                  to="/vet/patients"
                  class="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span class="mr-2">🐾</span>
                  Ver Pacientes
                </router-link>
                <router-link
                  to="/vet/medical-records"
                  class="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DocumentTextIcon class="h-4 w-4 mr-2" />
                  Registros Médicos
                </router-link>
                <router-link
                  to="/vet/schedule"
                  class="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ClockIcon class="h-4 w-4 mr-2" />
                  Horarios
                </router-link>
              </div>
            </div>
          </div>

          <!-- Recent Patients -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Pacientes Recientes</h3>
                <router-link to="/vet/patients" class="text-sm text-vet-600 hover:text-vet-700">
                  Ver todos
                </router-link>
              </div>

              <!-- Loading -->
              <div v-if="loadingPatients" class="flex justify-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-vet-600"></div>
              </div>

              <!-- Patients List -->
              <div v-else class="space-y-3">
                <div
                  v-for="patient in recentPatients"
                  :key="patient.id"
                  @click="viewPatient(patient)"
                  class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <img
                    v-if="patient.photo_url"
                    :src="patient.photo_url"
                    :alt="patient.name"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div v-else class="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-500 text-sm">🐾</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ patient.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ patient.species }} • {{ patient.breed }}</p>
                  </div>
                  <div v-if="patient.medical_alerts" class="flex-shrink-0">
                    <ExclamationTriangleIcon class="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Heroicons
import { 
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

// Services
import appointmentService from '@/services/appointmentService'
import petService from '@/services/petService'
import veterinarianService from '@/services/veterinarianService'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// Reactive data
const loadingAppointments = ref(false)
const loadingPatients = ref(false)
const todayAppointments = ref([])
const recentPatients = ref([])
const stats = ref({
  todayAppointments: 0,
  upcomingAppointments: 0,
  totalPatients: 0,
  patientsWithAlerts: 0
})

// Computed
const user = computed(() => authStore.user)
const today = computed(() => format(new Date(), 'yyyy-MM-dd'))

// Methods
const loadDashboardData = async () => {
  try {
    await Promise.all([
      loadTodayAppointments(),
      loadRecentPatients(),
      loadStats()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    toast.error('Error al cargar el dashboard')
  }
}

const loadTodayAppointments = async () => {
  try {
    loadingAppointments.value = true
    const response = await appointmentService.getTodayAppointments()
    todayAppointments.value = response.data || response || []
    stats.value.todayAppointments = todayAppointments.value.length
  } catch (error) {
    console.error('Error loading today appointments:', error)
  } finally {
    loadingAppointments.value = false
  }
}

const loadRecentPatients = async () => {
  try {
    loadingPatients.value = true
    const response = await petService.getAllPets(1, 10)
    recentPatients.value = (response.data || response.pets || []).slice(0, 5)
  } catch (error) {
    console.error('Error loading recent patients:', error)
  } finally {
    loadingPatients.value = false
  }
}

const loadStats = async () => {
  try {
    const [upcomingResponse, patientsResponse, statsResponse] = await Promise.all([
      appointmentService.getUpcomingAppointments(10),
      petService.getAllPets(1, 100),
      veterinarianService.getVeterinarianStats()
    ])

    stats.value.upcomingAppointments = (upcomingResponse.data || upcomingResponse || []).length
    
    const patients = patientsResponse.data || patientsResponse.pets || []
    stats.value.totalPatients = patients.length
    stats.value.patientsWithAlerts = patients.filter(p => p.medical_alerts).length

    // Merge with existing stats from API if available
    if (statsResponse.data) {
      stats.value = { ...stats.value, ...statsResponse.data }
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const formatTime = (dateTime) => {
  return format(parseISO(dateTime), 'HH:mm', { locale: es })
}

const getStatusColor = (status) => {
  const colors = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    SCHEDULED: 'Programada',
    CONFIRMED: 'Confirmada',
    IN_PROGRESS: 'En Progreso',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada'
  }
  return texts[status] || status
}

const viewAppointment = (appointment) => {
  router.push(`/vet/appointments/${appointment.id}`)
}

const viewPatient = (patient) => {
  router.push(`/vet/patients/${patient.id}`)
}

const confirmAppointment = async (appointment) => {
  try {
    await appointmentService.confirmAppointment(appointment.id)
    toast.success('Cita confirmada exitosamente')
    loadTodayAppointments()
  } catch (error) {
    console.error('Error confirming appointment:', error)
    toast.error('Error al confirmar la cita')
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script> 