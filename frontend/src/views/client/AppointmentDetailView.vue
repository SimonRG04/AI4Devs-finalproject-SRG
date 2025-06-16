<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Appointment Detail -->
      <div v-else-if="appointment" class="space-y-8">
        <!-- Header -->
        <div class="flex items-center space-x-4 mb-8">
          <button
            @click="$router.go(-1)"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeftIcon class="h-6 w-6" />
          </button>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">Detalle de Cita</h1>
            <p class="mt-2 text-gray-600">{{ appointment.reason }}</p>
          </div>
          <div>
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

        <!-- Appointment Info -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Información de la Cita</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Pet Info -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-4">Mascota</h4>
                <div class="flex items-center space-x-4">
                  <img
                    v-if="appointment.pet?.photo_url"
                    :src="appointment.pet.photo_url"
                    :alt="appointment.pet.name"
                    class="h-16 w-16 rounded-full object-cover"
                  />
                  <div v-else class="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-500 text-xl">🐾</span>
                  </div>
                  <div>
                    <h5 class="text-lg font-medium text-gray-900">{{ appointment.pet?.name }}</h5>
                    <p class="text-gray-500">{{ appointment.pet?.species }} • {{ appointment.pet?.breed }}</p>
                  </div>
                </div>
              </div>

              <!-- Appointment Details -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-4">Tipo de Cita</h4>
                <p class="text-sm text-gray-700">{{ translate('appointmentType', appointment.type) }}</p>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-4">Detalles</h4>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <CalendarIcon class="h-5 w-5 text-gray-400 mr-3" />
                    <span class="text-sm text-gray-900">{{ formatDateTime(appointment.scheduledAt || appointment.dateTime) }}</span>
                  </div>
                  <div class="flex items-center">
                    <ClockIcon class="h-5 w-5 text-gray-400 mr-3" />
                    <span class="text-sm text-gray-900">{{ appointment.duration }} minutos</span>
                  </div>
                  <div v-if="appointment.veterinarian" class="flex items-center">
                    <UserIcon class="h-5 w-5 text-gray-400 mr-3" />
                    <span class="text-sm text-gray-900">
                      Dr. {{ appointment.veterinarian.user?.firstName || appointment.veterinarian.user?.first_name || appointment.veterinarian.firstName }} 
                      {{ appointment.veterinarian.user?.lastName || appointment.veterinarian.user?.last_name || appointment.veterinarian.lastName }}
                    </span>
                  </div>
                  <div v-if="appointment.veterinarian?.specialty || appointment.veterinarian?.specialization" class="flex items-center">
                    <UserIcon class="h-5 w-5 text-gray-400 mr-3" />
                    <span class="text-sm text-gray-500">{{ appointment.veterinarian.specialty || appointment.veterinarian.specialization }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reason -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Motivo de la consulta</h4>
              <p class="text-gray-700">{{ appointment.reason }}</p>
            </div>

            <!-- Notes -->
            <div v-if="appointment.notes" class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Notas adicionales</h4>
              <p class="text-gray-700">{{ appointment.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Medical Record (if completed) -->
        <div v-if="appointment.status === 'COMPLETED' && appointment.medicalRecord" class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Registro Médico</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-if="appointment.medicalRecord.diagnosis">
                <h4 class="text-sm font-medium text-gray-900">Diagnóstico</h4>
                <p class="text-gray-700 mt-1">{{ appointment.medicalRecord.diagnosis }}</p>
              </div>
              <div v-if="appointment.medicalRecord.treatment">
                <h4 class="text-sm font-medium text-gray-900">Tratamiento</h4>
                <p class="text-gray-700 mt-1">{{ appointment.medicalRecord.treatment }}</p>
              </div>
              <div v-if="appointment.medicalRecord.notes">
                <h4 class="text-sm font-medium text-gray-900">Observaciones</h4>
                <p class="text-gray-700 mt-1">{{ appointment.medicalRecord.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Acciones</h3>
          </div>
          <div class="p-6">
            <div class="flex flex-wrap gap-4">
              <router-link
                v-if="['SCHEDULED', 'CONFIRMED'].includes(appointment.status)"
                :to="`/client/appointments/${appointment.id}/reschedule`"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CalendarIcon class="h-4 w-4 mr-2" />
                Reprogramar
              </router-link>
              
              <button
                v-if="['SCHEDULED', 'CONFIRMED'].includes(appointment.status)"
                @click="cancelAppointment"
                class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <XMarkIcon class="h-4 w-4 mr-2" />
                Cancelar Cita
              </button>

              <router-link
                to="/client/appointments/new"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Nueva Cita
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Cita no encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">No se pudo cargar la información de la cita.</p>
        <div class="mt-6">
          <router-link
            to="/client/appointments"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
          >
            Volver a Mis Citas
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Heroicons
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  XMarkIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Services
import appointmentService from '@/services/appointmentService'

// Utils
import { translate, getBadgeClass } from '@/utils/translations'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Reactive data
const loading = ref(true)
const appointment = ref(null)

// Methods
const loadAppointment = async () => {
  try {
    const appointmentId = parseInt(route.params.id)
    const response = await appointmentService.getAppointment(appointmentId)
    appointment.value = response.data || response
  } catch (error) {
    console.error('Error loading appointment:', error)
    toast.error('Error al cargar la cita')
  } finally {
    loading.value = false
  }
}

const cancelAppointment = async () => {
  if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
    try {
      await appointmentService.cancelAppointment(appointment.value.id)
      appointment.value.status = 'CANCELLED'
      toast.success('Cita cancelada exitosamente')
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Error al cancelar la cita')
    }
  }
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return 'N/A'
  return format(parseISO(dateTime), 'dd MMMM yyyy \'a las\' HH:mm', { locale: es })
}

const getStatusColor = (status) => {
  return getBadgeClass('appointmentStatus', status)
}

const getStatusText = (status) => {
  return translate('appointmentStatus', status)
}

// Lifecycle
onMounted(() => {
  loadAppointment()
})
</script> 