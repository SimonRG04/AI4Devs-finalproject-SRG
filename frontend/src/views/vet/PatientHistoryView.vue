<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex justify-center items-center min-h-screen">
      <div class="loading-spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error al cargar historial</h3>
            <p class="mt-2 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
              
              <div v-if="pet">
                <h1 class="text-2xl font-bold text-gray-900">
                  Historial Médico - {{ pet.name }}
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                  {{ pet.species }} - {{ pet.breed }} | {{ calculateAge(pet.birthDate) }}
                </p>
              </div>
            </div>

            <div class="flex space-x-3">
              <button
                @click="exportHistory"
                :disabled="exporting"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span v-if="exporting" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
              
              <router-link
                :to="`/vet/patients/${petId}/medical-record/new`"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Nuevo Registro
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Patient Summary Card -->
      <div v-if="pet" class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center space-x-6">
            <img 
              v-if="pet.photoUrl" 
              :src="pet.photoUrl" 
              :alt="pet.name"
              class="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
            >
            <div v-else class="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
              <HeartIcon class="h-8 w-8 text-gray-400" />
            </div>
            
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-900">{{ pet.name }}</h2>
              <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p class="font-medium text-gray-500">Especie</p>
                  <p class="text-gray-900">{{ pet.species }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-500">Raza</p>
                  <p class="text-gray-900">{{ pet.breed }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-500">Peso Actual</p>
                  <p class="text-gray-900">{{ pet.weight }}kg</p>
                </div>
                <div>
                  <p class="font-medium text-gray-500">Propietario</p>
                  <p class="text-gray-900">{{ pet.owner?.fullName }}</p>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="hidden lg:block">
              <div class="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p class="text-2xl font-semibold text-primary-600">{{ stats.totalRecords }}</p>
                  <p class="text-xs text-gray-500">Registros</p>
                </div>
                <div>
                  <p class="text-2xl font-semibold text-green-600">{{ stats.vaccinations }}</p>
                  <p class="text-xs text-gray-500">Vacunas</p>
                </div>
                <div>
                  <p class="text-2xl font-semibold text-blue-600">{{ stats.visits }}</p>
                  <p class="text-xs text-gray-500">Visitas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Buscar en historial
              </label>
              <div class="relative">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  class="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Buscar por diagnóstico, síntomas, tratamiento..."
                />
              </div>
            </div>

            <!-- Date Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                v-model="filters.dateFrom"
                type="date"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                v-model="filters.dateTo"
                type="date"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Record Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tipo de registro
              </label>
              <select
                v-model="filters.recordType"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos los tipos</option>
                <option value="CONSULTATION">Consulta</option>
                <option value="EMERGENCY">Emergencia</option>
                <option value="SURGERY">Cirugía</option>
                <option value="VACCINATION">Vacunación</option>
                <option value="CHECKUP">Chequeo</option>
                <option value="FOLLOW_UP">Seguimiento</option>
              </select>
            </div>

            <!-- Sort Options -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                v-model="sortBy"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="date_desc">Más reciente primero</option>
                <option value="date_asc">Más antiguo primero</option>
                <option value="type">Por tipo</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline View Toggle -->
      <div class="mb-6 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">Vista:</span>
          <div class="flex bg-gray-100 rounded-lg p-1">
            <button
              @click="viewMode = 'timeline'"
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md',
                viewMode === 'timeline'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <ClockIcon class="h-4 w-4 inline mr-1" />
              Cronología
            </button>
            <button
              @click="viewMode = 'cards'"
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md',
                viewMode === 'cards'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <Squares2X2Icon class="h-4 w-4 inline mr-1" />
              Tarjetas
            </button>
          </div>
        </div>
        
        <p class="text-sm text-gray-500">
          {{ filteredRecords.length }} registro{{ filteredRecords.length !== 1 ? 's' : '' }} encontrado{{ filteredRecords.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Medical Records -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="filteredRecords.length === 0" class="text-center py-12">
        <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron registros</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery || hasActiveFilters ? 'Prueba ajustando los filtros de búsqueda.' : 'Este paciente aún no tiene registros médicos.' }}
        </p>
      </div>

      <!-- Timeline View -->
      <div v-else-if="viewMode === 'timeline'" class="space-y-8">
        <div v-for="(group, yearMonth) in groupedRecords" :key="yearMonth">
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center">
              <span class="bg-gray-50 px-3 text-sm font-medium text-gray-900">
                {{ formatGroupHeader(yearMonth) }}
              </span>
            </div>
          </div>
          
          <div class="mt-6 flow-root">
            <ul class="-mb-8">
              <li v-for="(record, index) in group" :key="record.id">
                <div class="relative pb-8">
                  <span
                    v-if="index !== group.length - 1"
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                        <component :is="getRecordIcon(record.visitType)" class="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div class="flex-1">
                        <div class="bg-white rounded-lg shadow p-4 border border-gray-200">
                          <div class="flex items-start justify-between">
                            <div class="flex-1">
                              <h4 class="text-sm font-medium text-gray-900">{{ record.title }}</h4>
                              <p class="mt-1 text-sm text-gray-600">{{ record.symptoms }}</p>
                              <div class="mt-2">
                                <p class="text-sm"><strong>Diagnóstico:</strong> {{ record.diagnosis }}</p>
                                <p class="text-sm"><strong>Tratamiento:</strong> {{ record.treatment }}</p>
                              </div>
                              
                              <!-- Prescriptions -->
                              <div v-if="record.prescriptions && record.prescriptions.length > 0" class="mt-3">
                                <p class="text-xs font-medium text-gray-700 mb-1">Prescripciones:</p>
                                <div class="space-y-1">
                                  <div
                                    v-for="prescription in record.prescriptions"
                                    :key="prescription.id"
                                    class="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1"
                                  >
                                    {{ prescription.medicationName }} - {{ prescription.dosage }} ({{ prescription.frequency }})
                                  </div>
                                </div>
                              </div>

                              <!-- Vital Signs -->
                              <div v-if="record.temperature || record.weight" class="mt-3 flex space-x-4 text-xs text-gray-500">
                                <span v-if="record.temperature">Temp: {{ record.temperature }}°C</span>
                                <span v-if="record.weight">Peso: {{ record.weight }}kg</span>
                                <span v-if="record.heartRate">FC: {{ record.heartRate }} bpm</span>
                              </div>
                            </div>
                            
                            <div class="flex items-center space-x-2 ml-4">
                              <span 
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="getRecordTypeBadgeClass(record.visitType)"
                              >
                                {{ getRecordTypeLabel(record.visitType) }}
                              </span>
                              
                              <button
                                @click="editRecord(record)"
                                class="text-gray-400 hover:text-gray-600"
                              >
                                <PencilIcon class="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        <time :datetime="record.createdAt">{{ formatDateTime(record.createdAt) }}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Cards View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="record in filteredRecords"
          :key="record.id"
          class="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-2">
                <component :is="getRecordIcon(record.visitType)" class="h-5 w-5 text-primary-600" />
                <h3 class="text-lg font-medium text-gray-900">{{ record.title }}</h3>
              </div>
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getRecordTypeBadgeClass(record.visitType)"
              >
                {{ getRecordTypeLabel(record.visitType) }}
              </span>
            </div>
            
            <p class="mt-2 text-sm text-gray-600">{{ record.diagnosis }}</p>
            
            <div class="mt-4 space-y-2">
              <p class="text-xs text-gray-500"><strong>Síntomas:</strong> {{ truncateText(record.symptoms, 100) }}</p>
              <p class="text-xs text-gray-500"><strong>Tratamiento:</strong> {{ truncateText(record.treatment, 100) }}</p>
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <time class="text-xs text-gray-500" :datetime="record.createdAt">
                {{ formatDate(record.createdAt) }}
              </time>
              <button
                @click="editRecord(record)"
                class="text-primary-600 hover:text-primary-500 text-xs font-medium"
              >
                Ver detalles →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePetsStore } from '../../stores/pets'
import { useMedicalRecordsStore } from '../../stores/medicalRecords'
import { useToast } from 'vue-toastification'
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'

// Icons
import {
  ArrowLeftIcon,
  HeartIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  PencilIcon,
  UserGroupIcon,
  BeakerIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const petsStore = usePetsStore()
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
const medicalRecords = ref([])
const initialLoading = ref(true)
const loading = ref(false)
const error = ref(null)
const exporting = ref(false)
const viewMode = ref('timeline')
const searchQuery = ref('')
const sortBy = ref('date_desc')

const filters = ref({
  dateFrom: '',
  dateTo: '',
  recordType: ''
})

// Computed properties
const stats = computed(() => {
  return {
    totalRecords: medicalRecords.value.length,
    vaccinations: medicalRecords.value.filter(r => r.visitType === 'VACCINATION').length,
    visits: medicalRecords.value.filter(r => ['CONSULTATION', 'CHECKUP'].includes(r.visitType)).length
  }
})

const hasActiveFilters = computed(() => {
  return filters.value.dateFrom || filters.value.dateTo || filters.value.recordType
})

const filteredRecords = computed(() => {
  let filtered = [...medicalRecords.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(record => 
      record.title.toLowerCase().includes(query) ||
      record.symptoms.toLowerCase().includes(query) ||
      record.diagnosis.toLowerCase().includes(query) ||
      record.treatment.toLowerCase().includes(query)
    )
  }
  
  // Date range filter
  if (filters.value.dateFrom) {
    filtered = filtered.filter(record => 
      new Date(record.createdAt) >= new Date(filters.value.dateFrom)
    )
  }
  
  if (filters.value.dateTo) {
    filtered = filtered.filter(record => 
      new Date(record.createdAt) <= new Date(filters.value.dateTo)
    )
  }
  
  // Record type filter
  if (filters.value.recordType) {
    filtered = filtered.filter(record => record.visitType === filters.value.recordType)
  }
  
  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date_asc':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'date_desc':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'type':
        return a.visitType.localeCompare(b.visitType)
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })
  
  return filtered
})

const groupedRecords = computed(() => {
  const groups = {}
  
  filteredRecords.value.forEach(record => {
    const date = parseISO(record.createdAt)
    const yearMonth = format(date, 'yyyy-MM')
    
    if (!groups[yearMonth]) {
      groups[yearMonth] = []
    }
    groups[yearMonth].push(record)
  })
  
  return groups
})

// Methods
const loadPatientData = async () => {
  try {
    initialLoading.value = true
    error.value = null
    
    // Load pet details
    const petData = await petsStore.fetchPetById(petId.value)
    pet.value = petData
    
    // Load medical records
    loading.value = true
    const records = await medicalRecordsStore.fetchByPetId(petId.value)
    medicalRecords.value = records
    
  } catch (err) {
    console.error('Error loading patient data:', err)
    error.value = err.message || 'Error al cargar la información del paciente'
  } finally {
    initialLoading.value = false
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

const formatDateTime = (dateTime) => {
  return format(parseISO(dateTime), 'dd/MM/yyyy HH:mm', { locale: es })
}

const formatGroupHeader = (yearMonth) => {
  const date = parseISO(`${yearMonth}-01`)
  return format(date, 'MMMM yyyy', { locale: es })
}

const getRecordIcon = (visitType) => {
  const icons = {
    'CONSULTATION': UserGroupIcon,
    'EMERGENCY': ExclamationTriangleIcon,
    'SURGERY': ScissorsIcon,
    'VACCINATION': ShieldCheckIcon,
    'CHECKUP': EyeIcon,
    'FOLLOW_UP': ClockIcon
  }
  return icons[visitType] || ClipboardDocumentListIcon
}

const getRecordTypeLabel = (visitType) => {
  const labels = {
    'CONSULTATION': 'Consulta',
    'EMERGENCY': 'Emergencia',
    'SURGERY': 'Cirugía',
    'VACCINATION': 'Vacunación',
    'CHECKUP': 'Chequeo',
    'FOLLOW_UP': 'Seguimiento'
  }
  return labels[visitType] || visitType
}

const getRecordTypeBadgeClass = (visitType) => {
  const classes = {
    'CONSULTATION': 'bg-blue-100 text-blue-800',
    'EMERGENCY': 'bg-red-100 text-red-800',
    'SURGERY': 'bg-purple-100 text-purple-800',
    'VACCINATION': 'bg-green-100 text-green-800',
    'CHECKUP': 'bg-yellow-100 text-yellow-800',
    'FOLLOW_UP': 'bg-gray-100 text-gray-800'
  }
  return classes[visitType] || 'bg-gray-100 text-gray-800'
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {
    dateFrom: '',
    dateTo: '',
    recordType: ''
  }
  sortBy.value = 'date_desc'
}

const editRecord = (record) => {
  router.push(`/vet/medical-records/${record.id}/edit`)
}

const exportHistory = async () => {
  try {
    exporting.value = true
    // This would generate and download a PDF report
    toast.info('Funcionalidad de exportación próximamente disponible')
  } catch (error) {
    console.error('Error exporting history:', error)
    toast.error('Error al exportar el historial')
  } finally {
    exporting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPatientData()
})
</script> 