<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center space-x-4 mb-8">
        <button
          @click="$router.go(-1)"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeftIcon class="h-6 w-6" />
        </button>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900">Historial Médico</h1>
          <p v-if="pet" class="mt-2 text-gray-600">Registros médicos de {{ pet.name }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Pet Info Summary -->
      <div v-else-if="pet" class="bg-white shadow rounded-lg mb-8">
        <div class="p-6">
          <div class="flex items-center space-x-4">
            <img
              v-if="pet.photoUrl"
              :src="pet.photoUrl"
              :alt="pet.name"
              class="h-16 w-16 rounded-full object-cover"
            />
            <div v-else class="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-gray-500 text-xl">🐾</span>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ pet.name }}</h3>
              <p class="text-gray-500">{{ getSpeciesText(pet.species) }} • {{ pet.breed }}</p>
              <p class="text-sm text-gray-500">{{ calculateAge(pet.birthDate) }}</p>
            </div>
            <div v-if="pet.medicalAlerts" class="ml-auto">
              <div class="flex items-center text-yellow-600">
                <ExclamationTriangleIcon class="h-5 w-5 mr-1" />
                <span class="text-sm font-medium">Alertas Médicas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Medical Records -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Registros Médicos ({{ medicalRecords.length }})
          </h3>
        </div>

        <!-- Empty State -->
        <div v-if="medicalRecords.length === 0" class="text-center py-12">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay registros médicos</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ pet?.name }} aún no tiene registros médicos en el sistema.
          </p>
        </div>

        <!-- Records Timeline -->
        <div v-else class="flow-root p-6">
          <ul role="list" class="-mb-8">
            <li
              v-for="(record, recordIdx) in medicalRecords"
              :key="record.id"
            >
              <div class="relative pb-8">
                <span
                  v-if="recordIdx !== medicalRecords.length - 1"
                  class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div class="relative flex space-x-3">
                  <!-- Timeline Icon -->
                  <div>
                    <span
                      class="h-8 w-8 rounded-full bg-vet-500 flex items-center justify-center ring-8 ring-white"
                    >
                      <DocumentTextIcon class="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>

                  <!-- Record Content -->
                  <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div class="min-w-0 flex-1">
                      <div class="bg-gray-50 rounded-lg p-4">
                        <!-- Record Header -->
                        <div class="flex items-center justify-between mb-3">
                          <div>
                            <h4 class="text-lg font-medium text-gray-900">
                              {{ record.title || record.chiefComplaint || 'Consulta Veterinaria' }}
                            </h4>
                            <p class="text-sm text-gray-500">
                              Dr. {{ record.veterinarian?.user?.firstName || record.veterinarian?.user?.first_name }} 
                              {{ record.veterinarian?.user?.lastName || record.veterinarian?.user?.last_name }}
                            </p>
                          </div>
                          <time class="text-sm text-gray-500">
                            {{ formatDate(record.date || record.createdAt) }}
                          </time>
                        </div>

                        <!-- Physical Examination -->
                        <div v-if="hasPhysicalExamination(record)" class="mb-4">
                          <h5 class="text-sm font-medium text-gray-900 mb-2">Examen Físico</h5>
                          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div v-if="record.weight">
                              <span class="text-gray-500">Peso:</span>
                              <span class="ml-1 text-gray-900">{{ record.weight }} kg</span>
                            </div>
                            <div v-if="record.temperature">
                              <span class="text-gray-500">Temperatura:</span>
                              <span class="ml-1 text-gray-900">{{ record.temperature }}°C</span>
                            </div>
                            <div v-if="record.heartRate">
                              <span class="text-gray-500">FC:</span>
                              <span class="ml-1 text-gray-900">{{ record.heartRate }} bpm</span>
                            </div>
                            <div v-if="record.respiratoryRate">
                              <span class="text-gray-500">FR:</span>
                              <span class="ml-1 text-gray-900">{{ record.respiratoryRate }} rpm</span>
                            </div>
                          </div>
                        </div>

                        <!-- History -->
                        <div v-if="record.history" class="mb-4">
                          <h5 class="text-sm font-medium text-gray-900 mb-1">Historia</h5>
                          <p class="text-sm text-gray-700">{{ record.history }}</p>
                        </div>

                        <!-- Diagnosis -->
                        <div v-if="record.diagnosis" class="mb-4">
                          <h5 class="text-sm font-medium text-gray-900 mb-1">Diagnóstico</h5>
                          <p class="text-sm text-gray-700">{{ record.diagnosis }}</p>
                        </div>

                        <!-- Treatment -->
                        <div v-if="record.treatment" class="mb-4">
                          <h5 class="text-sm font-medium text-gray-900 mb-1">Tratamiento</h5>
                          <p class="text-sm text-gray-700">{{ record.treatment }}</p>
                        </div>

                        <!-- Follow-up -->
                        <div v-if="record.followUpDate" class="mt-4 pt-3 border-t border-gray-200">
                          <div class="flex items-center text-sm text-amber-600">
                            <CalendarIcon class="h-4 w-4 mr-1" />
                            <span>Seguimiento programado: {{ formatDate(record.followUpDate) }}</span>
                          </div>
                        </div>

                        <!-- Notes -->
                        <div v-if="record.notes" class="mt-4 pt-3 border-t border-gray-200">
                          <h5 class="text-sm font-medium text-gray-900 mb-1">Notas</h5>
                          <p class="text-sm text-gray-700">{{ record.notes }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="pet" class="mt-8 bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Acciones</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <router-link
              :to="`/client/appointments/new?petId=${pet.id}`"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
            >
              <CalendarIcon class="h-4 w-4 mr-2" />
              Agendar Nueva Cita
            </router-link>
            <button
              @click="exportMedicalHistory"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowDownIcon class="h-4 w-4 mr-2" />
              Exportar Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'

// Heroicons
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

// Services
import petService from '@/services/petService'

const route = useRoute()
const toast = useToast()

// Reactive data
const loading = ref(true)
const pet = ref(null)
const medicalRecords = ref([])

// Methods
const loadMedicalHistory = async () => {
  try {
    const petId = parseInt(route.params.id)
    
    // Load pet details and medical history in parallel
    const [petResponse, historyResponse] = await Promise.all([
      petService.getPetById ? petService.getPetById(petId) : Promise.resolve(null),
      petService.getPetMedicalHistory ? petService.getPetMedicalHistory(petId) : Promise.resolve([])
    ])
    
    if (petResponse) {
      pet.value = petResponse.data || petResponse
    }
    
    medicalRecords.value = (historyResponse.data || historyResponse || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
  } catch (error) {
    console.error('Error loading medical history:', error)
    toast.error('Error al cargar el historial médico')
  } finally {
    loading.value = false
  }
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 'Edad no especificada'
  
  const birth = new Date(birthDate)
  const years = differenceInYears(new Date(), birth)
  const months = differenceInMonths(new Date(), birth) % 12
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}`
  } else {
    return `${months} mes${months > 1 ? 'es' : ''}`
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return format(parseISO(date), 'dd MMM yyyy', { locale: es })
}

const hasPhysicalExamination = (record) => {
  return record.weight || record.temperature || record.heartRate || record.respiratoryRate
}

const exportMedicalHistory = () => {
  // Simple implementation - could be enhanced with PDF generation
  const data = {
    pet: pet.value,
    records: medicalRecords.value,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `historial_medico_${pet.value?.name}_${format(new Date(), 'yyyy-MM-dd')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  toast.success('Historial médico exportado')
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

// Lifecycle
onMounted(() => {
  loadMedicalHistory()
})
</script>
