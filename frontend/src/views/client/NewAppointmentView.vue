<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center space-x-4 mb-8">
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

      <!-- Loading State -->
      <div v-if="initialLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Main Form -->
      <div v-else class="bg-white shadow-sm rounded-lg">
        <form @submit.prevent="onSubmit" class="p-6 space-y-8">
          <!-- Step 1: Seleccionar Mascota -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">1. Seleccionar Mascota</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="pet in pets"
                :key="pet.id"
                @click="selectPet(pet.id)"
                :class="[
                  'relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200',
                  values.petId === pet.id 
                    ? 'border-vet-500 bg-vet-50' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <div class="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-lg">{{ pet.species === 'DOG' ? '🐕' : pet.species === 'CAT' ? '🐱' : '🐾' }}</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">{{ pet.name }}</h4>
                    <p class="text-sm text-gray-500">{{ pet.species }} • {{ pet.breed }}</p>
                    <p class="text-xs text-gray-400">{{ calculateAge(pet.birth_date) }}</p>
                  </div>
                </div>
                <!-- Check Icon -->
                <div
                  v-if="values.petId === pet.id"
                  class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-vet-600"
                >
                  <CheckIcon class="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <p v-if="errors.petId" class="text-red-500 text-sm mt-2">{{ errors.petId }}</p>
          </div>

          <!-- Step 2: Seleccionar Veterinario -->
          <div v-if="values.petId">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">2. Seleccionar Veterinario</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="vet in veterinarians"
                :key="vet.id"
                @click="selectVeterinarian(vet.id)"
                :class="[
                  'relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200',
                  values.veterinarianId === vet.id 
                    ? 'border-vet-500 bg-vet-50' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-start space-x-3">
                  <div class="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon class="h-6 w-6 text-gray-600" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">
                      Dr. {{ vet.user?.firstName || vet.user?.first_name }} {{ vet.user?.lastName || vet.user?.last_name }}
                    </h4>
                    <p class="text-sm text-gray-500">{{ vet.specialty || vet.specialization }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ vet.bio }}</p>
                    <div v-if="vet.consultationFee || vet.consultation_fee" class="mt-2">
                      <span class="text-sm font-medium text-vet-600">
                        ${{ vet.consultationFee || vet.consultation_fee }} COP
                      </span>
                    </div>
                  </div>
                </div>
                <!-- Check Icon -->
                <div
                  v-if="values.veterinarianId === vet.id"
                  class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-vet-600"
                >
                  <CheckIcon class="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <p v-if="errors.veterinarianId" class="text-red-500 text-sm mt-2">{{ errors.veterinarianId }}</p>
          </div>

          <!-- Step 3: Seleccionar Fecha y Hora -->
          <div v-if="values.veterinarianId">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">3. Seleccionar Fecha y Hora</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Calendar -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <Calendar
                  v-model="values.date"
                  @date-select="onDateSelect"
                  :minDate="new Date()"
                  :maxDate="maxDate"
                  :disabledDates="disabledDates"
                  inline
                  class="w-full"
                />
                <p v-if="errors.date" class="text-red-500 text-sm mt-1">{{ errors.date }}</p>
              </div>

              <!-- Time Slots -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hora Disponible</label>
                <div v-if="loadingSlots" class="flex justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-vet-600"></div>
                </div>
                <div v-else-if="values.date && availableSlots.length === 0" class="text-center py-8">
                  <p class="text-gray-500">No hay horarios disponibles para esta fecha</p>
                </div>
                <div v-else-if="values.date" class="grid grid-cols-2 gap-2">
                  <button
                    v-for="slot in availableSlots"
                    :key="slot.time"
                    type="button"
                    @click="selectTime(slot.time)"
                    :class="[
                      'p-3 text-sm rounded-md border transition-all duration-200',
                      values.time === slot.time
                        ? 'border-vet-500 bg-vet-50 text-vet-700'
                        : slot.available 
                          ? 'border-gray-200 bg-white hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    ]"
                    :disabled="!slot.available"
                  >
                    {{ slot.time }}
                  </button>
                </div>
                <p v-else class="text-gray-500 text-sm">Selecciona una fecha para ver horarios disponibles</p>
                <p v-if="errors.time" class="text-red-500 text-sm mt-1">{{ errors.time }}</p>
              </div>
            </div>
          </div>

          <!-- Step 4: Detalles de la Cita -->
          <div v-if="values.time">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">4. Detalles de la Cita</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Motivo -->
              <div>
                <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de la consulta *
                </label>
                <select
                  id="reason"
                  v-model="values.reason"
                  @change="(e) => setFieldValue('reason', e.target.value)"
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
                </select>
                <p v-if="errors.reason" class="text-red-500 text-sm mt-1">{{ errors.reason }}</p>
              </div>

              <!-- Duración -->
              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
                  Duración estimada
                </label>
                <select
                  id="duration"
                  v-model="values.duration"
                  @change="(e) => setFieldValue('duration', parseInt(e.target.value))"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                >
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1.5 horas</option>
                  <option value="120">2 horas</option>
                </select>
              </div>

              <!-- Imágenes de referencia -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes de referencia (opcional)
                </label>
                <div class="space-y-3">
                  <div
                    v-for="(imageUrl, index) in imageUrls"
                    :key="index"
                    class="flex items-center space-x-2"
                  >
                    <input
                      :value="imageUrl"
                      @input="updateImageUrl(index, $event.target.value)"
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-vet-500 focus:outline-none focus:ring-1 focus:ring-vet-500"
                    />
                    <button
                      @click="removeImageUrl(index)"
                      type="button"
                      class="p-2 text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                  
                  <button
                    @click="addImageUrl"
                    type="button"
                    class="flex items-center space-x-2 text-vet-600 hover:text-vet-700"
                  >
                    <PlusIcon class="h-5 w-5" />
                    <span>Añadir imagen</span>
                  </button>
                  
                  <!-- Vista previa de imágenes -->
                  <ImageGallery
                    v-if="validImageUrls.length > 0"
                    :images="validImageUrls"
                    title="Vista previa"
                    :max-visible="3"
                    class="mt-3"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Puedes añadir imágenes relevantes para el diagnóstico (radiografías, fotos de síntomas, etc.)
                </p>
              </div>

              <!-- Notas -->
              <div class="md:col-span-2">
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  id="notes"
                  v-model="values.notes"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                  placeholder="Describe síntomas, comportamientos o información relevante para el veterinario..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Resumen de la Cita -->
          <div v-if="values.time" class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen de la Cita</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Mascota:</span>
                <span class="font-medium">{{ selectedPet?.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Veterinario:</span>
                <span class="font-medium">Dr. {{ selectedVeterinarian?.user?.firstName || selectedVeterinarian?.user?.first_name }} {{ selectedVeterinarian?.user?.lastName || selectedVeterinarian?.user?.last_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Fecha:</span>
                <span class="font-medium">{{ formatDate(values.date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Hora:</span>
                <span class="font-medium">{{ values.time }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Motivo:</span>
                <span class="font-medium">{{ values.reason || 'No especificado' }}</span>
              </div>
              <div v-if="selectedVeterinarian?.consultationFee || selectedVeterinarian?.consultation_fee" class="flex justify-between border-t pt-3">
                <span class="text-gray-600">Costo de consulta:</span>
                <span class="font-semibold text-vet-600">${{ selectedVeterinarian?.consultationFee || selectedVeterinarian?.consultation_fee }} COP</span>
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
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { format, addDays, differenceInYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'

// PrimeVue Components
import Calendar from 'primevue/calendar'

// Heroicons
import { 
  ArrowLeftIcon,
  CheckIcon,
  UserIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

// Services
import petService from '@/services/petService'
import veterinarianService from '@/services/veterinarianService'
import appointmentService from '@/services/appointmentService'

// Components
import ImageGallery from '../../components/common/ImageGallery.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Validation schema
const schema = yup.object({
  petId: yup.number().required('Debes seleccionar una mascota'),
  veterinarianId: yup.number().required('Debes seleccionar un veterinario'),
  date: yup.date().required('Debes seleccionar una fecha'),
  time: yup.string().required('Debes seleccionar una hora'),
  reason: yup.string().min(1, 'El motivo de la consulta es obligatorio').required('El motivo de la consulta es obligatorio'),
  duration: yup.number().positive().default(30),
  notes: yup.string().nullable()
})

// Use form with validation
const { values, errors, setFieldValue, handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    petId: null,
    veterinarianId: null,
    date: null,
    time: null,
    reason: '',
    duration: 30,
    notes: ''
  }
})

// Reactive data
const initialLoading = ref(true)
const loadingSlots = ref(false)
const isSubmitting = ref(false)
const pets = ref([])
const veterinarians = ref([])
const availableSlots = ref([])
const disabledDates = ref([])

// Image handling
const imageUrls = ref([''])

// Max date (3 months from now)
const maxDate = computed(() => addDays(new Date(), 90))

// Selected items
const selectedPet = computed(() => 
  pets.value.find(pet => pet.id === values.petId)
)

const selectedVeterinarian = computed(() => 
  veterinarians.value.find(vet => vet.id === values.veterinarianId)
)

// Valid image URLs (filter out empty strings and invalid URLs)
const validImageUrls = computed(() => {
  return imageUrls.value.filter(url => {
    if (!url || url.trim() === '') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  })
})

// Can submit
const canSubmit = computed(() => 
  values.petId && values.veterinarianId && values.date && values.time && meta.value.valid
)

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
        setFieldValue('petId', petId)
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
  setFieldValue('petId', petId)
}

const selectVeterinarian = (vetId) => {
  console.log('Selecting veterinarian:', vetId, typeof vetId)
  // Asegurar que se guarde el ID como número
  const veterinarianId = typeof vetId === 'object' ? vetId.id : vetId
  setFieldValue('veterinarianId', veterinarianId)
  // Reset date and time selection
  setFieldValue('date', null)
  setFieldValue('time', null)
  availableSlots.value = []
}

const onDateSelect = async (date) => {
  if (!values.veterinarianId) return
  
  setFieldValue('date', date)
  setFieldValue('time', null)
  await loadAvailableSlots()
}

const loadAvailableSlots = async () => {
  if (!values.veterinarianId || !values.date) return
  
  try {
    loadingSlots.value = true
    const dateString = format(values.date, 'yyyy-MM-dd')
    
    // Asegurar que se pase el ID como número, no como objeto
    const veterinarianId = typeof values.veterinarianId === 'object' ? values.veterinarianId.id : values.veterinarianId
    console.log('Loading slots for vet ID:', veterinarianId, 'date:', dateString)
    
    // Usar getVeterinarianAvailability en lugar de getAvailableSlots
    const response = await appointmentService.getVeterinarianAvailability(veterinarianId, dateString, values.duration || 30)
    
    // La respuesta del backend tiene esta estructura: { veterinarianId, name, specialty, date, slots, totalAvailableSlots }
    // Necesitamos extraer solo los slots
    const responseData = response.data || response
    console.log('Availability response:', responseData)
    
    if (responseData && responseData.slots) {
      // Mapear los slots para que tengan la estructura esperada por el frontend
      availableSlots.value = responseData.slots.map(slot => ({
        time: slot.startTime,
        available: slot.available,
        dateTime: slot.dateTime,
        reason: slot.reason
      }))
    } else {
      availableSlots.value = []
    }
    
    console.log('Available slots loaded:', availableSlots.value)
    
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
    setFieldValue('time', time)
  }
}

// Image handling methods
const addImageUrl = () => {
  imageUrls.value.push('')
}

const removeImageUrl = (index) => {
  if (imageUrls.value.length > 1) {
    imageUrls.value.splice(index, 1)
  } else {
    imageUrls.value[0] = ''
  }
}

const updateImageUrl = (index, value) => {
  imageUrls.value[index] = value
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

const onSubmit = handleSubmit(async (formValues) => {
  try {
    isSubmitting.value = true
    
    // Validaciones adicionales
    if (!formValues.reason) {
      toast.error('Debes especificar el motivo de la consulta')
      return
    }
    
    console.log('Form values:', formValues)
    
    // Crear la fecha y hora de la cita
    const appointmentDate = new Date(formValues.date)
    const [hours, minutes] = formValues.time.split(':')
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    
    // Mapear los campos correctamente según el DTO del backend
    const appointmentData = {
      petId: formValues.petId,
      veterinarianId: formValues.veterinarianId,
      scheduledAt: appointmentDate.toISOString(),
      type: 'CONSULTATION', // Tipo por defecto basado en el motivo
      duration: parseInt(formValues.duration || 30),
      priority: 'NORMAL', // Prioridad por defecto
      status: 'SCHEDULED', // Estado por defecto
      notes: formValues.reason ? `Motivo: ${formValues.reason}${formValues.notes ? '\n\nNotas adicionales: ' + formValues.notes : ''}` : formValues.notes || null,
      images: validImageUrls.value.length > 0 ? validImageUrls.value : undefined
    }
    
    console.log('Sending appointment data:', appointmentData)
    
    await appointmentService.createAppointment(appointmentData)
    
    toast.success('Cita agendada exitosamente')
    router.push('/client/appointments')
    
  } catch (error) {
    console.error('Error creating appointment:', error)
    
    // Mostrar el error específico si está disponible
    const errorMessage = error.response?.data?.message || error.message || 'Error al agendar la cita'
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
})

// Lifecycle
onMounted(() => {
  loadInitialData()
})

// Debug watchers
watch(() => values.reason, (newValue) => {
  console.log('Reason changed:', newValue)
}, { immediate: true })

watch(() => values, (newValues) => {
  console.log('Form values changed:', newValues)
}, { deep: true })
</script> 