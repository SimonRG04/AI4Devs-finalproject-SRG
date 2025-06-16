<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
            <p class="mt-2 text-gray-600">Gestiona la información de tus mascotas</p>
          </div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Agregar Mascota
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="pets.length === 0" class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No tienes mascotas registradas</h3>
        <p class="mt-2 text-gray-500">Comienza agregando tu primera mascota.</p>
        <button
          @click="showCreateModal = true"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Agregar Primera Mascota
        </button>
      </div>

      <!-- Pets Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="pet in pets"
          :key="pet.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <!-- Pet Image -->
          <div class="h-48 bg-gray-200 relative">
            <img
              v-if="pet.photoUrl"
              :src="pet.photoUrl"
              :alt="pet.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-gray-400 text-6xl">🐾</div>
            </div>
            <!-- Status Badge -->
            <div class="absolute top-2 right-2">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  pet.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ pet.isActive !== false ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>

          <!-- Pet Info -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ pet.name }}</h3>
                <p class="text-sm text-gray-600">{{ pet.species }} • {{ pet.breed }}</p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editPet(pet)"
                  class="text-gray-400 hover:text-vet-600 transition-colors"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="viewPetDetails(pet)"
                  class="text-gray-400 hover:text-vet-600 transition-colors"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>Edad:</span>
                <span>{{ calculateAge(pet.birthDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Peso:</span>
                <span>{{ pet.weight }} kg</span>
              </div>
              <div class="flex justify-between">
                <span>Sexo:</span>
                <span>{{ pet.gender === 'MALE' ? 'Macho' : 'Hembra' }}</span>
              </div>
              <div v-if="pet.microchipId" class="flex justify-between">
                <span>Microchip:</span>
                <span class="font-mono text-xs">{{ pet.microchipId }}</span>
              </div>
            </div>

            <!-- Medical Alerts -->
            <div v-if="pet.medicalAlerts" class="mt-4">
              <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div class="flex">
                  <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
                  <div class="ml-3">
                    <h4 class="text-sm font-medium text-yellow-800">Alertas Médicas</h4>
                    <p class="text-sm text-yellow-700">{{ pet.medicalAlerts }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex space-x-3">
              <button
                @click="viewMedicalHistory(pet)"
                class="flex-1 bg-vet-50 text-vet-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-vet-100 transition-colors"
              >
                Historial
              </button>
              <button
                @click="scheduleAppointment(pet)"
                class="flex-1 bg-vet-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-vet-700 transition-colors"
              >
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Pet Modal -->
    <Dialog v-model:visible="showCreateModal" modal header="Agregar Nueva Mascota" :style="{ width: '50rem' }">
      <PetForm
        :pet="null"
        @save="handleSavePet"
        @cancel="closeModal"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format, differenceInYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'

// PrimeVue Components
import Dialog from 'primevue/dialog'

// Heroicons
import { 
  PlusIcon, 
  PencilIcon, 
  EyeIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

// Services
import petService from '@/services/petService'

// Components
import PetForm from '@/components/forms/PetForm.vue'

const router = useRouter()
const toast = useToast()

// Reactive data
const pets = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const selectedPet = ref(null)

// Methods
const loadPets = async () => {
  try {
    loading.value = true
    const response = await petService.getMyPets()
    pets.value = response.data || response
  } catch (error) {
    console.error('Error loading pets:', error)
    toast.error('Error al cargar las mascotas')
  } finally {
    loading.value = false
  }
}

const editPet = (pet) => {
  router.push(`/client/pets/${pet.id}/edit`)
}

const viewPetDetails = (pet) => {
  router.push(`/client/pets/${pet.id}`)
}

const viewMedicalHistory = (pet) => {
  router.push(`/client/pets/${pet.id}/medical-history`)
}

const scheduleAppointment = (pet) => {
  router.push(`/client/appointments/new?petId=${pet.id}`)
}

const handleSavePet = async (petData) => {
  try {
    await petService.createPet(petData)
    toast.success('Mascota creada exitosamente')
    closeModal()
    loadPets()
  } catch (error) {
    console.error('Error creating pet:', error)
    toast.error('Error al crear la mascota')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  selectedPet.value = null
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

// Lifecycle
onMounted(() => {
  loadPets()
})
</script> 