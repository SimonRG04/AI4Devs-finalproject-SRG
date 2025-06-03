<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button
            @click="$router.go(-1)"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeftIcon class="h-6 w-6" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Agendar Nueva Cita</h1>
            <p class="mt-2 text-gray-600">Programa una cita veterinaria para tu mascota</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="initialLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Main Form -->
      <div v-else class="bg-white rounded-lg shadow-sm p-8">
        <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting, values }">
          <div class="space-y-8">
            <!-- Step 1: Seleccionar Mascota -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">1. Seleccionar Mascota</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field name="petId" v-slot="{ field }">
                  <div
                    v-for="pet in pets"
                    :key="pet.id"
                    @click="selectPet(pet.id)"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200',
                      selectedPetId === pet.id 
                        ? 'border-vet-500 bg-vet-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <input
                      v-bind="field"
                      type="radio"
                      :value="pet.id"
                      class="sr-only"
                    />
                    <div class="flex items-center space-x-3">
                      <img
                        v-if="pet.photo_url"
                        :src="pet.photo_url"
                        :alt="pet.name"
                        class="h-12 w-12 rounded-full object-cover"
                      />
                      <div v-else class="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span class="text-gray-500 text-xl">🐾</span>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-900">{{ pet.name }}</h4>
                        <p class="text-sm text-gray-500">{{ pet.species }} • {{ pet.breed }}</p>
                        <p class="text-xs text-gray-400">{{ calculateAge(pet.birth_date) }}</p>
                      </div>
                    </div>
                    <!-- Check Icon -->
                    <div
                      v-if="selectedPetId === pet.id"
                      class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-vet-600"
                    >
                      <CheckIcon class="h-4 w-4 text-white" />
                    </div>
                  </div>
                </Field>
              </div>
              <ErrorMessage name="petId" class="text-red-500 text-sm mt-2" />
            </div>

            <!-- Step 2: Seleccionar Veterinario -->
            <div v-if="selectedPetId">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">2. Seleccionar Veterinario</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field name="veterinarianId" v-slot="{ field }">
                  <div
                    v-for="vet in veterinarians"
                    :key="vet.id"
                    @click="selectVeterinarian(vet.id)"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200',
                      selectedVeterinarianId === vet.id 
                        ? 'border-vet-500 bg-vet-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <input
                      v-bind="field"
                      type="radio"
                      :value="vet.id"
                      class="sr-only"
                    />
                    <div class="flex items-start space-x-3">
                      <div class="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon class="h-6 w-6 text-gray-600" />
                      </div>
                      <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-900">
                          Dr. {{ vet.user.first_name }} {{ vet.user.last_name }}
                        </h4>
                        <p class="text-sm text-gray-500">{{ vet.specialization }}</p>
                        <p class="text-sm text-gray-600 mt-1">{{ vet.bio }}</p>
                        <div v-if="vet.consultation_fee" class="mt-2">
                          <span class="text-sm font-medium text-vet-600">
                            ${{ vet.consultation_fee }} COP
                          </span>
                        </div>
                      </div>
                    </div>
                    <!-- Check Icon -->
                    <div
                      v-if="selectedVeterinarianId === vet.id"
                      class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-vet-600"
                    >
                      <CheckIcon class="h-4 w-4 text-white" />
                    </div>
                  </div>
                </Field>
              </div>
              <ErrorMessage name="veterinarianId" class="text-red-500 text-sm mt-2" />
            </div>

            <!-- Step 3: Seleccionar Fecha y Hora -->
            <div v-if="selectedVeterinarianId">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">3. Seleccionar Fecha y Hora</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Calendar -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <Field name="date" v-slot="{ field }">
                    <Calendar
                      v-bind="field"
                      v-model="selectedDate"
                      @date-select="onDateSelect"
                      :minDate="new Date()"
                      :maxDate="maxDate"
                      :disabledDates="disabledDates"
                      inline
                      class="w-full"
                    />
                  </Field>
                  <ErrorMessage name="date" class="text-red-500 text-sm mt-1" />
                </div>

                <!-- Time Slots -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Hora Disponible</label>
                  <div v-if="loadingSlots" class="flex justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-vet-600"></div>
                  </div>
                  <div v-else-if="selectedDate && availableSlots.length === 0" class="text-center py-8">
                    <p class="text-gray-500">No hay horarios disponibles para esta fecha</p>
                  </div>
                  <div v-else-if="selectedDate" class="grid grid-cols-2 gap-2">
                    <Field name="time" v-slot="{ field }">
                      <button
                        v-for="slot in availableSlots"
                        :key="slot.time"
                        type="button"
                        @click="selectTime(slot.time)"
                        :class="[
                          'p-3 text-sm rounded-md border transition-all duration-200',
                          selectedTime === slot.time
                            ? 'border-vet-500 bg-vet-50 text-vet-700'
                            : slot.available 
                              ? 'border-gray-200 bg-white hover:border-gray-300'
                              : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        ]"
                        :disabled="!slot.available"
                      >
                        {{ slot.time }}
                      </button>
                    </Field>
                  </div>
                  <p v-else class="text-gray-500 text-sm">Selecciona una fecha para ver horarios disponibles</p>
                  <ErrorMessage name="time" class="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            <!-- Step 4: Detalles de la Cita -->
            <div v-if="selectedTime">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">4. Detalles de la Cita</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Motivo -->
                <div>
                  <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">
                    Motivo de la consulta *
                  </label>
                  <Field
                    name="reason"
                    as="select"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    :class="{ 'border-red-500': errors.reason }"
                  >
                    <option value="">Seleccionar motivo</option>
                    <option value="Consulta General">Consulta General</option>
                    <option value="Vacunación">Vacunación</option>
                    <option value="Control">Control de Rutina</option>
                    <option value="Emergencia">Emergencia</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Examen">Exámenes</option>
                    <option value="Dermatología">Consulta Dermatológica</option>
                    <option value="Dental">Consulta Dental</option>
                    <option value="Otro">Otro</option>
                  </Field>
                  <ErrorMessage name="reason" class="text-red-500 text-sm mt-1" />
                </div>

                <!-- Duración -->
                <div>
                  <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
                    Duración estimada
                  </label>
                  <Field
                    name="duration"
                    as="select"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                  >
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                    <option value="90">1.5 horas</option>
                    <option value="120">2 horas</option>
                  </Field>
                </div>

                <!-- Notas -->
                <div class="md:col-span-2">
                  <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                    Notas adicionales (opcional)
                  </label>
                  <Field
                    name="notes"
                    as="textarea"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    placeholder="Describe síntomas, comportamientos o información relevante para el veterinario..."
                  />
                </div>
              </div>
            </div>

            <!-- Resumen de la Cita -->
            <div v-if="selectedTime" class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen de la Cita</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Mascota:</span>
                  <span class="font-medium">{{ selectedPet?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Veterinario:</span>
                  <span class="font-medium">Dr. {{ selectedVeterinarian?.user?.first_name }} {{ selectedVeterinarian?.user?.last_name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Fecha:</span>
                  <span class="font-medium">{{ formatDate(selectedDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Hora:</span>
                  <span class="font-medium">{{ selectedTime }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Motivo:</span>
                  <span class="font-medium">{{ values.reason || 'No especificado' }}</span>
                </div>
                <div v-if="selectedVeterinarian?.consultation_fee" class="flex justify-between border-t pt-3">
                  <span class="text-gray-600">Costo de consulta:</span>
                  <span class="font-semibold text-vet-600">${{ selectedVeterinarian.consultation_fee }} COP</span>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                @click="$router.go(-1)"
                class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !canSubmit"
                class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Agendando...
                </span>
                <span v-else>Agendar Cita</span>
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { format, addDays, differenceInYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'

// PrimeVue Components
import Calendar from 'primevue/calendar'

// Heroicons
import { 
  ArrowLeftIcon,
  CheckIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

// Services
import petService from '@/services/petService'
import veterinarianService from '@/services/veterinarianService'
import appointmentService from '@/services/appointmentService'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Reactive data
const initialLoading = ref(true)
const loadingSlots = ref(false)
const pets = ref([])
const veterinarians = ref([])
const availableSlots = ref([])
const selectedPetId = ref(null)
const selectedVeterinarianId = ref(null)
const selectedDate = ref(null)
const selectedTime = ref(null)
const disabledDates = ref([])

// Max date (3 months from now)
const maxDate = computed(() => addDays(new Date(), 90))

// Selected items
const selectedPet = computed(() => 
  pets.value.find(pet => pet.id === selectedPetId.value)
)

const selectedVeterinarian = computed(() => 
  veterinarians.value.find(vet => vet.id === selectedVeterinarianId.value)
)

// Can submit
const canSubmit = computed(() => 
  selectedPetId.value && selectedVeterinarianId.value && selectedDate.value && selectedTime.value
)

// Validation schema
const schema = yup.object({
  petId: yup.number().required('Debes seleccionar una mascota'),
  veterinarianId: yup.number().required('Debes seleccionar un veterinario'),
  date: yup.date().required('Debes seleccionar una fecha'),
  time: yup.string().required('Debes seleccionar una hora'),
  reason: yup.string().required('El motivo de la consulta es obligatorio'),
  duration: yup.number().default(30),
  notes: yup.string()
})

// Methods
const loadInitialData = async () => {
  try {
    initialLoading.value = true
    
    // Load pets
    const petsResponse = await petService.getMyPets()
    pets.value = petsResponse.data || petsResponse
    
    // Load veterinarians
    const vetsResponse = await veterinarianService.getAllVeterinarians()
    veterinarians.value = vetsResponse.data || vetsResponse
    
    // Pre-select pet if provided in query
    if (route.query.petId) {
      const petId = parseInt(route.query.petId)
      if (pets.value.find(pet => pet.id === petId)) {
        selectedPetId.value = petId
      }
    }
    
  } catch (error) {
    console.error('Error loading initial data:', error)
    toast.error('Error al cargar la información inicial')
  } finally {
    initialLoading.value = false
  }
}

const selectPet = (petId) => {
  selectedPetId.value = petId
}

const selectVeterinarian = (vetId) => {
  selectedVeterinarianId.value = vetId
  // Reset date and time selection
  selectedDate.value = null
  selectedTime.value = null
  availableSlots.value = []
}

const onDateSelect = async (date) => {
  if (!selectedVeterinarianId.value) return
  
  selectedDate.value = date
  selectedTime.value = null
  await loadAvailableSlots()
}

const loadAvailableSlots = async () => {
  if (!selectedVeterinarianId.value || !selectedDate.value) return
  
  try {
    loadingSlots.value = true
    const dateString = format(selectedDate.value, 'yyyy-MM-dd')
    const response = await appointmentService.getAvailableSlots(selectedVeterinarianId.value, dateString)
    
    availableSlots.value = response.data || response || []
    
  } catch (error) {
    console.error('Error loading available slots:', error)
    toast.error('Error al cargar horarios disponibles')
    availableSlots.value = []
  } finally {
    loadingSlots.value = false
  }
}

const selectTime = (time) => {
  const slot = availableSlots.value.find(s => s.time === time)
  if (slot && slot.available) {
    selectedTime.value = time
  }
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

const formatDate = (date) => {
  if (!date) return ''
  return format(date, 'EEEE, d MMMM yyyy', { locale: es })
}

const onSubmit = async (values) => {
  try {
    const appointmentDate = new Date(selectedDate.value)
    const [hours, minutes] = selectedTime.value.split(':')
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    
    const appointmentData = {
      petId: selectedPetId.value,
      veterinarianId: selectedVeterinarianId.value,
      dateTime: appointmentDate.toISOString(),
      reason: values.reason,
      durationMinutes: parseInt(values.duration || 30),
      notes: values.notes || null
    }
    
    await appointmentService.createAppointment(appointmentData)
    
    toast.success('Cita agendada exitosamente')
    router.push('/client/appointments')
    
  } catch (error) {
    console.error('Error creating appointment:', error)
    toast.error('Error al agendar la cita')
  }
}

// Lifecycle
onMounted(() => {
  loadInitialData()
})
</script> 