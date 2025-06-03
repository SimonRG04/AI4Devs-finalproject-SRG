<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Registros Médicos</h1>
            <p class="mt-2 text-gray-600">Gestiona los registros médicos de tus pacientes</p>
          </div>
          <router-link
            to="/vet/medical-records/new"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Nuevo Registro
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Date Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
              <input
                v-model="filters.dateFrom"
                type="date"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
              <input
                v-model="filters.dateTo"
                type="date"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              />
            </div>

            <!-- Patient Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <input
                v-model="filters.patient"
                type="text"
                placeholder="Buscar por nombre de mascota o dueño"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              />
            </div>

            <!-- Actions -->
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Medical Records -->
      <div v-else class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Registros ({{ filteredRecords.length }})
          </h3>
        </div>

        <!-- Empty State -->
        <div v-if="filteredRecords.length === 0" class="text-center py-12">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay registros médicos</h3>
          <p class="mt-1 text-sm text-gray-500">
            No se encontraron registros con los filtros aplicados.
          </p>
        </div>

        <!-- Records List -->
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="record in paginatedRecords"
            :key="record.id"
            class="p-6 hover:bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <!-- Pet Photo -->
                  <img
                    v-if="record.pet?.photo_url"
                    :src="record.pet.photo_url"
                    :alt="record.pet.name"
                    class="h-12 w-12 rounded-full object-cover"
                  />
                  <div v-else class="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-500 text-lg">🐾</span>
                  </div>

                  <!-- Record Info -->
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <h4 class="text-lg font-medium text-gray-900">
                        {{ record.pet?.name }}
                      </h4>
                      <span class="text-sm text-gray-500">
                        ({{ record.pet?.species }})
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ record.pet?.owner?.first_name }} {{ record.pet?.owner?.last_name }}
                    </p>
                    <p class="text-sm text-gray-900 font-medium mt-1">
                      {{ record.chief_complaint || 'Consulta general' }}
                    </p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div class="flex items-center">
                        <CalendarIcon class="h-4 w-4 mr-1" />
                        {{ formatDate(record.date) }}
                      </div>
                      <div v-if="record.diagnosis" class="flex items-center">
                        <ClipboardDocumentCheckIcon class="h-4 w-4 mr-1" />
                        {{ record.diagnosis.substring(0, 50) }}{{ record.diagnosis.length > 50 ? '...' : '' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Record Details Preview -->
                <div v-if="expandedRecord === record.id" class="mt-4 pt-4 border-t border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Physical Examination -->
                    <div v-if="hasPhysicalExamination(record)">
                      <h5 class="text-sm font-medium text-gray-900 mb-2">Examen Físico</h5>
                      <div class="space-y-2 text-sm">
                        <div v-if="record.weight" class="flex justify-between">
                          <span class="text-gray-500">Peso:</span>
                          <span class="text-gray-900">{{ record.weight }} kg</span>
                        </div>
                        <div v-if="record.temperature" class="flex justify-between">
                          <span class="text-gray-500">Temperatura:</span>
                          <span class="text-gray-900">{{ record.temperature }}°C</span>
                        </div>
                        <div v-if="record.heart_rate" class="flex justify-between">
                          <span class="text-gray-500">Frecuencia cardíaca:</span>
                          <span class="text-gray-900">{{ record.heart_rate }} bpm</span>
                        </div>
                        <div v-if="record.respiratory_rate" class="flex justify-between">
                          <span class="text-gray-500">Frecuencia respiratoria:</span>
                          <span class="text-gray-900">{{ record.respiratory_rate }} rpm</span>
                        </div>
                      </div>
                    </div>

                    <!-- Clinical Information -->
                    <div>
                      <h5 class="text-sm font-medium text-gray-900 mb-2">Información Clínica</h5>
                      <div class="space-y-3 text-sm">
                        <div v-if="record.history">
                          <span class="text-gray-500 block">Historia:</span>
                          <span class="text-gray-900">{{ record.history }}</span>
                        </div>
                        <div v-if="record.diagnosis">
                          <span class="text-gray-500 block">Diagnóstico:</span>
                          <span class="text-gray-900">{{ record.diagnosis }}</span>
                        </div>
                        <div v-if="record.treatment">
                          <span class="text-gray-500 block">Tratamiento:</span>
                          <span class="text-gray-900">{{ record.treatment }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Follow-up and Notes -->
                  <div v-if="record.follow_up_date || record.notes" class="mt-4 pt-4 border-t border-gray-200">
                    <div v-if="record.follow_up_date" class="mb-3">
                      <div class="flex items-center text-sm text-amber-600">
                        <CalendarIcon class="h-4 w-4 mr-1" />
                        <span>Seguimiento programado: {{ formatDate(record.follow_up_date) }}</span>
                      </div>
                    </div>
                    <div v-if="record.notes">
                      <h5 class="text-sm font-medium text-gray-900 mb-1">Notas adicionales</h5>
                      <p class="text-sm text-gray-700">{{ record.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="toggleExpanded(record.id)"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon v-if="expandedRecord !== record.id" class="h-3 w-3 mr-1" />
                  <EyeSlashIcon v-else class="h-3 w-3 mr-1" />
                  {{ expandedRecord === record.id ? 'Ocultar' : 'Ver' }}
                </button>
                
                <router-link
                  :to="`/vet/medical-records/${record.id}/edit`"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon class="h-3 w-3 mr-1" />
                  Editar
                </router-link>

                <button
                  @click="deleteRecord(record)"
                  class="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                >
                  <TrashIcon class="h-3 w-3 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a 
              {{ Math.min(currentPage * itemsPerPage, filteredRecords.length) }} 
              de {{ filteredRecords.length }} resultados
            </div>
            <div class="flex space-x-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
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
import { useToast } from 'vue-toastification'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Heroicons
import { 
  PlusIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

// Services
import medicalRecordService from '@/services/medicalRecordService'

const toast = useToast()

// Reactive data
const loading = ref(true)
const records = ref([])
const expandedRecord = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  patient: ''
})

// Computed properties
const filteredRecords = computed(() => {
  let filtered = records.value

  if (filters.value.dateFrom) {
    filtered = filtered.filter(record => 
      new Date(record.date) >= new Date(filters.value.dateFrom)
    )
  }

  if (filters.value.dateTo) {
    filtered = filtered.filter(record => 
      new Date(record.date) <= new Date(filters.value.dateTo)
    )
  }

  if (filters.value.patient) {
    const search = filters.value.patient.toLowerCase()
    filtered = filtered.filter(record => 
      record.pet?.name?.toLowerCase().includes(search) ||
      record.pet?.owner?.first_name?.toLowerCase().includes(search) ||
      record.pet?.owner?.last_name?.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalPages = computed(() => 
  Math.ceil(filteredRecords.value.length / itemsPerPage)
)

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRecords.value.slice(start, end)
})

// Methods
const loadRecords = async () => {
  try {
    const response = await medicalRecordService.getVetMedicalRecords()
    records.value = response.data || response || []
  } catch (error) {
    console.error('Error loading medical records:', error)
    toast.error('Error al cargar los registros médicos')
  } finally {
    loading.value = false
  }
}

const toggleExpanded = (recordId) => {
  expandedRecord.value = expandedRecord.value === recordId ? null : recordId
}

const deleteRecord = async (record) => {
  if (confirm(`¿Estás seguro de que quieres eliminar el registro médico de ${record.pet?.name}?`)) {
    try {
      await medicalRecordService.deleteMedicalRecord(record.id)
      records.value = records.value.filter(r => r.id !== record.id)
      toast.success('Registro médico eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting medical record:', error)
      toast.error('Error al eliminar el registro médico')
    }
  }
}

const clearFilters = () => {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    patient: ''
  }
  currentPage.value = 1
}

const formatDate = (date) => {
  if (!date) return ''
  return format(parseISO(date), 'dd MMM yyyy', { locale: es })
}

const hasPhysicalExamination = (record) => {
  return record.weight || record.temperature || record.heart_rate || record.respiratory_rate
}

// Watchers
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadRecords()
})
</script>
