<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="mb-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div>
                <router-link to="/vet/appointments" class="text-gray-400 hover:text-gray-500">
                  <ChevronLeftIcon class="flex-shrink-0 h-5 w-5" />
                  Volver a Citas
                </router-link>
              </div>
            </li>
          </ol>
        </nav>
        <div class="mt-4">
          <h1 class="text-3xl font-bold text-gray-900">Agendar Nueva Cita</h1>
          <p class="mt-2 text-gray-600">Programa una nueva cita para un paciente</p>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-sm border">
        <form @submit.prevent="handleSubmit" class="divide-y divide-gray-200">
          
          <!-- Patient Selection -->
          <div class="px-6 py-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información del Paciente</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Patient Search -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Paciente
                </label>
                <div class="relative">
                  <input
                    v-model="patientSearch"
                    type="text"
                    placeholder="Buscar por nombre de mascota o propietario..."
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500 pr-10"
                    @input="searchPatients"
                  />
                  <MagnifyingGlassIcon class="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                
                <!-- Search Results -->
                <div v-if="searchResults.length > 0" class="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                  <ul class="divide-y divide-gray-200">
                    <li
                      v-for="pet in searchResults"
                      :key="pet.id"
                      @click="selectPatient(pet)"
                      class="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div class="flex justify-between items-center">
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ pet.name }}</p>
                          <p class="text-sm text-gray-500">{{ pet.species }} • {{ pet.owner?.name }}</p>
                        </div>
                        <ChevronRightIcon class="h-5 w-5 text-gray-400" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Selected Patient Info -->
              <div v-if="selectedPatient" class="md:col-span-2 bg-blue-50 rounded-lg p-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <HeartIcon class="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-medium text-gray-900">{{ selectedPatient.name }}</h4>
                    <p class="text-sm text-gray-600">
                      {{ selectedPatient.species }} • {{ selectedPatient.breed }} • {{ selectedPatient.owner?.name }}
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="clearPatientSelection"
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Appointment Details -->
          <div class="px-6 py-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Detalles de la Cita</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  v-model="appointmentForm.date"
                  type="date"
                  :min="minDate"
                  :max="maxDate"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                  @change="onDateChange"
                />
              </div>

              <!-- Time -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Hora *
                </label>
                <select
                  v-model="appointmentForm.time"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                  :disabled="!appointmentForm.date || loadingSlots"
                >
                  <option value="">Selecciona una hora</option>
                  <option
                    v-for="slot in availableSlots"
                    :key="slot.time"
                    :value="slot.time"
                    :disabled="!slot.available"
                  >
                    {{ slot.time }} {{ !slot.available ? '(Ocupado)' : '' }}
                  </option>
                </select>
                
                <div v-if="loadingSlots" class="mt-2 flex items-center text-sm text-gray-500">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-vet-600 mr-2"></div>
                  Cargando horarios...
                </div>
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cita *
                </label>
                <select
                  v-model="appointmentForm.type"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                  @change="updateDuration"
                >
                  <option value="">Selecciona el tipo</option>
                  <option value="CONSULTATION">Consulta General</option>
                  <option value="VACCINATION">Vacunación</option>
                  <option value="SURGERY">Cirugía</option>
                  <option value="EMERGENCY">Emergencia</option>
                  <option value="CHECKUP">Revisión</option>
                  <option value="GROOMING">Peluquería</option>
                </select>
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <input
                  v-model.number="appointmentForm.duration"
                  type="number"
                  min="15"
                  max="240"
                  step="15"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                />
              </div>

              <!-- Priority -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  v-model="appointmentForm.priority"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                >
                  <option value="LOW">Baja</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  v-model="appointmentForm.status"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                >
                  <option value="SCHEDULED">Programada</option>
                  <option value="CONFIRMED">Confirmada</option>
                </select>
              </div>

              <!-- Notes -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Notas/Observaciones
                </label>
                <textarea
                  v-model="appointmentForm.notes"
                  rows="3"
                  placeholder="Notas adicionales sobre la cita..."
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-vet-500 focus:ring-vet-500"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Pre-diagnosis Section (Professional) -->
          <div v-if="selectedPatient && (appointmentForm.type === 'CONSULTATION' || appointmentForm.type === 'EMERGENCY')" class="px-6 py-6 border-t">
            <h3 class="text-lg font-medium text-gray-900 mb-4">🤖 Análisis Previo con IA</h3>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="text-sm font-semibold text-blue-900">Solicitar Prediagnóstico Profesional</h4>
                  <p class="text-sm text-blue-700 mt-1">
                    Utilice la IA para obtener un análisis preliminar basado en síntomas reportados
                  </p>
                </div>
                <div class="flex items-center">
                  <input
                    id="enable-professional-prediagnosis"
                    v-model="enableProfessionalPreDiagnosis"
                    type="checkbox"
                    class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300 rounded"
                  />
                  <label for="enable-professional-prediagnosis" class="ml-2 text-sm text-gray-700">
                    Activar análisis IA
                  </label>
                </div>
              </div>

              <div v-if="enableProfessionalPreDiagnosis" class="space-y-4">
                <div class="bg-white rounded-lg p-4 border border-blue-200">
                  <div class="text-sm text-blue-800 mb-3">
                    💡 <strong>Casos recomendados:</strong> Síntomas complejos, casos de emergencia, consultas de segunda opinión
                  </div>

                  <!-- Clinical observations -->
                  <div class="mb-4">
                    <label for="professional-symptoms" class="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones Clínicas Reportadas <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      id="professional-symptoms"
                      v-model="professionalPreDiagnosisForm.clinicalObservations"
                      rows="4"
                      :class="[
                        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500',
                        professionalPreDiagnosisErrors.clinicalObservations ? 'border-red-500' : 'border-gray-300'
                      ]"
                      placeholder="Describa los síntomas reportados por el propietario o sus observaciones preliminares..."
                    ></textarea>
                    <p v-if="professionalPreDiagnosisErrors.clinicalObservations" class="text-red-500 text-sm mt-1">
                      {{ professionalPreDiagnosisErrors.clinicalObservations }}
                    </p>
                  </div>

                  <!-- Duration and urgency -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label for="professional-duration" class="block text-sm font-medium text-gray-700 mb-2">
                        Duración de Síntomas
                      </label>
                      <select
                        id="professional-duration"
                        v-model="professionalPreDiagnosisForm.duration"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                      >
                        <option value="">Seleccionar</option>
                        <option value="ACUTE">Agudo (menos de 24 horas)</option>
                        <option value="SUBACUTE">Subagudo (1-7 días)</option>
                        <option value="CHRONIC">Crónico (más de 1 semana)</option>
                        <option value="INTERMITTENT">Intermitente</option>
                        <option value="PROGRESSIVE">Progresivo</option>
                      </select>
                    </div>

                    <div>
                      <label for="professional-urgency" class="block text-sm font-medium text-gray-700 mb-2">
                        Nivel de Urgencia
                      </label>
                      <select
                        id="professional-urgency"
                        v-model="professionalPreDiagnosisForm.urgency"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                      >
                        <option value="">Evaluar con IA</option>
                        <option value="LOW">Baja - Rutina</option>
                        <option value="MODERATE">Moderada - Atención preferente</option>
                        <option value="HIGH">Alta - Atención urgente</option>
                        <option value="CRITICAL">Crítica - Emergencia</option>
                      </select>
                    </div>
                  </div>

                  <!-- Additional context -->
                  <div>
                    <label for="professional-context" class="block text-sm font-medium text-gray-700 mb-2">
                      Contexto Clínico Adicional
                    </label>
                    <textarea
                      id="professional-context"
                      v-model="professionalPreDiagnosisForm.additionalContext"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                      placeholder="Historial médico relevante, medicamentos actuales, factores de riesgo..."
                    ></textarea>
                  </div>

                  <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p class="text-xs text-blue-800">
                      <strong>Nota:</strong> El análisis de IA se procesará tras crear la cita y estará disponible en los detalles de la misma.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Options -->
          <div class="px-6 py-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Opciones Adicionales</h3>
            
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  id="send-confirmation"
                  v-model="appointmentForm.sendConfirmation"
                  type="checkbox"
                  class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300 rounded"
                />
                <label for="send-confirmation" class="ml-2 block text-sm text-gray-900">
                  Enviar confirmación por email al propietario
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="send-reminder"
                  v-model="appointmentForm.sendReminder"
                  type="checkbox"
                  class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300 rounded"
                />
                <label for="send-reminder" class="ml-2 block text-sm text-gray-900">
                  Enviar recordatorio 24 horas antes
                </label>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
            <router-link
              to="/vet/appointments"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500"
            >
              Cancelar
            </router-link>
            
            <button
              type="submit"
              :disabled="submitting || !selectedPatient || !appointmentForm.date || !appointmentForm.time || !appointmentForm.type || (enableProfessionalPreDiagnosis && !isProfessionalPreDiagnosisValid)"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ enableProfessionalPreDiagnosis ? 'Creando con IA...' : 'Creando...' }}
              </span>
              <span v-else>
                {{ enableProfessionalPreDiagnosis ? 'Crear con Prediagnóstico' : 'Crear Cita' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format, addDays } from 'date-fns'

// Store
import { useAuthStore } from '@/stores/auth'
import { useDiagnosisStore } from '@/stores/diagnosis'

// Heroicons
import { 
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Services
import appointmentService from '@/services/appointmentService'
import petService from '@/services/petService'
import veterinarianService from '@/services/veterinarianService'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const diagnosisStore = useDiagnosisStore()

// Reactive data
const patientSearch = ref('')
const searchResults = ref([])
const selectedPatient = ref(null)
const loadingSlots = ref(false)
const submitting = ref(false)
const availableSlots = ref([])
const currentVeterinarian = ref(null)

const appointmentForm = ref({
  date: '',
  time: '',
  type: '',
  duration: 30,
  priority: 'NORMAL',
  status: 'SCHEDULED',
  notes: '',
  sendConfirmation: true,
  sendReminder: true
})

// Professional Pre-diagnosis form
const enableProfessionalPreDiagnosis = ref(false)
const professionalPreDiagnosisForm = ref({
  clinicalObservations: '',
  duration: '',
  urgency: '',
  additionalContext: ''
})
const professionalPreDiagnosisErrors = ref({})

// Computed
const minDate = computed(() => {
  return format(new Date(), 'yyyy-MM-dd')
})

const maxDate = computed(() => {
  return format(addDays(new Date(), 90), 'yyyy-MM-dd')
})

// Professional Pre-diagnosis validation
const isProfessionalPreDiagnosisValid = computed(() => {
  if (!enableProfessionalPreDiagnosis.value) return true
  return professionalPreDiagnosisForm.value.clinicalObservations.trim().length >= 10
})

// Watch for date changes
watch(() => appointmentForm.value.date, (newDate) => {
  if (newDate) {
    appointmentForm.value.time = ''
    loadAvailableSlots()
  } else {
    availableSlots.value = []
  }
})

// Methods
const loadCurrentVeterinarian = async () => {
  try {
    if (authStore.isVet && authStore.user) {
      // Obtener el veterinario actual usando getProfile
      const response = await veterinarianService.getProfile()
      currentVeterinarian.value = response.data || response
      console.log('Current veterinarian loaded:', currentVeterinarian.value)
      
      if (!currentVeterinarian.value || !currentVeterinarian.value.id) {
        toast.error('No se pudo obtener la información del veterinario')
        return
      }
    } else {
      toast.error('Usuario no autenticado como veterinario')
      return
    }
  } catch (error) {
    console.error('Error loading current veterinarian:', error)
    toast.error('Error al cargar información del veterinario')
    // No usar fallback hardcodeado - dejar que el usuario maneje el error
    currentVeterinarian.value = null
  }
}

const searchPatients = async () => {
  if (patientSearch.value.length < 2) {
    searchResults.value = []
    return
  }
  
  try {
    const response = await petService.searchPets({
      query: patientSearch.value,
      includeOwner: true
    })
    searchResults.value = response.data || response
  } catch (error) {
    console.error('Error searching patients:', error)
    searchResults.value = []
  }
}

const selectPatient = (patient) => {
  selectedPatient.value = patient
  patientSearch.value = patient.name
  searchResults.value = []
}

const clearPatientSelection = () => {
  selectedPatient.value = null
  patientSearch.value = ''
  searchResults.value = []
}

const onDateChange = () => {
  appointmentForm.value.time = ''
  if (appointmentForm.value.date) {
    loadAvailableSlots()
  }
}

const loadAvailableSlots = async () => {
  if (!appointmentForm.value.date || !currentVeterinarian.value) return
  
  try {
    loadingSlots.value = true
    
    const dateString = format(new Date(appointmentForm.value.date), 'yyyy-MM-dd')
    
    console.log('Loading slots for vet ID:', currentVeterinarian.value.id, 'date:', dateString)
    
    const response = await appointmentService.getVeterinarianAvailability(
      currentVeterinarian.value.id, 
      dateString, 
      appointmentForm.value.duration || 30
    )
    
    const responseData = response.data || response
    console.log('Availability response:', responseData)
    
    if (responseData && responseData.slots) {
      availableSlots.value = responseData.slots.map(slot => ({
        time: slot.startTime,
        available: slot.available,
        dateTime: slot.dateTime,
        reason: slot.reason
      }))
    } else {
      availableSlots.value = []
    }
    
  } catch (error) {
    console.error('Error loading slots:', error)
    availableSlots.value = []
    toast.error('Error al cargar horarios disponibles')
  } finally {
    loadingSlots.value = false
  }
}

const updateDuration = () => {
  const durations = {
    'CONSULTATION': 30,
    'VACCINATION': 15,
    'SURGERY': 120,
    'EMERGENCY': 60,
    'CHECKUP': 20,
    'GROOMING': 45
  }
  appointmentForm.value.duration = durations[appointmentForm.value.type] || 30
  
  // Recargar slots si ya hay una fecha seleccionada
  if (appointmentForm.value.date) {
    loadAvailableSlots()
  }
}

// Professional Pre-diagnosis methods
const validateProfessionalPreDiagnosis = () => {
  professionalPreDiagnosisErrors.value = {}
  
  if (enableProfessionalPreDiagnosis.value) {
    if (!professionalPreDiagnosisForm.value.clinicalObservations.trim()) {
      professionalPreDiagnosisErrors.value.clinicalObservations = 'Las observaciones clínicas son obligatorias'
      return false
    }
    if (professionalPreDiagnosisForm.value.clinicalObservations.trim().length < 10) {
      professionalPreDiagnosisErrors.value.clinicalObservations = 'Por favor proporcione más detalles (mínimo 10 caracteres)'
      return false
    }
  }
  
  return true
}

const buildProfessionalDiagnosisDescription = () => {
  const parts = []
  
  if (professionalPreDiagnosisForm.value.clinicalObservations.trim()) {
    parts.push(`Observaciones clínicas: ${professionalPreDiagnosisForm.value.clinicalObservations.trim()}`)
  }
  
  if (professionalPreDiagnosisForm.value.duration) {
    const durationLabels = {
      'ACUTE': 'agudo (menos de 24 horas)',
      'SUBACUTE': 'subagudo (1-7 días)',
      'CHRONIC': 'crónico (más de 1 semana)',
      'INTERMITTENT': 'intermitente',
      'PROGRESSIVE': 'progresivo'
    }
    parts.push(`Duración: ${durationLabels[professionalPreDiagnosisForm.value.duration]}`)
  }
  
  if (professionalPreDiagnosisForm.value.urgency) {
    const urgencyLabels = {
      'LOW': 'baja - rutina',
      'MODERATE': 'moderada - atención preferente',
      'HIGH': 'alta - atención urgente',
      'CRITICAL': 'crítica - emergencia'
    }
    parts.push(`Urgencia: ${urgencyLabels[professionalPreDiagnosisForm.value.urgency]}`)
  }
  
  if (professionalPreDiagnosisForm.value.additionalContext?.trim()) {
    parts.push(`Contexto adicional: ${professionalPreDiagnosisForm.value.additionalContext.trim()}`)
  }
  
  return parts.join('. ')
}

const createProfessionalPreDiagnosis = async (appointmentId) => {
  if (!enableProfessionalPreDiagnosis.value || !professionalPreDiagnosisForm.value.clinicalObservations.trim()) {
    return null
  }

  try {
    // Mapear urgencia profesional a severity del backend
    const mapUrgencyToSeverity = (urgency) => {
      const mapping = {
        'LOW': 'mild',
        'MODERATE': 'moderate',
        'HIGH': 'severe',
        'CRITICAL': 'severe'
      }
      return mapping[urgency] || null
    }

    // Mapear duration profesional a texto
    const mapProfessionalDuration = (duration) => {
      const mapping = {
        'ACUTE': 'agudo (menos de 24 horas)',
        'SUBACUTE': 'subagudo (1-7 días)',
        'CHRONIC': 'crónico (más de 1 semana)',
        'INTERMITTENT': 'intermitente',
        'PROGRESSIVE': 'progresivo'
      }
      return mapping[duration] || null
    }

    const diagnosisData = {
      petId: selectedPatient.value.id,
      appointmentId,
      symptoms: professionalPreDiagnosisForm.value.clinicalObservations.trim(),
      duration: mapProfessionalDuration(professionalPreDiagnosisForm.value.duration),
      severity: mapUrgencyToSeverity(professionalPreDiagnosisForm.value.urgency),
      additionalInfo: professionalPreDiagnosisForm.value.additionalContext?.trim() || null
    }

    return await diagnosisStore.createPreDiagnosis(diagnosisData)
  } catch (error) {
    console.error('Error creating professional pre-diagnosis:', error)
    toast.warning('La cita se creó correctamente, pero hubo un problema con el prediagnóstico')
    return null
  }
}

const calculatePetAge = (birthDate) => {
  if (!birthDate) return 'Edad no especificada'
  
  const birth = new Date(birthDate)
  const now = new Date()
  const years = Math.floor((now - birth) / (365.25 * 24 * 60 * 60 * 1000))
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}`
  } else {
    const months = Math.floor((now - birth) / (30.44 * 24 * 60 * 60 * 1000))
    return `${months} mes${months > 1 ? 'es' : ''}`
  }
}

const handleSubmit = async () => {
  if (!selectedPatient.value) {
    toast.error('Selecciona un paciente')
    return
  }
  
  if (!currentVeterinarian.value) {
    toast.error('Error: No se pudo identificar el veterinario')
    return
  }
  
  // Validar prediagnóstico profesional si está habilitado
  if (enableProfessionalPreDiagnosis.value && !validateProfessionalPreDiagnosis()) {
    return
  }
  
  try {
    submitting.value = true
    
    const appointmentData = {
      petId: selectedPatient.value.id,
      veterinarianId: currentVeterinarian.value.id,
      scheduledAt: `${appointmentForm.value.date}T${appointmentForm.value.time}`,
      type: appointmentForm.value.type,
      duration: appointmentForm.value.duration,
      priority: appointmentForm.value.priority,
      status: appointmentForm.value.status,
      notes: appointmentForm.value.notes,
      sendConfirmation: appointmentForm.value.sendConfirmation,
      sendReminder: appointmentForm.value.sendReminder
    }
    
    console.log('Creating appointment with data:', appointmentData)
    
    // Crear la cita primero
    const newAppointment = await appointmentService.createAppointment(appointmentData)
    
    // Crear prediagnóstico profesional si está habilitado
    let diagnosis = null
    if (enableProfessionalPreDiagnosis.value) {
      diagnosis = await createProfessionalPreDiagnosis(newAppointment.id)
    }
    
    const successMessage = enableProfessionalPreDiagnosis.value 
      ? 'Cita creada exitosamente con prediagnóstico solicitado'
      : 'Cita creada exitosamente'
    
    toast.success(successMessage)
    router.push('/vet/appointments')
    
  } catch (error) {
    console.error('Error creating appointment:', error)
    toast.error('Error al crear la cita')
  } finally {
    submitting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadCurrentVeterinarian()
})
</script> 