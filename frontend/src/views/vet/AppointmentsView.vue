<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
            <p class="mt-2 text-gray-600">Administra las citas de tus pacientes</p>
          </div>
          <router-link
            to="/vet/appointments/new"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Nueva Cita
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Date Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                v-model="filters.date"
                type="date"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              />
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                v-model="filters.status"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              >
                <option value="">Todos los estados</option>
                <option value="SCHEDULED">Programada</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <!-- Patient Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <input
                v-model="filters.patient"
                type="text"
                placeholder="Buscar por nombre de mascota o dueño"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              />
            </div>

            <!-- Actions -->
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Appointments Table -->
      <div v-else class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Citas ({{ filteredAppointments.length }})
          </h3>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAppointments.length === 0" class="text-center py-12">
          <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay citas</h3>
          <p class="mt-1 text-sm text-gray-500">
            No se encontraron citas con los filtros aplicados.
          </p>
        </div>

        <!-- Appointments List -->
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="appointment in paginatedAppointments"
            :key="appointment.id"
            class="p-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <!-- Pet Photo -->
                  <img
                    v-if="appointment.pet?.photoUrl || appointment.pet?.photo_url"
                    :src="appointment.pet?.photoUrl || appointment.pet?.photo_url"
                    :alt="appointment.pet.name"
                    class="h-12 w-12 rounded-full object-cover"
                  />
                  <div v-else class="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-500 text-lg">🐾</span>
                  </div>

                  <!-- Appointment Info -->
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <h4 class="text-lg font-medium text-gray-900">
                        {{ appointment.pet?.name }}
                      </h4>
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(appointment.status)
                        ]"
                      >
                        {{ getStatusText(appointment.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ appointment.pet?.client?.user?.firstName || appointment.pet?.client?.user?.first_name }} 
                      {{ appointment.pet?.client?.user?.lastName || appointment.pet?.client?.user?.last_name }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ getAppointmentTypeText(appointment.type) }}
                    </p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div class="flex items-center">
                        <CalendarIcon class="h-4 w-4 mr-1" />
                        {{ formatDateTime(appointment.scheduledAt || appointment.dateTime) }}
                      </div>
                      <div class="flex items-center">
                        <ClockIcon class="h-4 w-4 mr-1" />
                        {{ appointment.duration || appointment.durationMinutes }} min
                      </div>
                      <div v-if="appointment.preDiagnosis || (appointment.aiDiagnoses && appointment.aiDiagnoses.length > 0)" class="flex items-center text-blue-600">
                        <span class="text-lg mr-1">🤖</span>
                        <span class="font-medium">IA Análisis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button
                  v-if="appointment.status === 'SCHEDULED'"
                  @click="confirmAppointment(appointment)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckIcon class="h-3 w-3 mr-1" />
                  Confirmar
                </button>
                
                <button
                  v-if="appointment.status === 'CONFIRMED'"
                  @click="startAppointment(appointment)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlayIcon class="h-3 w-3 mr-1" />
                  Iniciar
                </button>

                <button
                  v-if="appointment.status === 'IN_PROGRESS'"
                  @click="completeAppointment(appointment)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-vet-600 hover:bg-vet-700"
                >
                  <CheckCircleIcon class="h-3 w-3 mr-1" />
                  Completar
                </button>

                <router-link
                  :to="`/vet/appointments/${appointment.id}`"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon class="h-3 w-3 mr-1" />
                  Ver
                </router-link>

                <button
                  v-if="['SCHEDULED', 'CONFIRMED'].includes(appointment.status)"
                  @click="cancelAppointment(appointment)"
                  class="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                >
                  <XMarkIcon class="h-3 w-3 mr-1" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a 
              {{ Math.min(currentPage * itemsPerPage, filteredAppointments.length) }} 
              de {{ filteredAppointments.length }} resultados
            </div>
            <div class="flex space-x-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onActivated } from 'vue'
import { useToast } from 'vue-toastification'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Heroicons
import { 
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  PlayIcon,
  CheckCircleIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Services
import veterinarianService from '@/services/veterinarianService'
import appointmentService from '@/services/appointmentService'

// Utils
import { translate } from '@/utils/translations'

const toast = useToast()

// Reactive data
const loading = ref(true)
const appointments = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

// Filters
const filters = ref({
  date: '',
  status: '',
  patient: ''
})

// Computed properties
const filteredAppointments = computed(() => {
  let filtered = appointments.value

  if (filters.value.date) {
    filtered = filtered.filter(appointment => 
      (appointment.scheduledAt || appointment.dateTime || '').startsWith(filters.value.date)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(appointment => 
      appointment.status === filters.value.status
    )
  }

  if (filters.value.patient) {
    const search = filters.value.patient.toLowerCase()
    filtered = filtered.filter(appointment => 
      appointment.pet?.name?.toLowerCase().includes(search) ||
      appointment.pet?.client?.user?.firstName?.toLowerCase().includes(search) ||
      appointment.pet?.client?.user?.lastName?.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => new Date(a.scheduledAt || a.dateTime) - new Date(b.scheduledAt || b.dateTime))
})

const totalPages = computed(() => 
  Math.ceil(filteredAppointments.value.length / itemsPerPage)
)

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAppointments.value.slice(start, end)
})

// Methods
const loadAppointments = async () => {
  try {
    loading.value = true
    
    // Usar el endpoint específico del veterinario
    const response = await veterinarianService.getVeterinarianAppointments(
      null, 
      filters.value.date || null, 
      filters.value.status || null
    )
    
    // Asegurar que siempre tengamos un array
    const data = response?.data || response || []
    appointments.value = Array.isArray(data) ? data : []
    
    console.log('Vet appointments loaded:', appointments.value.length)
  } catch (error) {
    console.error('Error loading appointments:', error)
    toast.error('Error al cargar las citas')
    appointments.value = []
  } finally {
    loading.value = false
  }
}

const confirmAppointment = async (appointment) => {
  try {
    await appointmentService.confirmAppointment(appointment.id)
    appointment.status = 'CONFIRMED'
    toast.success('Cita confirmada exitosamente')
    
    // Refrescar datos después de la actualización
    setTimeout(() => loadAppointments(), 500)
  } catch (error) {
    console.error('Error confirming appointment:', error)
    toast.error('Error al confirmar la cita')
  }
}

const startAppointment = async (appointment) => {
  try {
    await appointmentService.updateAppointment(appointment.id, { status: 'IN_PROGRESS' })
    appointment.status = 'IN_PROGRESS'
    toast.success('Cita iniciada')
    
    // Refrescar datos después de la actualización
    setTimeout(() => loadAppointments(), 500)
  } catch (error) {
    console.error('Error starting appointment:', error)
    toast.error('Error al iniciar la cita')
  }
}

const completeAppointment = async (appointment) => {
  try {
    await appointmentService.completeAppointment(appointment.id)
    appointment.status = 'COMPLETED'
    toast.success('Cita completada')
    
    // Refrescar datos después de la actualización
    setTimeout(() => loadAppointments(), 500)
  } catch (error) {
    console.error('Error completing appointment:', error)
    toast.error('Error al completar la cita')
  }
}

const cancelAppointment = async (appointment) => {
  if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
    try {
      await appointmentService.cancelAppointment(appointment.id)
      appointment.status = 'CANCELLED'
      toast.success('Cita cancelada')
      
      // Refrescar datos después de la actualización
      setTimeout(() => loadAppointments(), 500)
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Error al cancelar la cita')
    }
  }
}

const clearFilters = () => {
  filters.value = {
    date: '',
    status: '',
    patient: ''
  }
  currentPage.value = 1
}

const formatDateTime = (dateTime) => {
  return format(parseISO(dateTime), 'dd MMM yyyy HH:mm', { locale: es })
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
  return translate('appointmentStatus', status)
}

const getAppointmentTypeText = (type) => {
  return translate('appointmentType', type)
}

// Watchers
watch(filters, () => {
  currentPage.value = 1
  // Recargar appointments cuando cambien los filtros de backend
  if (filters.value.status || filters.value.date) {
    loadAppointments()
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadAppointments()
})

onActivated(() => {
  // Recargar citas cuando se regrese a esta vista
  loadAppointments()
})
</script>
