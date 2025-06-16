<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <!-- Mensaje informativo cuando venimos de crear registro médico -->
        <div v-if="route.query.action === 'new-medical-record'" class="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Crear Nuevo Registro Médico
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>Selecciona un paciente de la lista para crear un nuevo registro médico. Haz clic en el botón "Agregar registro médico" <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">📋</span> junto al paciente.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Pacientes</h1>
            <p class="mt-2 text-gray-600">Gestiona todos los pacientes de la clínica</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="exportData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
              Exportar
            </button>
            <button
              @click="refreshData"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700"
            >
              <ArrowPathIcon class="h-5 w-5 mr-2" />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <InputText
              v-model="searchQuery"
              placeholder="Buscar por nombre, raza, propietario..."
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Especie</label>
            <select
              v-model="selectedSpecies"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las especies</option>
              <option v-for="species in speciesOptions" :key="species.value" :value="species.value">
                {{ species.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              v-model="selectedStatus"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alertas Médicas</label>
            <select
              v-model="selectedAlert"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="with">Con alertas</option>
              <option value="without">Sin alertas</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h3 class="text-lg font-medium text-gray-900">Lista de Pacientes</h3>
            <div class="text-sm text-gray-500">
              {{ filteredPatients.length }} paciente{{ filteredPatients.length !== 1 ? 's' : '' }} encontrado{{ filteredPatients.length !== 1 ? 's' : '' }}
            </div>
          </div>
        </div>

        <!-- Table Content -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietario
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edad/Sexo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peso
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alertas
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  <div class="flex items-center justify-center">
                    <div class="loading-spinner mr-2"></div>
                    Cargando pacientes...
                  </div>
                </td>
              </tr>
              <tr v-else-if="paginatedPatients.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  <div class="py-8">
                    <div class="mx-auto h-16 w-16 text-gray-400 mb-4">
                      <MagnifyingGlassIcon class="w-full h-full" />
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
                    <p class="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="patient in paginatedPatients" :key="patient.id" class="hover:bg-gray-50">
                <!-- Paciente -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <img
                        v-if="patient.photoUrl || patient.photo_url"
                        :src="patient.photoUrl || patient.photo_url"
                        :alt="patient.name"
                        class="h-10 w-10 rounded-full object-cover"
                      />
                      <div v-else class="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span class="text-gray-500 text-lg">🐾</span>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ patient.name }}</div>
                      <div class="text-sm text-gray-500">{{ getSpeciesText(patient.species) }} • {{ patient.breed }}</div>
                    </div>
                  </div>
                </td>
                
                <!-- Propietario -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="patient.client">
                    <div class="text-sm font-medium text-gray-900">
                      {{ patient.client.user.firstName || patient.client.user.first_name }} {{ patient.client.user.lastName || patient.client.user.last_name }}
                    </div>
                    <div class="text-sm text-gray-500">{{ patient.client.user.email }}</div>
                  </div>
                  <span v-else class="text-gray-400">Sin propietario</span>
                </td>
                
                <!-- Edad/Sexo -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ calculateAge(patient.birthDate || patient.birth_date) }}</div>
                  <div class="text-sm text-gray-500">{{ getGenderText(patient.gender) }}</div>
                </td>
                
                <!-- Peso -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ patient.weight }} kg</span>
                </td>
                
                <!-- Alertas -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="patient.medicalAlerts || patient.medical_alerts" class="flex items-center space-x-1">
                    <ExclamationTriangleIcon class="h-4 w-4 text-yellow-500" />
                    <span class="text-sm text-yellow-700 truncate max-w-[100px]" :title="patient.medicalAlerts || patient.medical_alerts">
                      {{ patient.medicalAlerts || patient.medical_alerts }}
                    </span>
                  </div>
                  <span v-else class="text-sm text-gray-400">Sin alertas</span>
                </td>
                
                <!-- Estado -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      patient.isActive !== false
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ patient.isActive !== false ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                
                <!-- Acciones -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewPatient(patient)"
                      class="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button
                      @click="scheduleAppointment(patient)"
                      class="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                      title="Agendar cita"
                    >
                      📅
                    </button>
                    <button
                      @click="addMedicalRecord(patient)"
                      class="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50"
                      title="Agregar registro médico"
                    >
                      📝
                    </button>
                    <button
                      @click="viewHistory(patient)"
                      class="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50"
                      title="Ver historial"
                    >
                      📋
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="px-6 py-3 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ ((currentPage - 1) * pageSize) + 1 }} a {{ Math.min(currentPage * pageSize, filteredPatients.length) }} de {{ filteredPatients.length }} pacientes
            </div>
            <div class="flex space-x-2">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <span class="px-3 py-1 text-sm">
                Página {{ currentPage }} de {{ totalPages }}
              </span>
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <span class="text-blue-600 text-lg">🐕</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Pacientes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalRecords }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <CheckCircleIcon class="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pacientes Activos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activePatients }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Con Alertas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ patientsWithAlerts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <CalendarIcon class="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Citas Hoy</p>
              <p class="text-2xl font-semibold text-gray-900">{{ todayAppointments }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format, differenceInYears, differenceInMonths, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// PrimeVue Components (solo Button que es estable)
import Button from 'primevue/button'

// Heroicons
import { 
  ArrowDownTrayIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

// Services
import petService from '@/services/petService'
import appointmentService from '@/services/appointmentService'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Reactive data
const patients = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const activePatients = ref(0)
const patientsWithAlerts = ref(0)
const todayAppointments = ref(0)

// Search and filters
const searchQuery = ref('')
const selectedSpecies = ref('')
const selectedStatus = ref('all')
const selectedAlert = ref('all')

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)

// Filter options
const speciesOptions = ref([
  { label: 'Perro', value: 'DOG' },
  { label: 'Gato', value: 'CAT' },
  { label: 'Ave', value: 'BIRD' },
  { label: 'Conejo', value: 'RABBIT' },
  { label: 'Hámster', value: 'HAMSTER' },
  { label: 'Cobaya', value: 'GUINEA_PIG' },
  { label: 'Pez', value: 'FISH' },
  { label: 'Reptil', value: 'REPTILE' },
  { label: 'Otro', value: 'OTHER' }
])

// Computed properties
const filteredPatients = computed(() => {
  let filtered = patients.value || []

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(patient => 
      patient.name?.toLowerCase().includes(query) ||
      patient.breed?.toLowerCase().includes(query) ||
      patient.client?.user?.firstName?.toLowerCase().includes(query) ||
      patient.client?.user?.lastName?.toLowerCase().includes(query) ||
      patient.client?.user?.first_name?.toLowerCase().includes(query) ||
      patient.client?.user?.last_name?.toLowerCase().includes(query) ||
      patient.client?.user?.email?.toLowerCase().includes(query)
    )
  }

  // Filter by species
  if (selectedSpecies.value) {
    filtered = filtered.filter(patient => patient.species === selectedSpecies.value)
  }

  // Filter by status
  if (selectedStatus.value !== 'all') {
    if (selectedStatus.value === 'active') {
      filtered = filtered.filter(patient => patient.isActive !== false)
    } else if (selectedStatus.value === 'inactive') {
      filtered = filtered.filter(patient => patient.isActive === false)
    }
  }

  // Filter by alerts
  if (selectedAlert.value !== 'all') {
    if (selectedAlert.value === 'with') {
      filtered = filtered.filter(patient => patient.medicalAlerts || patient.medical_alerts)
    } else if (selectedAlert.value === 'without') {
      filtered = filtered.filter(patient => !patient.medicalAlerts && !patient.medical_alerts)
    }
  }

  return filtered
})

const totalPages = computed(() => 
  Math.ceil(filteredPatients.value.length / pageSize.value)
)

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPatients.value.slice(start, end)
})

// Watchers and timers for debouncing
let loadPatientsTimer = null
let paginationTimer = null
let sortTimer = null
let filterTimer = null

// Methods
const loadPatients = async () => {
  try {
    loading.value = true
    
    // Usar el método seguro que maneja errores de validación
    const response = await petService.getPetsSafe({
      page: 1,
      limit: 100,
      includeOwner: true
    })
    
    const patientsData = response?.data || []
    patients.value = Array.isArray(patientsData) ? patientsData : []
    totalRecords.value = response?.total || patients.value.length
    
    // Calcular estadísticas reales basadas en los datos obtenidos
    setTimeout(() => {
      calculateRealStatistics()
    }, 200)
    
  } catch (error) {
    console.error('Error loading patients:', error)
    toast.error('Error al cargar los pacientes')
    patients.value = []
    totalRecords.value = 0
    resetStatistics()
  } finally {
    loading.value = false
  }
}

// Función separada para calcular estadísticas reales
const calculateRealStatistics = async () => {
  // Evitar race conditions usando nextTick
  await nextTick()
  
  try {
    // Estadísticas de pacientes (con verificación de datos)
    const allPatients = patients.value || []
    activePatients.value = allPatients.filter(p => p && p.isActive !== false).length
    patientsWithAlerts.value = allPatients.filter(p => p && (p.medical_alerts || p.medicalAlerts)).length
    
    // Citas de hoy usando el endpoint correcto del veterinario con timeouts
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos timeout
      
      const todayResponse = await appointmentService.getMyVetTodayAppointments()
      clearTimeout(timeoutId)
      
      const todayAppts = todayResponse?.data || todayResponse || []
      todayAppointments.value = Array.isArray(todayAppts) ? todayAppts.length : 0
    } catch (appointmentError) {
      console.warn('No se pudieron cargar las citas de hoy:', appointmentError.message || appointmentError)
      todayAppointments.value = 0
    }
    
  } catch (error) {
    console.error('Error calculating statistics:', error)
    resetStatistics()
  }
}

// Función para resetear estadísticas en caso de error
const resetStatistics = () => {
  activePatients.value = 0
  patientsWithAlerts.value = 0
  todayAppointments.value = 0
}

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const refreshData = () => {
  loadPatients()
}

const exportData = () => {
  // Implementar exportación
  toast.info('Función de exportación en desarrollo')
}

const viewPatient = (patient) => {
  router.push(`/vet/patients/${patient.id}`)
}

const scheduleAppointment = (patient) => {
  router.push(`/vet/appointments/new?petId=${patient.id}`)
}

const addMedicalRecord = async (patient) => {
  try {
    // Limpiar query parameters si existen
    if (route.query.action) {
      await router.replace({ name: 'vet-patients' })
    }
    
    // Navegar al formulario de nuevo registro médico usando el path directo
    await router.push(`/vet/patients/${patient.id}/medical-record/new`)
    
  } catch (error) {
    console.error('Error navigating to medical record form:', error)
    toast.error('Error al navegar al formulario de registro médico')
    
    // Intento de recuperación: forzar recarga de la página con la nueva URL
    setTimeout(() => {
      window.location.href = `/vet/patients/${patient.id}/medical-record/new`
    }, 1000)
  }
}

const viewHistory = (patient) => {
  router.push(`/vet/patients/${patient.id}/history`)
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A'
  
  const birth = new Date(birthDate)
  const years = differenceInYears(new Date(), birth)
  const months = differenceInMonths(new Date(), birth) % 12
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}`
  } else {
    return `${months} mes${months > 1 ? 'es' : ''}`
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es })
}

const getSpeciesText = (species) => {
  switch (species) {
    case 'DOG':
      return 'Perro'
    case 'CAT':
      return 'Gato'
    case 'BIRD':
      return 'Ave'
    case 'RABBIT':
      return 'Conejo'
    case 'HAMSTER':
      return 'Hámster'
    case 'GUINEA_PIG':
      return 'Cobaya'
    case 'FISH':
      return 'Pez'
    case 'REPTILE':
      return 'Reptil'
    case 'OTHER':
      return 'Otro'
    default:
      return species || 'No especificado'
  }
}

const getGenderText = (gender) => {
  switch (gender) {
    case 'MALE':
      return 'Macho'
    case 'FEMALE':
      return 'Hembra'
    default:
      return 'No especificado'
  }
}

// Reset page when filters change
watch([searchQuery, selectedSpecies, selectedStatus, selectedAlert], () => {
  currentPage.value = 1
})

// Cleanup function para limpiar timers
const cleanup = () => {
  if (loadPatientsTimer) clearTimeout(loadPatientsTimer)
  if (paginationTimer) clearTimeout(paginationTimer)
  if (sortTimer) clearTimeout(sortTimer)
  if (filterTimer) clearTimeout(filterTimer)
}

// Lifecycle - usando nextTick para evitar problemas con PrimeVue
onMounted(async () => {
  await nextTick()
  
  // Pequeño delay para asegurar que todos los componentes estén inicializados
  setTimeout(() => {
    loadPatients()
  }, 100)
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* Custom styles */
.loading-spinner {
  @apply inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600;
}

/* Hover states for action buttons */
button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Table responsive styles */
@media (max-width: 768px) {
  .table-container {
    font-size: 0.875rem;
  }
}
</style> 