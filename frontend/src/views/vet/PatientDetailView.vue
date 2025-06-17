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
                  v-if="pet.photoUrl || pet.photo_url" 
                  :src="pet.photoUrl || pet.photo_url" 
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
                    {{ getSpeciesText(pet.species) }} - {{ pet.breed }}
                  </span>
                  <span class="flex items-center">
                    <CakeIcon class="h-4 w-4 mr-1" />
                    {{ calculateAge(pet.birthDate || pet.birth_date) }}
                  </span>
                  <span class="flex items-center">
                    <ScaleIcon class="h-4 w-4 mr-1" />
                    {{ pet.weight }}kg
                  </span>
                </div>
                <div class="mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        :class="getGenderBadgeClass(pet.gender)">
                    {{ getGenderText(pet.gender) }}
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
                <p class="mt-1 text-sm text-gray-900">
                  {{ getOwnerName(pet) }}
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Teléfono</p>
                <p class="mt-1 text-sm text-gray-900">{{ getOwnerPhone(pet) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Email</p>
                <p class="mt-1 text-sm text-gray-900">{{ getOwnerEmail(pet) }}</p>
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
                            • {{ prescription.medication || prescription.medicationName }} - {{ prescription.dosage }} ({{ prescription.frequency }})
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
          <div v-if="activeTab === 'appointments'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">Historial de Citas</h3>
              <button
                @click="showNewAppointmentModal = true"
                class="bg-vet-600 text-white px-4 py-2 rounded-lg hover:bg-vet-700 transition-colors"
              >
                Nueva Cita
              </button>
            </div>
            
            <div v-if="appointments.length === 0" class="text-center py-8 text-gray-500">
              <CalendarIcon class="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No hay citas registradas para esta mascota</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="appointment in appointments"
                :key="appointment.id"
                class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <div class="flex items-center space-x-2 mb-2">
                      <span 
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getBadgeClass('appointmentStatus', appointment.status)
                        ]"
                      >
                        {{ getStatusLabel(appointment.status) }}
                      </span>
                      <span 
                        v-if="appointment.priority && appointment.priority !== 'NORMAL'"
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getBadgeClass('appointmentPriority', appointment.priority)
                        ]"
                                              >
                          {{ translate('appointmentPriority', appointment.priority) }}
                        </span>
                    </div>
                    <h4 class="text-sm font-medium text-gray-900">
                      {{ translate('appointmentType', appointment.type) }}
                    </h4>
                    <p class="text-sm text-gray-600">
                      {{ formatDate(appointment.scheduledAt) }} a las {{ formatTime(appointment.scheduledAt) }}
                    </p>
                    <p v-if="appointment.veterinarian" class="text-sm text-gray-500">
                      Dr. {{ appointment.veterinarian.user?.firstName || appointment.veterinarian.user?.first_name }} 
                      {{ appointment.veterinarian.user?.lastName || appointment.veterinarian.user?.last_name }}
                    </p>
                  </div>
                  <button class="text-vet-600 hover:text-vet-700">
                    <EyeIcon class="h-5 w-5" />
                  </button>
                </div>
                
                <div v-if="appointment.notes" class="mb-3">
                  <p class="text-sm text-gray-700">{{ appointment.notes }}</p>
                </div>
                
                <!-- Imágenes de la cita -->
                <ImageGallery
                  v-if="appointment.images && appointment.images.length > 0"
                  :images="appointment.images"
                  title="Imágenes de la cita"
                  :max-visible="3"
                  class="mt-3"
                />
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

    <!-- Edit Medical Record Modal -->
    <NewMedicalRecordModal
      v-if="showEditRecordModal && editingRecord"
      :pet-id="petId"
      :editing-record="editingRecord"
      @close="showEditRecordModal = false"
      @created="handleRecordUpdated"
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

// Utils
import { translate } from '@/utils/translations'

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
  BeakerIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

// Composables
import { useDetailViewRefresh } from '../../composables/useAutoRefresh'

// Components
import NewMedicalRecordModal from '../../components/modals/NewMedicalRecordModal.vue'
import NewAppointmentModal from '../../components/modals/NewAppointmentModal.vue'
import ImageGallery from '../../components/common/ImageGallery.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const petsStore = usePetsStore()
const appointmentsStore = useAppointmentsStore()
const medicalRecordsStore = useMedicalRecordsStore()

// Auto-refresh setup
const { refresh: refreshAll } = useDetailViewRefresh([
  () => loadMedicalRecords(),
  () => loadAppointments(),
  () => loadVaccinations()
])

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
const showEditRecordModal = ref(false)
const showAppointmentModal = ref(false)
const showNewAppointmentModal = ref(false)
const editingRecord = ref(null)
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
    
    // Load pet details (now includes medical records)
    const petData = await petsStore.fetchPet(petId.value)
    pet.value = petData
    petNotes.value = petData.notes || ''
    
    // Extract medical records from pet data if available
    if (petData.medicalRecords && Array.isArray(petData.medicalRecords)) {
      medicalRecords.value = petData.medicalRecords
    } else {
      // Fallback to separate call if not included
      await loadMedicalRecords()
    }
    
    // Extract appointments from pet data if available
    if (petData.appointments && Array.isArray(petData.appointments)) {
      appointments.value = petData.appointments
    } else {
      // Fallback to separate call if not included
      await loadAppointments()
    }
    
    // Load vaccinations (not included in pet response yet)
    await loadVaccinations()
    
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
    
    // Asegurar que records sea un array
    if (Array.isArray(records)) {
      medicalRecords.value = records
    } else if (records && records.data && Array.isArray(records.data)) {
      medicalRecords.value = records.data
    } else {
      console.warn('Unexpected records structure:', records)
      medicalRecords.value = []
    }
  } catch (err) {
    console.error('Error loading medical records:', err)
    medicalRecords.value = [] // Asegurar que siempre sea un array
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
  return translate('appointmentStatus', status)
}

const handleRecordCreated = async (newRecord) => {
  // Asegurar que medicalRecords.value sea un array
  if (!Array.isArray(medicalRecords.value)) {
    console.warn('medicalRecords.value is not an array, initializing as empty array')
    medicalRecords.value = []
  }
  
  medicalRecords.value.unshift(newRecord)
  showNewRecordModal.value = false
  activeTab.value = 'history'
  toast.success('Registro médico creado exitosamente')
  
  // Refrescar datos automáticamente
  setTimeout(() => refreshAll(), 1500)
}

const handleRecordUpdated = async (updatedRecord) => {
  // Encontrar y actualizar el registro en la lista
  const index = medicalRecords.value.findIndex(record => record.id === updatedRecord.id)
  if (index !== -1) {
    medicalRecords.value[index] = updatedRecord
  }
  
  showEditRecordModal.value = false
  editingRecord.value = null
  toast.success('Registro médico actualizado exitosamente')
  
  // Refrescar datos automáticamente
  setTimeout(() => refreshAll(), 1000)
}

const handleAppointmentCreated = async (newAppointment) => {
  appointments.value.unshift(newAppointment)
  showAppointmentModal.value = false
  activeTab.value = 'appointments'
  toast.success('Cita agendada exitosamente')
  
  // Refrescar datos automáticamente
  setTimeout(() => refreshAll(), 1000)
}

const editRecord = (record) => {
  editingRecord.value = { ...record }
  showEditRecordModal.value = true
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

const getBadgeClass = (type, status) => {
  const classes = {
    'appointmentStatus': {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    },
    'appointmentPriority': {
      'NORMAL': 'bg-gray-100 text-gray-800',
      'HIGH': 'bg-red-100 text-red-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800'
    }
  }
  return classes[type][status] || 'bg-gray-100 text-gray-800'
}

const getSpeciesText = (species) => {
  return translate('petSpecies', species)
}

const getGenderText = (gender) => {
  return translate('petGender', gender)
}

// Helper functions para datos del propietario
const getOwnerName = (pet) => {
  if (!pet) return 'No disponible'
  
  // Intentar diferentes estructuras de datos
  const owner = pet.owner || pet.client?.user || pet.client
  if (!owner) return 'No disponible'
  
  const firstName = owner.firstName || owner.first_name || ''
  const lastName = owner.lastName || owner.last_name || ''
  
  if (!firstName && !lastName) return 'No disponible'
  
  return `${firstName} ${lastName}`.trim()
}

const getOwnerPhone = (pet) => {
  if (!pet) return 'No disponible'
  
  const owner = pet.owner || pet.client?.user || pet.client
  return owner?.phone || 'No disponible'
}

const getOwnerEmail = (pet) => {
  if (!pet) return 'No disponible'
  
  const owner = pet.owner || pet.client?.user || pet.client
  return owner?.email || 'No disponible'
}

// Lifecycle
onMounted(() => {
  loadPetData()
})
</script>
