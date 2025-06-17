<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="$emit('close')"
          >
            <span class="sr-only">Cerrar</span>
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <CalendarIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
              Reprogramar Cita
            </h3>
            
            <!-- Current Appointment Info -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Cita actual</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p><strong>Fecha:</strong> {{ formatDate(appointment.dateTime) }}</p>
                <p><strong>Hora:</strong> {{ formatTime(appointment.dateTime) }}</p>
                <p><strong>Paciente:</strong> {{ appointment.pet?.name }}</p>
                <p><strong>Motivo:</strong> {{ appointment.reason }}</p>
              </div>
            </div>
            
            <form @submit.prevent="submitForm" class="space-y-4">
              <!-- New Date -->
              <div>
                <label for="newDate" class="block text-sm font-medium text-gray-700">
                  Nueva fecha <span class="text-red-500">*</span>
                </label>
                <input
                  id="newDate"
                  v-model="form.newDate"
                  type="date"
                  required
                  :min="minDate"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  @change="loadAvailableSlots"
                />
              </div>

              <!-- New Time -->
              <div>
                <label for="newTime" class="block text-sm font-medium text-gray-700">
                  Nueva hora <span class="text-red-500">*</span>
                </label>
                <select
                  id="newTime"
                  v-model="form.newTime"
                  required
                  :disabled="!form.newDate || loadingSlots"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                >
                  <option value="">Seleccionar hora</option>
                  <option 
                    v-for="slot in availableSlots" 
                    :key="slot.time" 
                    :value="slot.time"
                    :disabled="!slot.available"
                  >
                    {{ slot.time }} {{ slot.available ? '' : '(No disponible)' }}
                  </option>
                </select>
                <p v-if="loadingSlots" class="mt-1 text-sm text-gray-500">
                  Cargando horarios disponibles...
                </p>
              </div>

              <!-- Reason for Rescheduling -->
              <div>
                <label for="reason" class="block text-sm font-medium text-gray-700">
                  Motivo de la reprogramación
                </label>
                <textarea
                  id="reason"
                  v-model="form.reason"
                  rows="3"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Opcional: Explica por qué se reprograma la cita..."
                ></textarea>
              </div>

              <!-- Notification Options -->
              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    id="notifyClient"
                    v-model="form.notifyClient"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="notifyClient" class="ml-2 block text-sm text-gray-900">
                    Notificar al cliente sobre el cambio
                  </label>
                </div>
              </div>

              <!-- Warning if rescheduling to soon -->
              <div v-if="isReschedulingSoon" class="rounded-md bg-yellow-50 p-4">
                <div class="flex">
                  <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                      Reprogramación próxima
                    </h3>
                    <p class="mt-2 text-sm text-yellow-700">
                      La nueva fecha está dentro de las próximas 24 horas. Asegúrate de que el cliente pueda asistir con tan poco tiempo de anticipación.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="loading || !isFormValid"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <span v-if="loading" class="mr-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Reprogramar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAppointmentsStore } from '../../stores/appointments'
import { useToast } from 'vue-toastification'
import { format, addDays, differenceInHours, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { XMarkIcon, CalendarIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'rescheduled'])

const appointmentsStore = useAppointmentsStore()
const toast = useToast()

const loading = ref(false)
const loadingSlots = ref(false)
const availableSlots = ref([])

const form = reactive({
  newDate: '',
  newTime: '',
  reason: '',
  notifyClient: true
})

// Computed properties
const minDate = computed(() => {
  return format(new Date(), 'yyyy-MM-dd')
})

const isFormValid = computed(() => {
  return form.newDate && form.newTime
})

const isReschedulingSoon = computed(() => {
  if (!form.newDate || !form.newTime) return false
  
  const newDateTime = new Date(`${form.newDate}T${form.newTime}:00`)
  const now = new Date()
  const hoursUntilAppointment = differenceInHours(newDateTime, now)
  
  return hoursUntilAppointment < 24 && hoursUntilAppointment > 0
})

// Methods
const formatDate = (dateTime) => {
  return format(parseISO(dateTime), 'dd/MM/yyyy', { locale: es })
}

const formatTime = (dateTime) => {
  return format(parseISO(dateTime), 'HH:mm', { locale: es })
}

const loadAvailableSlots = async () => {
  if (!form.newDate) return
  
  try {
    loadingSlots.value = true
    
    // Generate time slots from 9 AM to 6 PM
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time,
          available: true
        })
      }
    }
    
    // Check availability against existing appointments (excluding current appointment)
    let existingAppointments = []
    try {
      existingAppointments = await appointmentsStore.fetchAppointmentsByDate(form.newDate)
    } catch (appointmentError) {
      console.warn('Could not load existing appointments for availability check:', appointmentError)
      existingAppointments = []
    }
    const otherAppointments = existingAppointments.filter(apt => apt.id !== props.appointment.id)
    
    slots.forEach(slot => {
      const isBooked = otherAppointments.some(appointment => {
        const appointmentTime = format(new Date(appointment.dateTime), 'HH:mm')
        return appointmentTime === slot.time
      })
      slot.available = !isBooked
    })
    
    availableSlots.value = slots
    
  } catch (error) {
    console.error('Error loading available slots:', error)
    toast.error('Error al cargar horarios disponibles')
  } finally {
    loadingSlots.value = false
  }
}

const submitForm = async () => {
  try {
    loading.value = true
    
    // Combine new date and time
    const newDateTime = new Date(`${form.newDate}T${form.newTime}:00`)
    
    const updateData = {
      dateTime: newDateTime.toISOString(),
      rescheduleReason: form.reason || null
    }
    
    const updatedAppointment = await appointmentsStore.updateAppointment(props.appointment.id, updateData)
    
    // If notification is requested, this would trigger notification service
    if (form.notifyClient) {
      // TODO: Implement notification service
      console.log('Notifying client about rescheduled appointment')
    }
    
    emit('rescheduled', updatedAppointment)
    toast.success('Cita reprogramada exitosamente')
    
  } catch (error) {
    console.error('Error rescheduling appointment:', error)
    toast.error(error.message || 'Error al reprogramar la cita')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => form.newDate, (newDate) => {
  if (newDate) {
    form.newTime = '' // Reset time when date changes
    loadAvailableSlots()
  }
})
</script> 