<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Pet Detail -->
      <div v-else-if="pet" class="space-y-8">
        <!-- Header -->
        <div class="flex items-center space-x-4 mb-8">
          <button
            @click="$router.go(-1)"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeftIcon class="h-6 w-6" />
          </button>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">{{ pet.name }}</h1>
            <p class="mt-2 text-gray-600">Detalles de tu mascota</p>
          </div>
        </div>

        <!-- Pet Info Card -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Información General</h3>
              <router-link
                :to="`/client/pets/${pet.id}/edit`"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
              >
                <PencilIcon class="h-4 w-4 mr-2" />
                Editar
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Pet Photo -->
              <div class="lg:col-span-1">
                <div class="text-center">
                  <img
                    v-if="pet.photoUrl || pet.photo_url"
                    :src="pet.photoUrl || pet.photo_url"
                    :alt="pet.name"
                    class="mx-auto h-48 w-48 rounded-full object-cover"
                  />
                  <div v-else class="mx-auto h-48 w-48 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-500 text-6xl">🐾</span>
                  </div>
                  <h4 class="mt-4 text-xl font-medium text-gray-900">{{ pet.name }}</h4>
                  <p class="text-gray-500">{{ translate('petSpecies', pet.species) }} • {{ pet.breed }}</p>
                </div>
              </div>

              <!-- Pet Details -->
              <div class="lg:col-span-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500">Especie</h5>
                    <p class="mt-1 text-sm text-gray-900">{{ translate('petSpecies', pet.species) }}</p>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-500">Raza</h5>
                    <p class="mt-1 text-sm text-gray-900">{{ pet.breed || 'No especificada' }}</p>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-500">Género</h5>
                    <p class="mt-1 text-sm text-gray-900">{{ getGenderText(pet.gender) }}</p>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-500">Edad</h5>
                    <p class="mt-1 text-sm text-gray-900">{{ calculateAge(pet.birthDate) }}</p>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-500">Peso</h5>
                    <p class="mt-1 text-sm text-gray-900">{{ pet.weight ? `${pet.weight} kg` : 'No registrado' }}</p>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-500">Color</h5>
                    <p class="mt-1 text-sm text-gray-900">{{ pet.color || 'No especificado' }}</p>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-500">Microchip</h5>
                    <p class="mt-1 text-sm text-gray-900">{{ pet.microchipId || 'No tiene' }}</p>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-500">Esterilizado</h5>
                    <p class="mt-1 text-sm text-gray-900">{{ pet.isNeutered ? 'Sí' : 'No' }}</p>
                  </div>
                </div>

                <!-- Medical Info -->
                <div v-if="pet.medical_conditions || pet.allergies || pet.medical_alerts" class="mt-6 pt-6 border-t border-gray-200">
                  <h5 class="text-sm font-medium text-gray-900 mb-4">Información Médica</h5>
                  <div class="space-y-4">
                    <div v-if="pet.medical_conditions">
                      <h6 class="text-sm font-medium text-gray-500">Condiciones Médicas</h6>
                      <p class="mt-1 text-sm text-gray-900">{{ pet.medical_conditions }}</p>
                    </div>
                    <div v-if="pet.allergies">
                      <h6 class="text-sm font-medium text-gray-500">Alergias</h6>
                      <p class="mt-1 text-sm text-gray-900">{{ pet.allergies }}</p>
                    </div>
                    <div v-if="pet.medical_alerts">
                      <h6 class="text-sm font-medium text-gray-500">Alertas Médicas</h6>
                      <div class="mt-1 flex items-center">
                        <ExclamationTriangleIcon class="h-5 w-5 text-yellow-500 mr-2" />
                        <p class="text-sm text-gray-900">{{ pet.medical_alerts }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div v-if="pet.notes" class="mt-6 pt-6 border-t border-gray-200">
                  <h5 class="text-sm font-medium text-gray-500">Notas</h5>
                  <p class="mt-1 text-sm text-gray-900">{{ pet.notes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <router-link
                :to="`/client/appointments/new?petId=${pet.id}`"
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
              >
                <CalendarIcon class="h-4 w-4 mr-2" />
                Agendar Cita
              </router-link>
              <router-link
                :to="`/client/pets/${pet.id}/medical-history`"
                class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentTextIcon class="h-4 w-4 mr-2" />
                Ver Historial Médico
              </router-link>
              <button
                @click="sharePetInfo"
                class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon class="h-4 w-4 mr-2" />
                Compartir Información
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Appointments -->
        <div v-if="recentAppointments.length > 0" class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Citas Recientes</h3>
              <router-link
                to="/client/appointments"
                class="text-sm text-vet-600 hover:text-vet-700"
              >
                Ver todas
              </router-link>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            <div
              v-for="appointment in recentAppointments.slice(0, 3)"
              :key="appointment.id"
              class="px-6 py-4 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ translate('appointmentType', appointment.type) }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(appointment.scheduledAt) }}</p>
                </div>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(appointment.status)
                  ]"
                >
                  {{ getStatusText(appointment.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointments -->
        <div v-if="appointments.length > 0" class="bg-white shadow rounded-lg mt-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Historial de Citas</h3>
              <router-link
                to="/client/appointments"
                class="text-sm text-vet-600 hover:text-vet-700"
              >
                Ver todas
              </router-link>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            <div
              v-for="appointment in appointments"
              :key="appointment.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-medium text-gray-900">{{ translate('appointmentType', appointment.type) }}</h4>
                  <p class="text-sm text-gray-600">{{ formatDate(appointment.scheduledAt) }}</p>
                  <p class="text-sm text-gray-500">
                    Dr. {{ appointment.veterinarian?.user?.firstName || appointment.veterinarian?.user?.first_name }} 
                    {{ appointment.veterinarian?.user?.lastName || appointment.veterinarian?.user?.last_name }}
                  </p>
                </div>
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getStatusBadgeClass(appointment.status)
                  ]"
                >
                  {{ getStatusLabel(appointment.status) }}
                </span>
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
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Mascota no encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">No se pudo cargar la información de la mascota.</p>
        <div class="mt-6">
          <router-link
            to="/client/pets"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
          >
            Volver a Mis Mascotas
          </router-link>
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
  PencilIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShareIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Services
import petService from '@/services/petService'

// Utils
import { translate, getBadgeClass } from '@/utils/translations'

// Components
import NewAppointmentModal from '../../components/modals/NewAppointmentModal.vue'
import ImageGallery from '../../components/common/ImageGallery.vue'

const route = useRoute()
const toast = useToast()

// Reactive data
const loading = ref(true)
const pet = ref(null)
const recentAppointments = ref([])
const appointments = ref([])

// Methods
const loadPetDetails = async () => {
  try {
    loading.value = true
    const petId = parseInt(route.params.id)
    
    // Load pet details and recent appointments in parallel
    const [petResponse, appointmentsResponse] = await Promise.all([
      petService.getPet(petId),
      petService.getPetAppointments(petId, { limit: 10 })
    ])
    
    console.log('Pet response:', petResponse)
    console.log('Appointments response:', appointmentsResponse)
    
    pet.value = petResponse.data || petResponse
    
    // Handle appointments response - check if it's paginated or direct array
    const appointmentsData = appointmentsResponse.data || appointmentsResponse
    if (Array.isArray(appointmentsData)) {
      recentAppointments.value = appointmentsData
      appointments.value = appointmentsData
    } else if (appointmentsData.data && Array.isArray(appointmentsData.data)) {
      recentAppointments.value = appointmentsData.data
      appointments.value = appointmentsData.data
    } else {
      recentAppointments.value = []
      appointments.value = []
    }
    
    console.log('Final pet data:', pet.value)
    console.log('Final appointments data:', appointments.value)
    
  } catch (error) {
    console.error('Error loading pet details:', error)
    toast.error('Error al cargar los detalles de la mascota')
  } finally {
    loading.value = false
  }
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 'No especificada'
  
  const birth = new Date(birthDate)
  const years = differenceInYears(new Date(), birth)
  const months = differenceInMonths(new Date(), birth) % 12
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}`
  } else {
    return `${months} mes${months > 1 ? 'es' : ''}`
  }
}

const getGenderText = (gender) => {
  return translate('petGender', gender)
}

const formatDate = (dateTime) => {
  if (!dateTime) return 'N/A'
  return format(parseISO(dateTime), 'dd MMM yyyy', { locale: es })
}

const getStatusColor = (status) => {
  return getBadgeClass('appointmentStatus', status)
}

const getStatusText = (status) => {
  return translate('appointmentStatus', status)
}

const getStatusBadgeClass = (status) => {
  return getBadgeClass('appointmentStatus', status)
}

const getStatusLabel = (status) => {
  return translate('appointmentStatus', status)
}

const sharePetInfo = () => {
  if (navigator.share) {
    navigator.share({
      title: `Información de ${pet.value.name}`,
      text: `Información de mi mascota ${pet.value.name} - ${pet.value.species} ${pet.value.breed}`,
      url: window.location.href
    })
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    toast.success('Enlace copiado al portapapeles')
  }
}

// Lifecycle
onMounted(() => {
  loadPetDetails()
})
</script>
