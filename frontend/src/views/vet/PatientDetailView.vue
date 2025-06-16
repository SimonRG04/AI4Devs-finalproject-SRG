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
            <h3 class="text-sm font-medium text-red-800">Error al cargar paciente</h3>
            <p class="mt-2 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="pet" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header with Pet Info -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Pet Avatar -->
              <div class="flex-shrink-0">
                <img 
                  v-if="pet.photoUrl" 
                  :src="pet.photoUrl" 
                  :alt="pet.name"
                  class="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                >
                <div v-else class="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                  <HeartIcon class="h-8 w-8 text-gray-400" />
                </div>
              </div>

              <!-- Pet Basic Info -->
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ pet.name }}</h1>
                <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <TagIcon class="h-4 w-4 mr-1" />
                    {{ pet.species }} - {{ pet.breed }}
                  </span>
                  <span class="flex items-center">
                    <CakeIcon class="h-4 w-4 mr-1" />
                    {{ calculateAge(pet.birthDate) }}
                  </span>
                  <span class="flex items-center">
                    <ScaleIcon class="h-4 w-4 mr-1" />
                    {{ pet.weight }}kg
                  </span>
                </div>
                <div class="mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        :class="getGenderBadgeClass(pet.gender)">
                    {{ pet.gender === 'MALE' ? 'Macho' : 'Hembra' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3">
              <button @click="showNewRecordModal = true" class="btn-primary">
                <PlusIcon class="h-4 w-4 mr-2" />
                Nuevo Registro
              </button>
              <button @click="showAppointmentModal = true" class="btn-secondary">
                <CalendarIcon class="h-4 w-4 mr-2" />
                Agendar Cita
              </button>
            </div>
          </div>

          <!-- Owner Info -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Propietario</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Nombre</p>
                <p class="mt-1 text-sm text-gray-900">{{ pet.owner?.fullName }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Teléfono</p>
                <p class="mt-1 text-sm text-gray-900">{{ pet.owner?.phone || 'No disponible' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Email</p>
                <p class="mt-1 text-sm text-gray-900">{{ pet.owner?.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 mr-2 inline" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Medical History Tab -->
          <div v-if="activeTab === 'history'" class="space-y-6">
            <!-- Medical Records -->
            <div v-if="medicalRecords.length > 0">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Historial Médico</h3>
              <div class="space-y-4">
                <div
                  v-for="record in medicalRecords"
                  :key="record.id"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <ClipboardDocumentListIcon class="h-5 w-5 text-gray-400" />
                        <h4 class="text-sm font-medium text-gray-900">{{ record.title }}</h4>
                        <span class="text-xs text-gray-500">{{ formatDate(record.createdAt) }}</span>
                      </div>
                      <p class="text-sm text-gray-700 mb-2">{{ record.symptoms }}</p>
                      <p class="text-sm text-gray-900"><strong>Diagnóstico:</strong> {{ record.diagnosis }}</p>
                      <p class="text-sm text-gray-900"><strong>Tratamiento:</strong> {{ record.treatment }}</p>
                      <div v-if="record.prescriptions?.length" class="mt-3">
                        <h5 class="text-sm font-medium text-gray-900 mb-1">Prescripciones:</h5>
                        <ul class="text-sm text-gray-700 space-y-1">
                          <li v-for="prescription in record.prescriptions" :key="prescription.id">
                            • {{ prescription.medicationName }} - {{ prescription.dosage }} ({{ prescription.frequency }})
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <button @click="editRecord(record)" class="text-primary-600 hover:text-primary-900 text-sm">
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No hay registros médicos</h3>
              <p class="mt-1 text-sm text-gray-500">Comenzar creando el primer registro médico para este paciente.</p>
              <div class="mt-6">
                <button @click="showNewRecordModal = true" class="btn-primary">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Crear Registro
                </button>
              </div>
            </div>
          </div>

          <!-- Appointments Tab -->
          <div v-if="activeTab === 'appointments'" class="space-y-6">
            <div v-if="appointments.length > 0">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Citas</h3>
              <div class="space-y-4">
                <div
                  v-for="appointment in appointments"
                  :key="appointment.id"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <CalendarIcon class="h-5 w-5 text-gray-400" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          {{ formatDate(appointment.dateTime) }} - {{ formatTime(appointment.dateTime) }}
                        </p>
                        <p class="text-sm text-gray-500">{{ appointment.reason }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusBadgeClass(appointment.status)"
                      >
                        {{ getStatusLabel(appointment.status) }}
                      </span>
                      <button 
                        @click="viewAppointment(appointment)" 
                        class="text-primary-600 hover:text-primary-900 text-sm"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No hay citas programadas</h3>
              <p class="mt-1 text-sm text-gray-500">Programa la primera cita para este paciente.</p>
              <div class="mt-6">
                <button @click="showAppointmentModal = true" class="btn-primary">
                  <CalendarIcon class="h-4 w-4 mr-2" />
                  Agendar Cita
                </button>
              </div>
            </div>
          </div>

          <!-- Vaccinations Tab -->
          <div v-if="activeTab === 'vaccinations'" class="space-y-6">
            <div v-if="vaccinations.length > 0">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Vacunas</h3>
              <div class="space-y-4">
                <div
                  v-for="vaccination in vaccinations"
                  :key="vaccination.id"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <ShieldCheckIcon class="h-5 w-5 text-green-500" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ vaccination.vaccineName }}</p>
                        <p class="text-sm text-gray-500">
                          Aplicada el {{ formatDate(vaccination.administeredAt) }}
                        </p>
                        <p v-if="vaccination.nextDueDate" class="text-sm text-orange-600">
                          Próxima dosis: {{ formatDate(vaccination.nextDueDate) }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right text-sm text-gray-500">
                      <p>Lote: {{ vaccination.batchNumber }}</p>
                      <p>{{ vaccination.veterinarianName }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <ShieldCheckIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No hay vacunas registradas</h3>
              <p class="mt-1 text-sm text-gray-500">Añade las vacunas aplicadas a este paciente.</p>
            </div>
          </div>

          <!-- Notes Tab -->
          <div v-if="activeTab === 'notes'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Notas del paciente
                </label>
                <textarea
                  v-model="petNotes"
                  rows="6"
                  class="input-field"
                  placeholder="Añadir notas sobre el comportamiento, alergias, observaciones especiales..."
                ></textarea>
              </div>
              <div class="flex justify-end">
                <button @click="saveNotes" class="btn-primary" :disabled="notesLoading">
                  <span v-if="notesLoading" class="loading-spinner mr-2"></span>
                  Guardar Notas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Medical Record Modal -->
    <NewMedicalRecordModal
      v-if="showNewRecordModal"
      :pet-id="petId"
      @close="showNewRecordModal = false"
      @created="handleRecordCreated"
    />

    <!-- New Appointment Modal -->
    <NewAppointmentModal
      v-if="showAppointmentModal"
      :pet-id="petId"
      @close="showAppointmentModal = false"
      @created="handleAppointmentCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePetsStore } from '../../stores/pets'
import { useAppointmentsStore } from '../../stores/appointments'
import { useMedicalRecordsStore } from '../../stores/medicalRecords'
import { useToast } from 'vue-toastification'
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'

// Icons
import {
  HeartIcon,
  TagIcon,
  CakeIcon,
  ScaleIcon,
  PlusIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  BeakerIcon
} from '@heroicons/vue/24/outline'

// Components
import NewMedicalRecordModal from '../../components/modals/NewMedicalRecordModal.vue'
import NewAppointmentModal from '../../components/modals/NewAppointmentModal.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const petsStore = usePetsStore()
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
const petId = computed(() => props.id || route.params.id)
const pet = ref(null)
const loading = ref(true)
const error = ref(null)
const activeTab = ref('history')
const showNewRecordModal = ref(false)
const showAppointmentModal = ref(false)
const petNotes = ref('')
const notesLoading = ref(false)

// Data
const medicalRecords = ref([])
const appointments = ref([])
const vaccinations = ref([])

// Tabs configuration
const tabs = [
  { id: 'history', name: 'Historial Médico', icon: ClipboardDocumentListIcon },
  { id: 'appointments', name: 'Citas', icon: CalendarIcon },
  { id: 'vaccinations', name: 'Vacunas', icon: ShieldCheckIcon },
  { id: 'notes', name: 'Observaciones', icon: DocumentTextIcon }
]

// Methods
const loadPetData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Load pet details
    const petData = await petsStore.fetchPetById(petId.value)
    pet.value = petData
    petNotes.value = petData.notes || ''
    
    // Load related data
    await Promise.all([
      loadMedicalRecords(),
      loadAppointments(),
      loadVaccinations()
    ])
    
  } catch (err) {
    console.error('Error loading pet data:', err)
    error.value = err.message || 'Error al cargar la información del paciente'
  } finally {
    loading.value = false
  }
}

const loadMedicalRecords = async () => {
  try {
    const records = await medicalRecordsStore.fetchByPetId(petId.value)
    medicalRecords.value = records
  } catch (err) {
    console.error('Error loading medical records:', err)
  }
}

const loadAppointments = async () => {
  try {
    const appointmentData = await appointmentsStore.fetchByPetId(petId.value)
    appointments.value = appointmentData
  } catch (err) {
    console.error('Error loading appointments:', err)
  }
}

const loadVaccinations = async () => {
  try {
    // This would be implemented when vaccination service is ready
    vaccinations.value = []
  } catch (err) {
    console.error('Error loading vaccinations:', err)
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

const getGenderBadgeClass = (gender) => {
  return gender === 'MALE' 
    ? 'bg-blue-100 text-blue-800'
    : 'bg-pink-100 text-pink-800'
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
  const labels = {
    'SCHEDULED': 'Programada',
    'CONFIRMED': 'Confirmada',
    'IN_PROGRESS': 'En Progreso',
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancelada'
  }
  return labels[status] || status
}

const handleRecordCreated = (newRecord) => {
  medicalRecords.value.unshift(newRecord)
  showNewRecordModal.value = false
  activeTab.value = 'history'
  toast.success('Registro médico creado exitosamente')
}

const handleAppointmentCreated = (newAppointment) => {
  appointments.value.unshift(newAppointment)
  showAppointmentModal.value = false
  activeTab.value = 'appointments'
  toast.success('Cita agendada exitosamente')
}

const editRecord = (record) => {
  // Navigate to edit medical record
  router.push(`/vet/medical-records/${record.id}/edit`)
}

const viewAppointment = (appointment) => {
  router.push(`/vet/appointments/${appointment.id}`)
}

const saveNotes = async () => {
  try {
    notesLoading.value = true
    await petsStore.updatePet(petId.value, { notes: petNotes.value })
    toast.success('Notas guardadas correctamente')
  } catch (err) {
    console.error('Error saving notes:', err)
    toast.error('Error al guardar las notas')
  } finally {
    notesLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPetData()
})
</script>
