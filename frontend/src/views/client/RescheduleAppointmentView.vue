<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="mb-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div>
                <router-link to="/client/appointments" class="text-gray-400 hover:text-gray-500">
                  <ChevronLeftIcon class="flex-shrink-0 h-5 w-5" />
                  Volver a Mis Citas
                </router-link>
              </div>
            </li>
          </ol>
        </nav>
        <div class="mt-4">
          <h1 class="text-3xl font-bold text-gray-900">Reprogramar Cita</h1>
          <p class="mt-2 text-gray-600">Selecciona una nueva fecha y hora para tu cita</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="rounded-md bg-red-50 p-4 mb-6">
        <div class="flex">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <p class="mt-2 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="appointment" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Current Appointment Info -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Cita Actual</h2>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-900">Fecha y Hora</p>
                <p class="text-sm text-gray-600">
                  {{ formatDateTime(appointment.scheduled_at || appointment.scheduledAt) }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <HeartIcon class="h-5 w-5 text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-900">Mascota</p>
                <p class="text-sm text-gray-600">{{ appointment.pet?.name }}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <ClipboardDocumentListIcon class="h-5 w-5 text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-900">Tipo de Cita</p>
                <p class="text-sm text-gray-600">{{ getAppointmentTypeLabel(appointment.type) }}</p>
              </div>
            </div>
            
            <div v-if="appointment.notes" class="flex items-start space-x-3">
              <DocumentTextIcon class="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-gray-900">Notas</p>
                <p class="text-sm text-gray-600">{{ appointment.notes }}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(appointment.status)
              ]">
                {{ getStatusLabel(appointment.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Reschedule Form -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Nueva Fecha y Hora</h2>
          
          <form @submit.prevent="handleReschedule" class="space-y-6">
            
            <!-- Date Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                v-model="rescheduleForm.date"
                type="date"
                :min="minDate"
                :max="maxDate"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                @change="onDateChange"
              />
            </div>

            <!-- Time Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hora
              </label>
              <select
                v-model="rescheduleForm.time"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                :disabled="!rescheduleForm.date || loadingSlots"
              >
                <option value="">Selecciona una hora</option>
                <option
                  v-for="slot in availableSlots"
                  :key="slot.time"
                  :value="slot.time"
                  :disabled="!slot.available"
                >
                  {{ slot.time }} {{ !slot.available ? '(No disponible)' : '' }}
                </option>
              </select>
              
              <div v-if="loadingSlots" class="mt-2 flex items-center text-sm text-gray-500">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-vet-600 mr-2"></div>
                Cargando horarios disponibles...
              </div>
            </div>

            <!-- Reason -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Motivo del cambio
              </label>
              <textarea
                v-model="rescheduleForm.reason"
                rows="3"
                placeholder="Opcional: explica el motivo del cambio"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
              ></textarea>
            </div>

            <!-- Notification Options -->
            <div>
              <div class="flex items-center">
                <input
                  id="notify-change"
                  v-model="rescheduleForm.notifyChange"
                  type="checkbox"
                  class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300 rounded"
                />
                <label for="notify-change" class="ml-2 block text-sm text-gray-900">
                  Notificar el cambio por email
                </label>
              </div>
            </div>

            <!-- Warning for near appointments -->
            <div v-if="isNearAppointment" class="rounded-md bg-yellow-50 p-4">
              <div class="flex">
                <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">
                    Cita próxima
                  </h3>
                  <p class="mt-2 text-sm text-yellow-700">
                    Tu cita es en menos de 24 horas. Los cambios pueden estar sujetos a políticas especiales.
                  </p>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex space-x-4">
              <button
                type="submit"
                :disabled="submitting || !rescheduleForm.date || !rescheduleForm.time"
                class="flex-1 bg-vet-600 text-white px-4 py-2 rounded-md font-medium hover:bg-vet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="submitting" class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Reprogramando...
                </span>
                <span v-else>Confirmar Cambio</span>
              </button>
              
              <router-link
                to="/client/appointments"
                class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center"
              >
                Cancelar
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format, parseISO, addDays, isBefore, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'

// Heroicons
import { 
  CalendarIcon,
  ChevronLeftIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Services
import appointmentService from '@/services/appointmentService'

// Utils
import { translate, getBadgeClass } from '@/utils/translations'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Reactive data
const appointment = ref(null)
const loading = ref(true)
const loadingSlots = ref(false)
const submitting = ref(false)
const error = ref('')
const availableSlots = ref([])

const rescheduleForm = ref({
  date: '',
  time: '',
  reason: '',
  notifyChange: true
})

// Computed
const minDate = computed(() => {
  return format(new Date(), 'yyyy-MM-dd')
})

const maxDate = computed(() => {
  return format(addDays(new Date(), 60), 'yyyy-MM-dd')
})

const isNearAppointment = computed(() => {
  if (!appointment.value?.scheduled_at && !appointment.value?.scheduledAt) return false
  const appointmentDate = parseISO(appointment.value.scheduled_at || appointment.value.scheduledAt)
  const hoursUntil = differenceInHours(appointmentDate, new Date())
  return hoursUntil < 24 && hoursUntil > 0
})

// Methods
const loadAppointment = async () => {
  try {
    loading.value = true
    const appointmentId = route.params.id
    const response = await appointmentService.getAppointment(appointmentId)
    appointment.value = response.data || response
  } catch (err) {
    console.error('Error loading appointment:', err)
    error.value = 'No se pudo cargar la información de la cita'
  } finally {
    loading.value = false
  }
}

const loadAvailableSlots = async (date) => {
  try {
    loadingSlots.value = true
    
    const veterinarianId = appointment.value?.veterinarianId || appointment.value?.veterinarian_id
    
    if (!veterinarianId) {
      console.error('No veterinarianId found in appointment:', appointment.value)
      availableSlots.value = []
      return
    }

    console.log('Loading slots for vet:', veterinarianId, 'date:', date)
    
    const response = await appointmentService.getVeterinarianAvailability(
      veterinarianId, 
      date, 
      appointment.value.duration || 30
    )
    
    const responseData = response.data || response
    console.log('Availability response:', responseData)
    
    if (responseData && responseData.slots) {
      availableSlots.value = responseData.slots.map(slot => ({
        time: slot.startTime,
        available: slot.available
      }))
    } else {
      availableSlots.value = []
    }
    
  } catch (err) {
    console.error('Error loading slots:', err)
    availableSlots.value = []
  } finally {
    loadingSlots.value = false
  }
}

const onDateChange = () => {
  rescheduleForm.value.time = ''
  if (rescheduleForm.value.date) {
    loadAvailableSlots(rescheduleForm.value.date)
  }
}

const handleReschedule = async () => {
  try {
    submitting.value = true
    
    const newDateTime = `${rescheduleForm.value.date}T${rescheduleForm.value.time}`
    
    await appointmentService.rescheduleAppointment(appointment.value.id, {
      scheduled_at: newDateTime,
      reason: rescheduleForm.value.reason,
      notify_change: rescheduleForm.value.notifyChange
    })
    
    toast.success('Cita reprogramada exitosamente')
    router.push('/client/appointments')
    
  } catch (err) {
    console.error('Error rescheduling appointment:', err)
    toast.error('Error al reprogramar la cita')
  } finally {
    submitting.value = false
  }
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return 'N/A'
  return format(parseISO(dateTime), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
}

const getAppointmentTypeLabel = (type) => {
  return translate('appointmentType', type)
}

const getStatusLabel = (status) => {
  return translate('appointmentStatus', status)
}

const getStatusClass = (status) => {
  return getBadgeClass('appointmentStatus', status)
}

// Lifecycle
onMounted(() => {
  loadAppointment()
})
</script> 