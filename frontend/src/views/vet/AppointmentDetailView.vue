<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="loading-spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error al cargar cita</h3>
            <p class="mt-2 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="appointment" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                @click="$router.go(-1)"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowLeftIcon class="h-4 w-4 mr-2" />
                Volver
              </button>
              
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  Cita - {{ formatDate(appointment.scheduledAt || appointment.dateTime) }}
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                  {{ formatTime(appointment.scheduledAt || appointment.dateTime) }} | {{ getTypeLabel(appointment.appointmentType || appointment.type) }}
                </p>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center space-x-3">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusBadgeClass(appointment.status)"
              >
                {{ getStatusLabel(appointment.status) }}
              </span>

              <!-- Actions Dropdown -->
              <div class="relative" ref="actionsDropdown">
                <button
                  @click="showActionsMenu = !showActionsMenu"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Acciones
                  <ChevronDownIcon class="ml-2 h-4 w-4" />
                </button>

                <div
                  v-if="showActionsMenu"
                  class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                >
                  <div class="py-1">
                    <button
                      v-if="appointment.status === 'SCHEDULED'"
                      @click="updateStatus('CONFIRMED')"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <CheckIcon class="h-4 w-4 inline mr-2" />
                      Confirmar Cita
                    </button>

                    <button
                      v-if="['SCHEDULED', 'CONFIRMED'].includes(appointment.status)"
                      @click="updateStatus('IN_PROGRESS')"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <PlayIcon class="h-4 w-4 inline mr-2" />
                      Iniciar Consulta
                    </button>

                    <button
                      v-if="appointment.status === 'IN_PROGRESS'"
                      @click="updateStatus('COMPLETED')"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <CheckCircleIcon class="h-4 w-4 inline mr-2" />
                      Completar Consulta
                    </button>

                    <button
                      v-if="appointment.status === 'COMPLETED'"
                      @click="showNewRecordModal = true"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <DocumentPlusIcon class="h-4 w-4 inline mr-2" />
                      Crear Registro Médico
                    </button>

                    <hr class="my-1">

                    <button
                      @click="showRescheduleModal = true"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <CalendarIcon class="h-4 w-4 inline mr-2" />
                      Reprogramar
                    </button>

                    <button
                      v-if="appointment.status !== 'CANCELLED'"
                      @click="updateStatus('CANCELLED')"
                      class="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                    >
                      <XMarkIcon class="h-4 w-4 inline mr-2" />
                      Cancelar Cita
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Appointment Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Patient Information -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Información del Paciente
              </h3>
              
              <div v-if="appointment.pet" class="flex items-center space-x-4 mb-6">
                <img 
                  v-if="appointment.pet.photoUrl || appointment.pet.photo_url" 
                  :src="appointment.pet.photoUrl || appointment.pet.photo_url" 
                  :alt="appointment.pet.name"
                  class="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                >
                <div v-else class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                  <HeartIcon class="h-8 w-8 text-gray-400" />
                </div>
                
                <div class="flex-1">
                  <h4 class="text-xl font-semibold text-gray-900">{{ appointment.pet.name }}</h4>
                  <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center">
                      <TagIcon class="h-4 w-4 mr-1" />
                      {{ getSpeciesText(appointment.pet.species) }} - {{ appointment.pet.breed }}
                    </span>
                    <span class="flex items-center">
                      <CakeIcon class="h-4 w-4 mr-1" />
                      {{ calculateAge(appointment.pet.birthDate || appointment.pet.birth_date) }}
                    </span>
                    <span class="flex items-center">
                      <ScaleIcon class="h-4 w-4 mr-1" />
                      {{ appointment.pet.weight }}kg
                    </span>
                  </div>
                  <div class="mt-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                          :class="getGenderBadgeClass(appointment.pet.gender)">
                      {{ getGenderText(appointment.pet.gender) }}
                    </span>
                  </div>
                </div>

                <div class="text-right">
                  <router-link
                    :to="`/vet/patients/${appointment.pet.id}`"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Ver Perfil Completo
                    <ArrowTopRightOnSquareIcon class="ml-2 h-4 w-4" />
                  </router-link>
                </div>
              </div>

              <!-- Owner Information -->
              <div class="border-t pt-4">
                <h5 class="text-sm font-medium text-gray-900 mb-3">Propietario</h5>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Nombre</p>
                    <p class="mt-1 text-sm text-gray-900">{{ (appointment.pet.owner?.firstName || appointment.pet.owner?.first_name) + ' ' + (appointment.pet.owner?.lastName || appointment.pet.owner?.last_name) }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Teléfono</p>
                    <p class="mt-1 text-sm text-gray-900">{{ appointment.pet.owner?.phone || 'No disponible' }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Email</p>
                    <p class="mt-1 text-sm text-gray-900">{{ appointment.pet.owner?.email }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Appointment Details -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Detalles de la Cita
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-500">Motivo de la consulta</p>
                  <p class="mt-1 text-sm text-gray-900">{{ appointment.reason }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-500">Tipo de cita</p>
                  <p class="mt-1 text-sm text-gray-900">{{ getTypeLabel(appointment.appointmentType || appointment.type) }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-500">Prioridad</p>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getPriorityBadgeClass(appointment.priority)"
                  >
                    {{ getPriorityLabel(appointment.priority) }}
                  </span>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-500">Duración estimada</p>
                  <p class="mt-1 text-sm text-gray-900">{{ estimatedDuration }} minutos</p>
                </div>
              </div>

              <div v-if="appointment.notes" class="mt-6">
                <p class="text-sm font-medium text-gray-500">Notas adicionales</p>
                <div class="mt-1 p-3 bg-gray-50 rounded-md border">
                  <p class="text-sm text-gray-900">{{ appointment.notes }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pre-diagnosis Section -->
          <div v-if="preDiagnosis" class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  🤖 Prediagnóstico con IA
                  <span 
                    :class="[
                      'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getDiagnosisStatusColor(preDiagnosis.status)
                    ]"
                  >
                    {{ getDiagnosisStatusText(preDiagnosis.status) }}
                  </span>
                </h3>
                <div class="flex items-center space-x-2">
                  <button
                    v-if="preDiagnosis.status === 'PENDING' || preDiagnosis.status === 'PROCESSING'"
                    @click="refreshDiagnosis"
                    class="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Actualizar
                  </button>
                  <button
                    v-if="!preDiagnosis && appointment.status !== 'COMPLETED'"
                    @click="showPreDiagnosisModal = true"
                    class="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Solicitar Prediagnóstico
                  </button>
                </div>
              </div>

              <!-- Diagnosis Loading State -->
              <div v-if="preDiagnosis.status === 'PENDING' || preDiagnosis.status === 'PROCESSING'" 
                   class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
                  <div>
                    <h5 class="text-sm font-medium text-blue-800">
                      {{ preDiagnosis.status === 'PENDING' ? 'Preparando análisis...' : 'Analizando síntomas...' }}
                    </h5>
                    <p class="text-sm text-blue-600 mt-1">
                      El sistema de IA está procesando la información. Esto puede tomar unos minutos.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Diagnosis Results -->
              <div v-else-if="preDiagnosis.status === 'COMPLETED' && preDiagnosis.results" class="space-y-4">
                <!-- Professional Header for Veterinarians -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <h4 class="text-sm font-semibold text-blue-900 flex items-center">
                    🏥 Prediagnóstico de IA - Herramienta de Apoyo Clínico
                  </h4>
                  <p class="text-xs text-blue-700 mt-1">
                    Información preliminar basada en síntomas reportados. Use como orientación en su evaluación profesional.
                  </p>
                </div>

                <!-- Use DiagnosisResultCard component for consistent UI -->
                <DiagnosisResultCard :diagnosis="preDiagnosis" />

                <!-- Original symptoms reported -->
                <div class="bg-gray-50 rounded-lg p-4 border">
                  <h5 class="text-sm font-medium text-gray-900 mb-2">Síntomas reportados por el propietario:</h5>
                  <p class="text-sm text-gray-700">{{ preDiagnosis.description }}</p>
                  <p class="text-xs text-gray-500 mt-2">
                    Reportado el {{ formatDateTime(preDiagnosis.createdAt) }}
                  </p>
                </div>
              </div>

              <!-- Diagnosis Error State -->
              <div v-else-if="preDiagnosis.status === 'FAILED'" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex">
                  <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
                  <div class="ml-3">
                    <h5 class="text-sm font-medium text-red-800">Error en el análisis</h5>
                    <p class="text-sm text-red-700 mt-1">
                      No se pudo completar el análisis de los síntomas. 
                      Proceda con la evaluación clínica tradicional.
                    </p>
                    <p v-if="preDiagnosis.errorMessage" class="text-xs text-red-600 mt-2">
                      Detalle: {{ preDiagnosis.errorMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Professional Disclaimer -->
              <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-xs text-yellow-800">
                  <strong>🏥 Nota Profesional:</strong> Este prediagnóstico es una herramienta de apoyo basada en IA. 
                  Utilice esta información como orientación inicial, pero base su diagnóstico final en su evaluación clínica profesional.
                </p>
              </div>
            </div>
          </div>

          <!-- Recent Medical History -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Historial Médico Reciente
                </h3>
                <router-link
                  :to="`/vet/patients/${appointment.pet.id}`"
                  class="text-sm text-primary-600 hover:text-primary-500"
                >
                  Ver historial completo →
                </router-link>
              </div>
              
              <div v-if="recentRecords.length > 0" class="space-y-4">
                <div
                  v-for="record in recentRecords"
                  :key="record.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <ClipboardDocumentListIcon class="h-4 w-4 text-gray-400" />
                        <h4 class="text-sm font-medium text-gray-900">{{ record.title }}</h4>
                        <span class="text-xs text-gray-500">{{ formatDate(record.createdAt) }}</span>
                      </div>
                      <p class="text-sm text-gray-700 mb-1">{{ record.diagnosis }}</p>
                      <p class="text-xs text-gray-500">{{ record.treatment }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-6">
                <ClipboardDocumentListIcon class="mx-auto h-8 w-8 text-gray-400" />
                <p class="mt-2 text-sm text-gray-500">No hay registros médicos previos</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Actions & Info -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Acciones Rápidas
              </h3>
              
              <div class="space-y-3">
                <button
                  v-if="appointment.status === 'COMPLETED'"
                  @click="showNewRecordModal = true"
                  class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <DocumentPlusIcon class="h-4 w-4 mr-2" />
                  Crear Registro Médico
                </button>

                <button
                  @click="showRescheduleModal = true"
                  class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <CalendarIcon class="h-4 w-4 mr-2" />
                  Reprogramar
                </button>

                <button
                  @click="showNotesModal = true"
                  class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PencilIcon class="h-4 w-4 mr-2" />
                  Añadir Notas
                </button>
              </div>
            </div>
          </div>

          <!-- Reminders -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recordatorios
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="appointment.reminderSettings?.email"
                    disabled
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">
                    Recordatorio por email
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="appointment.reminderSettings?.sms"
                    disabled
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">
                    Recordatorio por SMS
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Cronología
              </h3>
              
              <div class="space-y-3">
                <div v-for="event in timeline" :key="event.id" class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <div class="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
                      <component :is="event.icon" class="h-3 w-3 text-primary-600" />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm text-gray-900">{{ event.description }}</p>
                    <p class="text-xs text-gray-500">{{ formatDateTime(event.timestamp) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <NewMedicalRecordModal
      v-if="showNewRecordModal"
      :pet-id="appointment.pet?.id"
      @close="showNewRecordModal = false"
      @created="handleRecordCreated"
    />

    <RescheduleModal
      v-if="showRescheduleModal"
      :appointment="appointment"
      @close="showRescheduleModal = false"
      @rescheduled="handleRescheduled"
    />

    <NotesModal
      v-if="showNotesModal"
      :appointment="appointment"
      @close="showNotesModal = false"
      @updated="handleNotesUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointmentsStore } from '../../stores/appointments'
import { useMedicalRecordsStore } from '../../stores/medicalRecords'
import { useToast } from 'vue-toastification'
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'

// Utils
import { translate } from '@/utils/translations'

// Icons
import {
  ArrowLeftIcon,
  HeartIcon,
  TagIcon,
  CakeIcon,
  ScaleIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  DocumentPlusIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  CheckIcon,
  PlayIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline'

// Components
import NewMedicalRecordModal from '../../components/modals/NewMedicalRecordModal.vue'
import RescheduleModal from '../../components/modals/RescheduleModal.vue'
import NotesModal from '../../components/modals/NotesModal.vue'
import DiagnosisResultCard from '../../components/diagnosis/DiagnosisResultCard.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const appointmentsStore = useAppointmentsStore()
const medicalRecordsStore = useMedicalRecordsStore()

// Props
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

// State
const appointmentId = computed(() => props.id || route.params.id)
const appointment = ref(null)
const preDiagnosis = ref(null)
const loading = ref(true)
const error = ref(null)
const recentRecords = ref([])
const showActionsMenu = ref(false)
const showNewRecordModal = ref(false)
const showRescheduleModal = ref(false)
const showNotesModal = ref(false)
const showPreDiagnosisModal = ref(false)
const actionsDropdown = ref(null)

// Computed properties
const estimatedDuration = computed(() => {
  const durations = {
    'CONSULTATION': 30,
    'VACCINATION': 15,
    'CHECKUP': 20,
    'SURGERY': 120,
    'EMERGENCY': 45,
    'FOLLOW_UP': 20
  }
  return durations[appointment.value?.type] || 30
})

const timeline = computed(() => {
  if (!appointment.value) return []
  
  const events = [
    {
      id: 1,
      description: 'Cita programada',
      timestamp: appointment.value.createdAt,
      icon: CalendarIcon
    }
  ]
  
  if (appointment.value.status === 'CONFIRMED') {
    events.push({
      id: 2,
      description: 'Cita confirmada',
      timestamp: appointment.value.updatedAt,
      icon: CheckIcon
    })
  }
  
  if (appointment.value.status === 'COMPLETED') {
    events.push({
      id: 3,
      description: 'Consulta completada',
      timestamp: appointment.value.updatedAt,
      icon: CheckCircleIcon
    })
  }
  
  return events.reverse()
})

// Methods
const loadAppointmentData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const appointmentData = await appointmentsStore.fetchAppointment(appointmentId.value)
    appointment.value = appointmentData
    
    // Manejo del prediagnóstico - misma lógica que la vista del cliente
    let diagnosis = null
    console.log('Raw appointment data:', appointmentData)
    
    // 1. Desde el campo transformado preDiagnosis (backend DTO)
    if (appointmentData.preDiagnosis) {
      diagnosis = appointmentData.preDiagnosis
      console.log('Pre-diagnosis from DTO:', diagnosis)
    }
    // 2. Desde el array aiDiagnoses (fallback si no está transformado)
    else if (appointmentData.aiDiagnoses && appointmentData.aiDiagnoses.length > 0) {
      diagnosis = appointmentData.aiDiagnoses[0] // Tomar el primero (más reciente)
      console.log('Pre-diagnosis from aiDiagnoses array:', diagnosis)
    }
    
    preDiagnosis.value = diagnosis
    
    if (preDiagnosis.value) {
      console.log('Pre-diagnosis found:', preDiagnosis.value)
    } else {
      console.log('No pre-diagnosis found for this appointment')
    }
    
    // Load recent medical records for the pet
    if (appointmentData.pet?.id) {
      const records = await medicalRecordsStore.fetchByPetId(appointmentData.pet.id)
      recentRecords.value = records.slice(0, 3) // Show only last 3 records
    }
    
  } catch (err) {
    console.error('Error loading appointment data:', err)
    error.value = err.message || 'Error al cargar la información de la cita'
  } finally {
    loading.value = false
  }
}

const calculateAge = (birthDate) => {
  const birth = parseISO(birthDate)
  const years = differenceInYears(new Date(), birth)
  const months = differenceInMonths(new Date(), birth) % 12
  
  if (years > 0) {
    return `${years} año${years !== 1 ? 's' : ''}`
  } else {
    return `${months} mes${months !== 1 ? 'es' : ''}`
  }
}

const formatDate = (date) => {
  return format(parseISO(date), 'dd/MM/yyyy', { locale: es })
}

const formatTime = (dateTime) => {
  return format(parseISO(dateTime), 'HH:mm', { locale: es })
}

const formatDateTime = (dateTime) => {
  return format(parseISO(dateTime), 'dd/MM/yyyy HH:mm', { locale: es })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'SCHEDULED': 'bg-blue-100 text-blue-800',
    'CONFIRMED': 'bg-green-100 text-green-800',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-gray-100 text-gray-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  return translate('appointmentStatus', status)
}

const getTypeLabel = (type) => {
  return translate('appointmentType', type)
}

const getPriorityLabel = (priority) => {
  return translate('appointmentPriority', priority)
}

const getPriorityBadgeClass = (priority) => {
  const classes = {
    'LOW': 'bg-gray-100 text-gray-800',
    'MEDIUM': 'bg-blue-100 text-blue-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'URGENT': 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getGenderBadgeClass = (gender) => {
  return gender === 'MALE' 
    ? 'bg-blue-100 text-blue-800'
    : 'bg-pink-100 text-pink-800'
}

const getGenderText = (gender) => {
  return translate('petGender', gender)
}

const getSpeciesText = (species) => {
  return translate('petSpecies', species)
}

const updateStatus = async (newStatus) => {
  try {
    if (newStatus === 'CONFIRMED') {
      await appointmentsStore.confirmAppointment(appointmentId.value)
    } else if (newStatus === 'COMPLETED') {
      await appointmentsStore.completeAppointment(appointmentId.value)
    } else if (newStatus === 'CANCELLED') {
      await appointmentsStore.cancelAppointment(appointmentId.value)
    } else {
      await appointmentsStore.updateAppointment(appointmentId.value, { status: newStatus })
    }
    
    appointment.value.status = newStatus
    showActionsMenu.value = false
    toast.success('Estado de la cita actualizado')
  } catch (error) {
    console.error('Error updating appointment status:', error)
    toast.error('Error al actualizar el estado de la cita')
  }
}

const handleRecordCreated = (newRecord) => {
  recentRecords.value.unshift(newRecord)
  showNewRecordModal.value = false
  toast.success('Registro médico creado exitosamente')
}

const handleRescheduled = (updatedAppointment) => {
  appointment.value = updatedAppointment
  showRescheduleModal.value = false
  toast.success('Cita reprogramada exitosamente')
}

const handleNotesUpdated = (updatedAppointment) => {
  appointment.value = updatedAppointment
  showNotesModal.value = false
  toast.success('Notas actualizadas correctamente')
}

// Pre-diagnosis functions
const getDiagnosisStatusColor = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PROCESSING': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'FAILED': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getDiagnosisStatusText = (status) => {
  return translate('preDiagnosisStatus', status)
}



const refreshDiagnosis = async () => {
  try {
    await loadAppointmentData()
    toast.success('Prediagnóstico actualizado exitosamente')
  } catch (error) {
    console.error('Error refreshing pre-diagnosis:', error)
    toast.error('Error al actualizar el prediagnóstico')
  }
}

const handleClickOutside = (event) => {
  if (actionsDropdown.value && !actionsDropdown.value.contains(event.target)) {
    showActionsMenu.value = false
  }
}

// Reactive state for polling
const pollingInterval = ref(null)

// Polling for pre-diagnosis updates
const startPollingPreDiagnosis = () => {
  if (pollingInterval.value) return // Ya está corriendo
  
  pollingInterval.value = setInterval(async () => {
    if (preDiagnosis.value && (preDiagnosis.value.status === 'PENDING' || preDiagnosis.value.status === 'PROCESSING')) {
      try {
        await loadAppointmentData() // Recargar toda la cita es más seguro que acceso directo al diagnóstico
      } catch (error) {
        console.error('Error polling pre-diagnosis:', error)
      }
    } else {
      stopPollingPreDiagnosis() // Detener polling si ya no es necesario
    }
  }, 10000) // Cada 10 segundos
}

const stopPollingPreDiagnosis = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadAppointmentData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  stopPollingPreDiagnosis() // Cleanup polling
})

// Start polling if there's a pending pre-diagnosis
watch(() => preDiagnosis.value, (newPreDiagnosis) => {
  if (newPreDiagnosis && (newPreDiagnosis.status === 'PENDING' || newPreDiagnosis.status === 'PROCESSING')) {
    startPollingPreDiagnosis()
  } else {
    stopPollingPreDiagnosis()
  }
}, { immediate: true })
</script> 