<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
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
          <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6" id="modal-title">
              Agendar Nueva Cita
            </h3>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Date Selection -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="date" class="block text-sm font-medium text-gray-700">
                    Fecha <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    v-model="form.date"
                    type="date"
                    required
                    :min="minDate"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    @change="loadAvailableSlots"
                  />
                </div>

                <div>
                  <label for="time" class="block text-sm font-medium text-gray-700">
                    Hora <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="time"
                    v-model="form.time"
                    required
                    :disabled="!form.date || loadingSlots"
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
              </div>

              <!-- Appointment Type -->
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700">
                  Tipo de cita <span class="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  v-model="form.type"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="CONSULTATION">Consulta General</option>
                  <option value="VACCINATION">Vacunación</option>
                  <option value="CHECKUP">Chequeo</option>
                  <option value="SURGERY">Cirugía</option>
                  <option value="EMERGENCY">Emergencia</option>
                  <option value="FOLLOW_UP">Seguimiento</option>
                </select>
              </div>

              <!-- Reason -->
              <div>
                <label for="reason" class="block text-sm font-medium text-gray-700">
                  Motivo de la consulta <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  v-model="form.reason"
                  rows="3"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe brevemente el motivo de la consulta..."
                ></textarea>
              </div>

              <!-- Priority -->
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700">
                  Prioridad
                </label>
                <select
                  id="priority"
                  v-model="form.priority"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM" selected>Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              <!-- Pet Selection (if multiple pets) -->
              <div v-if="!petId">
                <label for="petSelect" class="block text-sm font-medium text-gray-700">
                  Mascota <span class="text-red-500">*</span>
                </label>
                <select
                  id="petSelect"
                  v-model="form.petId"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Seleccionar mascota</option>
                  <option 
                    v-for="pet in availablePets" 
                    :key="pet.id" 
                    :value="pet.id"
                  >
                    {{ pet.name }} ({{ pet.species }})
                  </option>
                </select>
              </div>

              <!-- Notes -->
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700">
                  Notas adicionales
                </label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="3"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Información adicional que consideres importante..."
                ></textarea>
              </div>

              <!-- Reminder Options -->
              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    id="emailReminder"
                    v-model="form.emailReminder"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="emailReminder" class="ml-2 block text-sm text-gray-900">
                    Recibir recordatorio por email
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="smsReminder"
                    v-model="form.smsReminder"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="smsReminder" class="ml-2 block text-sm text-gray-900">
                    Recibir recordatorio por SMS
                  </label>
                </div>
              </div>

              <!-- Estimated Duration -->
              <div v-if="estimatedDuration" class="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div class="flex">
                  <ClockIcon class="h-5 w-5 text-blue-400" />
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800">
                      Duración estimada
                    </h3>
                    <p class="mt-2 text-sm text-blue-700">
                      {{ estimatedDuration }} minutos aproximadamente
                    </p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-6 border-t">
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
                  Agendar Cita
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAppointmentsStore } from '../../stores/appointments'
import { usePetsStore } from '../../stores/pets'
import { useVeterinariansStore } from '../../stores/veterinarians'
import { useToast } from 'vue-toastification'
import { format, addDays } from 'date-fns'
import { XMarkIcon, ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  petId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['close', 'created'])

const appointmentsStore = useAppointmentsStore()
const petsStore = usePetsStore()
const veterinariansStore = useVeterinariansStore()
const toast = useToast()

const loading = ref(false)
const loadingSlots = ref(false)
const availableSlots = ref([])
const availablePets = ref([])

const form = reactive({
  date: '',
  time: '',
  type: '',
  reason: '',
  priority: 'MEDIUM',
  petId: props.petId || '',
  notes: '',
  emailReminder: true,
  smsReminder: false
})

// Computed properties
const minDate = computed(() => {
  return format(new Date(), 'yyyy-MM-dd')
})

const isFormValid = computed(() => {
  return form.date && form.time && form.type && form.reason && (props.petId || form.petId)
})

const estimatedDuration = computed(() => {
  const durations = {
    'CONSULTATION': 30,
    'VACCINATION': 15,
    'CHECKUP': 20,
    'SURGERY': 120,
    'EMERGENCY': 45,
    'FOLLOW_UP': 20
  }
  return durations[form.type] || null
})

// Methods
const loadAvailableSlots = async () => {
  if (!form.date) return
  
  try {
    loadingSlots.value = true
    
    // Generate time slots from 9 AM to 6 PM
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time,
          available: true // This would check against existing appointments
        })
      }
    }
    
    // Check availability against existing appointments
    const existingAppointments = await appointmentsStore.fetchAppointmentsByDate(form.date)
    
    slots.forEach(slot => {
      const isBooked = existingAppointments.some(appointment => {
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

const loadAvailablePets = async () => {
  if (props.petId) return // If petId is provided, no need to load pets
  
  try {
    const pets = await petsStore.fetchUserPets()
    availablePets.value = pets
  } catch (error) {
    console.error('Error loading pets:', error)
    toast.error('Error al cargar mascotas')
  }
}

const submitForm = async () => {
  try {
    loading.value = true
    
    // Combine date and time
    const dateTime = new Date(`${form.date}T${form.time}:00`)
    
    const appointmentData = {
      petId: props.petId || form.petId,
      scheduledAt: dateTime.toISOString(),
      type: form.type,
      duration: estimatedDuration.value || 30,
      priority: form.priority,
      status: 'SCHEDULED',
      notes: form.notes || null
    }
    
    const newAppointment = await appointmentsStore.createAppointment(appointmentData)
    
    emit('created', newAppointment)
    toast.success('Cita agendada exitosamente')
    
  } catch (error) {
    console.error('Error creating appointment:', error)
    toast.error(error.response?.data?.message || error.message || 'Error al agendar la cita')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => form.date, (newDate) => {
  if (newDate) {
    form.time = '' // Reset time when date changes
    loadAvailableSlots()
  }
})

// Lifecycle
onMounted(() => {
  loadAvailablePets()
  
  // Set default date to tomorrow
  const tomorrow = addDays(new Date(), 1)
  form.date = format(tomorrow, 'yyyy-MM-dd')
})
</script> 