<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mis Citas</h1>
            <p class="mt-2 text-gray-600">Gestiona tus citas veterinarias</p>
          </div>
          <button
            @click="$router.push('/client/appointments/new')"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Agendar Cita
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              v-model="selectedStatus"
              @change="loadAppointments"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
            >
              <option value="">Todos los estados</option>
              <option value="SCHEDULED">Programada</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Desde</label>
            <input
              v-model="dateFrom"
              @change="loadAppointments"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
            <input
              v-model="dateTo"
              @change="loadAppointments"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="appointments.length === 0" class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400">
          <CalendarIcon class="w-full h-full" />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No tienes citas</h3>
        <p class="mt-2 text-gray-500">
          {{ selectedStatus ? 'No hay citas con el estado seleccionado' : 'Agenda tu primera cita veterinaria' }}
        </p>
        <button
          @click="$router.push('/client/appointments/new')"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Agendar Primera Cita
        </button>
      </div>

      <!-- Appointments List -->
      <div v-else class="space-y-4">
        <div
          v-for="appointment in appointments"
          :key="appointment.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <!-- Appointment Info -->
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-vet-100 rounded-full flex items-center justify-center">
                      <CalendarIcon class="w-6 h-6 text-vet-600" />
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ appointment.reason || 'Consulta General' }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      {{ formatDate(appointment.appointment_date) }} a las {{ formatTime(appointment.appointment_date) }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <!-- Pet Info -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-700 mb-1">Mascota</h4>
                    <div class="flex items-center space-x-2">
                      <span class="text-2xl">🐾</span>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ appointment.pet?.name }}</p>
                        <p class="text-xs text-gray-500">{{ appointment.pet?.species }} • {{ appointment.pet?.breed }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Veterinarian Info -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-700 mb-1">Veterinario</h4>
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon class="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          Dr. {{ appointment.veterinarian?.user?.first_name }} {{ appointment.veterinarian?.user?.last_name }}
                        </p>
                        <p class="text-xs text-gray-500">{{ appointment.veterinarian?.specialty }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Info -->
                <div class="flex items-center space-x-6 text-sm text-gray-600">
                  <div class="flex items-center space-x-1">
                    <ClockIcon class="w-4 h-4" />
                    <span>{{ appointment.duration_minutes }} min</span>
                  </div>
                  <div v-if="appointment.notes" class="flex items-center space-x-1">
                    <DocumentTextIcon class="w-4 h-4" />
                    <span>Con notas</span>
                  </div>
                </div>

                <!-- Notes -->
                <div v-if="appointment.notes" class="mt-3 p-3 bg-gray-50 rounded-md">
                  <p class="text-sm text-gray-700">{{ appointment.notes }}</p>
                </div>
              </div>

              <!-- Status and Actions -->
              <div class="flex flex-col items-end space-y-3">
                <!-- Status Badge -->
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(appointment.status)
                  ]"
                >
                  {{ getStatusText(appointment.status) }}
                </span>

                <!-- Actions -->
                <div class="flex space-x-2">
                  <button
                    v-if="canReschedule(appointment)"
                    @click="rescheduleAppointment(appointment)"
                    class="text-vet-600 hover:text-vet-700 text-sm font-medium"
                  >
                    Reprogramar
                  </button>
                  <button
                    v-if="canCancel(appointment)"
                    @click="cancelAppointment(appointment)"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="viewDetails(appointment)"
                    class="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span class="px-3 py-2 text-sm text-gray-700">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </nav>
      </div>
    </div>

    <!-- Cancel Appointment Modal -->
    <Dialog v-model:visible="showCancelModal" modal header="Cancelar Cita" :style="{ width: '30rem' }">
      <div class="space-y-4">
        <p class="text-gray-700">¿Estás seguro de que deseas cancelar esta cita?</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Motivo de cancelación (opcional)
          </label>
          <textarea
            v-model="cancelReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
            placeholder="Explica brevemente el motivo..."
          ></textarea>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showCancelModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Mantener Cita
          </button>
          <button
            @click="confirmCancel"
            :disabled="cancelling"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            <span v-if="cancelling">Cancelando...</span>
            <span v-else>Cancelar Cita</span>
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// PrimeVue Components
import Dialog from 'primevue/dialog'

// Heroicons
import { 
  PlusIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  DocumentTextIcon 
} from '@heroicons/vue/24/outline'

// Services
import appointmentService from '@/services/appointmentService'

const router = useRouter()
const toast = useToast()

// Reactive data
const appointments = ref([])
const loading = ref(false)
const selectedStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const showCancelModal = ref(false)
const selectedAppointment = ref(null)
const cancelReason = ref('')
const cancelling = ref(false)

// Methods
const loadAppointments = async () => {
  try {
    loading.value = true
    const response = await appointmentService.getMyAppointments(selectedStatus.value)
    appointments.value = response.data || response
  } catch (error) {
    console.error('Error loading appointments:', error)
    toast.error('Error al cargar las citas')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return format(parseISO(dateString), 'EEEE, d MMMM yyyy', { locale: es })
}

const formatTime = (dateString) => {
  return format(parseISO(dateString), 'HH:mm', { locale: es })
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

const canReschedule = (appointment) => {
  return ['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && 
         new Date(appointment.appointment_date) > new Date()
}

const canCancel = (appointment) => {
  return ['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && 
         new Date(appointment.appointment_date) > new Date()
}

const rescheduleAppointment = (appointment) => {
  router.push(`/client/appointments/${appointment.id}/reschedule`)
}

const cancelAppointment = (appointment) => {
  selectedAppointment.value = appointment
  cancelReason.value = ''
  showCancelModal.value = true
}

const confirmCancel = async () => {
  try {
    cancelling.value = true
    await appointmentService.cancelAppointment(selectedAppointment.value.id, cancelReason.value)
    toast.success('Cita cancelada exitosamente')
    showCancelModal.value = false
    loadAppointments()
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    toast.error('Error al cancelar la cita')
  } finally {
    cancelling.value = false
  }
}

const viewDetails = (appointment) => {
  router.push(`/client/appointments/${appointment.id}`)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadAppointments()
  }
}

// Lifecycle
onMounted(() => {
  loadAppointments()
})
</script> 