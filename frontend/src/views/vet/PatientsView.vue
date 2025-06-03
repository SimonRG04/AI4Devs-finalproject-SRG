<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
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
              v-model="filters.global.value"
              placeholder="Buscar por nombre, raza, propietario..."
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Especie</label>
            <Dropdown
              v-model="selectedSpecies"
              :options="speciesOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Todas las especies"
              class="w-full"
              showClear
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <Dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Todos los estados"
              class="w-full"
              showClear
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alertas Médicas</label>
            <Dropdown
              v-model="selectedAlert"
              :options="alertOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Todas"
              class="w-full"
              showClear
            />
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <DataTable
          v-model:filters="filters"
          :value="patients"
          :loading="loading"
          :paginator="true"
          :rows="20"
          :rowsPerPageOptions="[10, 20, 50]"
          :totalRecords="totalRecords"
          :lazy="true"
          @page="onPage"
          @sort="onSort"
          @filter="onFilter"
          filterDisplay="row"
          :globalFilterFields="['name', 'breed', 'client.user.first_name', 'client.user.last_name']"
          responsiveLayout="scroll"
          :scrollable="true"
          scrollHeight="600px"
          class="p-datatable-sm"
        >
          <template #empty>
            <div class="text-center py-8">
              <div class="mx-auto h-16 w-16 text-gray-400 mb-4">
                <MagnifyingGlassIcon class="w-full h-full" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
              <p class="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </template>

          <template #loading>
            <div class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-vet-600"></div>
              <span class="ml-3 text-gray-600">Cargando pacientes...</span>
            </div>
          </template>

          <!-- Pet Photo and Name -->
          <Column field="name" header="Paciente" :sortable="true" style="min-width: 200px">
            <template #body="{ data }">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <img
                    v-if="data.photo_url"
                    :src="data.photo_url"
                    :alt="data.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div v-else class="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-500 text-lg">🐾</span>
                  </div>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ data.name }}</div>
                  <div class="text-sm text-gray-500">{{ data.species }} • {{ data.breed }}</div>
                </div>
              </div>
            </template>
          </Column>

          <!-- Owner -->
          <Column field="client" header="Propietario" :sortable="false" style="min-width: 180px">
            <template #body="{ data }">
              <div v-if="data.client">
                <div class="text-sm font-medium text-gray-900">
                  {{ data.client.user.first_name }} {{ data.client.user.last_name }}
                </div>
                <div class="text-sm text-gray-500">{{ data.client.user.email }}</div>
              </div>
              <span v-else class="text-gray-400">Sin propietario</span>
            </template>
          </Column>

          <!-- Age and Gender -->
          <Column field="birth_date" header="Edad/Sexo" :sortable="true" style="min-width: 120px">
            <template #body="{ data }">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ calculateAge(data.birth_date) }}</div>
                <div class="text-sm text-gray-500">{{ data.gender === 'MALE' ? 'Macho' : 'Hembra' }}</div>
              </div>
            </template>
          </Column>

          <!-- Weight -->
          <Column field="weight" header="Peso" :sortable="true" style="min-width: 100px">
            <template #body="{ data }">
              <span class="text-sm font-medium text-gray-900">{{ data.weight }} kg</span>
            </template>
          </Column>

          <!-- Medical Alerts -->
          <Column field="medical_alerts" header="Alertas" :sortable="false" style="min-width: 150px">
            <template #body="{ data }">
              <div v-if="data.medical_alerts" class="flex items-center space-x-1">
                <ExclamationTriangleIcon class="h-4 w-4 text-yellow-500" />
                <Tooltip :value="data.medical_alerts">
                  <span class="text-sm text-yellow-700 cursor-help truncate max-w-[100px]">
                    {{ data.medical_alerts }}
                  </span>
                </Tooltip>
              </div>
              <span v-else class="text-sm text-gray-400">Sin alertas</span>
            </template>
          </Column>

          <!-- Status -->
          <Column field="is_active" header="Estado" :sortable="true" style="min-width: 100px">
            <template #body="{ data }">
              <Tag
                :value="data.is_active ? 'Activo' : 'Inactivo'"
                :severity="data.is_active ? 'success' : 'secondary'"
              />
            </template>
          </Column>

          <!-- Last Visit -->
          <Column field="last_visit" header="Última Visita" :sortable="false" style="min-width: 130px">
            <template #body="{ data }">
              <span v-if="data.last_visit" class="text-sm text-gray-600">
                {{ formatDate(data.last_visit) }}
              </span>
              <span v-else class="text-sm text-gray-400">Sin visitas</span>
            </template>
          </Column>

          <!-- Actions -->
          <Column header="Acciones" :exportable="false" style="min-width: 150px">
            <template #body="{ data }">
              <div class="flex space-x-2">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text p-button-sm"
                  @click="viewPatient(data)"
                  v-tooltip.top="'Ver detalles'"
                />
                <Button
                  icon="pi pi-calendar-plus"
                  class="p-button-rounded p-button-text p-button-sm"
                  @click="scheduleAppointment(data)"
                  v-tooltip.top="'Agendar cita'"
                />
                <Button
                  icon="pi pi-file-edit"
                  class="p-button-rounded p-button-text p-button-sm"
                  @click="addMedicalRecord(data)"
                  v-tooltip.top="'Agregar registro médico'"
                />
                <Button
                  icon="pi pi-history"
                  class="p-button-rounded p-button-text p-button-sm"
                  @click="viewHistory(data)"
                  v-tooltip.top="'Ver historial'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format, differenceInYears, differenceInMonths, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { FilterMatchMode } from 'primevue/api'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Tooltip from 'primevue/tooltip'

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
const toast = useToast()

// Reactive data
const patients = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const activePatients = ref(0)
const patientsWithAlerts = ref(0)
const todayAppointments = ref(0)

// Filters
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const selectedSpecies = ref(null)
const selectedStatus = ref(null)
const selectedAlert = ref(null)

// Options
const speciesOptions = ref([
  { label: 'Perro', value: 'DOG' },
  { label: 'Gato', value: 'CAT' },
  { label: 'Ave', value: 'BIRD' },
  { label: 'Conejo', value: 'RABBIT' },
  { label: 'Hámster', value: 'HAMSTER' },
  { label: 'Pez', value: 'FISH' },
  { label: 'Reptil', value: 'REPTILE' },
  { label: 'Otro', value: 'OTHER' }
])

const statusOptions = ref([
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
])

const alertOptions = ref([
  { label: 'Con alertas', value: 'with' },
  { label: 'Sin alertas', value: 'without' }
])

// Pagination
const lazyParams = ref({
  first: 0,
  rows: 20,
  sortField: null,
  sortOrder: null,
  filters: filters.value
})

// Methods
const loadPatients = async () => {
  try {
    loading.value = true
    const page = Math.floor(lazyParams.value.first / lazyParams.value.rows) + 1
    const response = await petService.getAllPets(page, lazyParams.value.rows)
    
    patients.value = response.data || response.pets || []
    totalRecords.value = response.total || response.totalCount || 0
    
    // Calculate stats
    activePatients.value = patients.value.filter(p => p.is_active).length
    patientsWithAlerts.value = patients.value.filter(p => p.medical_alerts).length
    
  } catch (error) {
    console.error('Error loading patients:', error)
    toast.error('Error al cargar los pacientes')
  } finally {
    loading.value = false
  }
}

const loadTodayAppointments = async () => {
  try {
    const response = await appointmentService.getTodayAppointments()
    todayAppointments.value = response.data?.length || 0
  } catch (error) {
    console.error('Error loading today appointments:', error)
  }
}

const onPage = (event) => {
  lazyParams.value = event
  loadPatients()
}

const onSort = (event) => {
  lazyParams.value = event
  loadPatients()
}

const onFilter = (event) => {
  lazyParams.value.filters = event.filters
  loadPatients()
}

const refreshData = () => {
  loadPatients()
  loadTodayAppointments()
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

const addMedicalRecord = (patient) => {
  router.push(`/vet/patients/${patient.id}/medical-record/new`)
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

// Watchers for filters
watch([selectedSpecies, selectedStatus, selectedAlert], () => {
  // Apply additional filters
  loadPatients()
})

// Lifecycle
onMounted(() => {
  loadPatients()
  loadTodayAppointments()
})
</script>

<style scoped>
/* Custom DataTable styles */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f3f4f6;
}

:deep(.p-button.p-button-text) {
  color: #6b7280;
}

:deep(.p-button.p-button-text:hover) {
  background-color: #f3f4f6;
  color: #059669;
}
</style> 