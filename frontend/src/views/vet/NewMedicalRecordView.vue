<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.go(-1)"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon class="h-4 w-4 mr-2" />
              Volver
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Nuevo Registro Médico</h1>
              <p class="mt-1 text-sm text-gray-500" v-if="pet">
                Para {{ pet.name }} ({{ pet.species }})
              </p>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <button
              @click="saveDraft"
              :disabled="draftLoading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span v-if="draftLoading" class="mr-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              Guardar Borrador
            </button>
            <button
              @click="submitForm"
              :disabled="loading || !isFormValid"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              Guardar Registro
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="initialLoading" class="flex justify-center items-center py-12">
      <div class="loading-spinner"></div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Patient Information Card -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Información del Paciente
            </h3>
            
            <div v-if="pet" class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="flex items-center space-x-3">
                <img 
                  v-if="pet.photoUrl" 
                  :src="pet.photoUrl" 
                  :alt="pet.name"
                  class="h-12 w-12 rounded-full object-cover"
                >
                <div v-else class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <HeartIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ pet.name }}</p>
                  <p class="text-sm text-gray-500">{{ pet.species }} - {{ pet.breed }}</p>
                </div>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-500">Edad</p>
                <p class="mt-1 text-sm text-gray-900">{{ calculateAge(pet.birthDate) }}</p>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-500">Peso</p>
                <p class="mt-1 text-sm text-gray-900">{{ pet.weight }}kg</p>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-500">Propietario</p>
                <p class="mt-1 text-sm text-gray-900">{{ pet.owner?.fullName }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Información Básica del Registro
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">
                  Título del registro <span class="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ej: Consulta general, Cirugía, Vacunación..."
                />
              </div>

              <div>
                <label for="visitType" class="block text-sm font-medium text-gray-700">
                  Tipo de consulta
                </label>
                <select
                  id="visitType"
                  v-model="form.visitType"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="CONSULTATION">Consulta General</option>
                  <option value="EMERGENCY">Emergencia</option>
                  <option value="SURGERY">Cirugía</option>
                  <option value="VACCINATION">Vacunación</option>
                  <option value="CHECKUP">Chequeo</option>
                  <option value="FOLLOW_UP">Seguimiento</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Vital Signs -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Signos Vitales
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label for="temperature" class="block text-sm font-medium text-gray-700">
                  Temperatura (°C)
                </label>
                <input
                  id="temperature"
                  v-model.number="form.temperature"
                  type="number"
                  step="0.1"
                  min="35"
                  max="45"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="38.5"
                />
              </div>

              <div>
                <label for="weight" class="block text-sm font-medium text-gray-700">
                  Peso (kg)
                </label>
                <input
                  id="weight"
                  v-model.number="form.weight"
                  type="number"
                  step="0.1"
                  min="0"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="5.2"
                />
              </div>

              <div>
                <label for="heartRate" class="block text-sm font-medium text-gray-700">
                  Frecuencia Cardíaca (bpm)
                </label>
                <input
                  id="heartRate"
                  v-model.number="form.heartRate"
                  type="number"
                  min="0"
                  max="300"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="120"
                />
              </div>

              <div>
                <label for="respiratoryRate" class="block text-sm font-medium text-gray-700">
                  Frecuencia Respiratoria
                </label>
                <input
                  id="respiratoryRate"
                  v-model.number="form.respiratoryRate"
                  type="number"
                  min="0"
                  max="100"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="24"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Clinical Examination -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Examen Clínico
            </h3>
            
            <div class="space-y-6">
              <div>
                <label for="symptoms" class="block text-sm font-medium text-gray-700">
                  Síntomas presentados <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="symptoms"
                  v-model="form.symptoms"
                  rows="4"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe los síntomas observados durante la consulta..."
                ></textarea>
              </div>

              <div>
                <label for="physicalExam" class="block text-sm font-medium text-gray-700">
                  Examen físico
                </label>
                <textarea
                  id="physicalExam"
                  v-model="form.physicalExam"
                  rows="4"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Hallazgos del examen físico..."
                ></textarea>
              </div>

              <div>
                <label for="diagnosis" class="block text-sm font-medium text-gray-700">
                  Diagnóstico <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="diagnosis"
                  v-model="form.diagnosis"
                  rows="3"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Diagnóstico médico basado en los síntomas y exámenes..."
                ></textarea>
              </div>

              <div>
                <label for="treatment" class="block text-sm font-medium text-gray-700">
                  Plan de tratamiento <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="treatment"
                  v-model="form.treatment"
                  rows="4"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Plan de tratamiento recomendado..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Prescriptions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Prescripciones
              </h3>
              <button
                type="button"
                @click="addPrescription"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Añadir Medicamento
              </button>
            </div>

            <div v-if="form.prescriptions.length === 0" class="text-center py-8 text-gray-500">
              <BeakerIcon class="mx-auto h-12 w-12 text-gray-400" />
              <p class="mt-2">No hay medicamentos prescritos</p>
              <p class="text-sm">Haz clic en "Añadir Medicamento" para agregar prescripciones</p>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="(prescription, index) in form.prescriptions"
                :key="index"
                class="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Medicamento <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="prescription.medicationName"
                      type="text"
                      required
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Nombre del medicamento"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Dosis <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="prescription.dosage"
                      type="text"
                      required
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="250mg, 1 tableta..."
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Frecuencia <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="prescription.frequency"
                      type="text"
                      required
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Cada 8 horas, 2 veces al día..."
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Duración
                    </label>
                    <input
                      v-model="prescription.duration"
                      type="text"
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="7 días, 2 semanas..."
                    />
                  </div>
                  
                  <div class="flex items-end">
                    <button
                      type="button"
                      @click="removePrescription(index)"
                      class="w-full px-3 py-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon class="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Instrucciones especiales
                  </label>
                  <textarea
                    v-model="prescription.instructions"
                    rows="2"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Tomar con alimentos, aplicar en área afectada..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Notes -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Información Adicional
            </h3>
            
            <div class="space-y-6">
              <div>
                <label for="prognosis" class="block text-sm font-medium text-gray-700">
                  Pronóstico
                </label>
                <select
                  id="prognosis"
                  v-model="form.prognosis"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Seleccionar pronóstico</option>
                  <option value="EXCELLENT">Excelente</option>
                  <option value="GOOD">Bueno</option>
                  <option value="FAIR">Regular</option>
                  <option value="POOR">Malo</option>
                  <option value="GUARDED">Reservado</option>
                </select>
              </div>

              <div>
                <label for="followUpDate" class="block text-sm font-medium text-gray-700">
                  Fecha de seguimiento recomendada
                </label>
                <input
                  id="followUpDate"
                  v-model="form.followUpDate"
                  type="date"
                  :min="minFollowUpDate"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700">
                  Observaciones y notas
                </label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="4"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Observaciones adicionales, instrucciones para el propietario, recomendaciones..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Actions -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$router.go(-1)"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="saveDraft"
            :disabled="draftLoading"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span v-if="draftLoading" class="mr-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Guardar Borrador
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Guardar Registro
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePetsStore } from '../../stores/pets'
import { useMedicalRecordsStore } from '../../stores/medicalRecords'
import { useToast } from 'vue-toastification'
import { format, addDays, parseISO, differenceInYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'

// Icons
import {
  ArrowLeftIcon,
  HeartIcon,
  PlusIcon,
  TrashIcon,
  BeakerIcon
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
const initialLoading = ref(true)
const loading = ref(false)
const draftLoading = ref(false)

const form = reactive({
  title: '',
  visitType: 'CONSULTATION',
  symptoms: '',
  physicalExam: '',
  diagnosis: '',
  treatment: '',
  temperature: null,
  weight: null,
  heartRate: null,
  respiratoryRate: null,
  prognosis: '',
  followUpDate: '',
  notes: '',
  prescriptions: []
})

// Computed properties
const isFormValid = computed(() => {
  return form.title && form.symptoms && form.diagnosis && form.treatment
})

const minFollowUpDate = computed(() => {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd')
})

// Methods
const loadPetData = async () => {
  try {
    initialLoading.value = true
    const petData = await petsStore.fetchPetById(petId.value)
    pet.value = petData
    
    // Set initial weight if available
    if (petData.weight) {
      form.weight = petData.weight
    }
  } catch (error) {
    console.error('Error loading pet data:', error)
    toast.error('Error al cargar información del paciente')
    router.push('/vet/patients')
  } finally {
    initialLoading.value = false
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

const addPrescription = () => {
  form.prescriptions.push({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  })
}

const removePrescription = (index) => {
  form.prescriptions.splice(index, 1)
}

const saveDraft = async () => {
  try {
    draftLoading.value = true
    
    const draftData = {
      ...form,
      petId: petId.value,
      isDraft: true,
      prescriptions: form.prescriptions.filter(p => 
        p.medicationName || p.dosage || p.frequency
      )
    }
    
    // Save to localStorage for now, could be expanded to save to server
    localStorage.setItem(`medical-record-draft-${petId.value}`, JSON.stringify(draftData))
    toast.success('Borrador guardado correctamente')
    
  } catch (error) {
    console.error('Error saving draft:', error)
    toast.error('Error al guardar borrador')
  } finally {
    draftLoading.value = false
  }
}

const loadDraft = () => {
  try {
    const draft = localStorage.getItem(`medical-record-draft-${petId.value}`)
    if (draft) {
      const draftData = JSON.parse(draft)
      Object.assign(form, draftData)
      toast.info('Borrador cargado')
    }
  } catch (error) {
    console.error('Error loading draft:', error)
  }
}

const submitForm = async () => {
  try {
    loading.value = true
    
    const medicalRecordData = {
      petId: petId.value,
      title: form.title,
      visitType: form.visitType,
      symptoms: form.symptoms,
      physicalExam: form.physicalExam || null,
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      temperature: form.temperature,
      weight: form.weight,
      heartRate: form.heartRate,
      respiratoryRate: form.respiratoryRate,
      prognosis: form.prognosis || null,
      followUpDate: form.followUpDate || null,
      notes: form.notes || null,
      prescriptions: form.prescriptions.filter(p => 
        p.medicationName && p.dosage && p.frequency
      )
    }
    
    const newRecord = await medicalRecordsStore.createMedicalRecord(medicalRecordData)
    
    // Clear draft
    localStorage.removeItem(`medical-record-draft-${petId.value}`)
    
    toast.success('Registro médico creado exitosamente')
    router.push(`/vet/patients/${petId.value}`)
    
  } catch (error) {
    console.error('Error creating medical record:', error)
    toast.error(error.message || 'Error al crear el registro médico')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPetData()
  loadDraft()
})
</script> 