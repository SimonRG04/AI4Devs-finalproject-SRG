<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Prediagnóstico con IA</h3>
              <p class="text-sm text-gray-500">
                {{ selectedPet ? `Para ${selectedPet.name}` : 'Selecciona una mascota' }}
              </p>
            </div>
          </div>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 space-y-6">
        <!-- Selección de mascota -->
        <div v-if="!preselectedPet">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Mascota *
          </label>
          <select 
            v-model="form.petId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.petId }"
          >
            <option value="">Selecciona una mascota</option>
            <option 
              v-for="pet in availablePets" 
              :key="pet.id" 
              :value="pet.id"
            >
              {{ pet.name }} ({{ formatSpecies(pet.species) }})
            </option>
          </select>
          <p v-if="errors.petId" class="mt-1 text-sm text-red-600">{{ errors.petId }}</p>
        </div>

        <!-- Información de la mascota seleccionada -->
        <div v-if="selectedPet" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <span class="text-blue-800 font-semibold">{{ selectedPet.name.charAt(0) }}</span>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-blue-900">{{ selectedPet.name }}</h4>
              <div class="text-sm text-blue-700 space-y-1">
                <p>{{ formatSpecies(selectedPet.species) }} {{ selectedPet.breed ? `- ${selectedPet.breed}` : '' }}</p>
                <p>{{ selectedPet.gender === 'MALE' ? 'Macho' : 'Hembra' }}{{ selectedPet.age ? ` • ${selectedPet.age} años` : '' }}{{ selectedPet.weight ? ` • ${selectedPet.weight} kg` : '' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Síntomas -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Describe los síntomas observados *
          </label>
          <div class="mb-3">
            <p class="text-sm text-gray-600 mb-2">Sugerencias para {{ selectedPet ? formatSpecies(selectedPet.species).toLowerCase() : 'mascotas' }}:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="suggestion in currentSuggestions"
                :key="suggestion"
                type="button"
                @click="applySuggestion(suggestion)"
                class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
          <textarea 
            v-model="form.symptoms"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            :class="{ 'border-red-500': errors.symptoms }"
            placeholder="Describe detalladamente los síntomas que has observado en tu mascota..."
            maxlength="1500"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <p v-if="errors.symptoms" class="text-sm text-red-600">{{ errors.symptoms }}</p>
            <p class="text-xs text-gray-500">{{ form.symptoms.length }}/1500 caracteres</p>
          </div>
        </div>

        <!-- Duración de síntomas -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ¿Cuánto tiempo han persistido estos síntomas?
          </label>
          <input 
            v-model="form.duration"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.duration }"
            placeholder="Ej: 2 días, una semana, desde ayer..."
            maxlength="100"
          />
          <p v-if="errors.duration" class="mt-1 text-sm text-red-600">{{ errors.duration }}</p>
        </div>

        <!-- Severidad percibida -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ¿Cómo calificarías la severidad de los síntomas?
          </label>
          <div class="grid grid-cols-3 gap-3">
            <label 
              v-for="severity in severityOptions"
              :key="severity.value"
              class="relative cursor-pointer"
            >
              <input 
                v-model="form.severity"
                :value="severity.value"
                type="radio"
                class="sr-only"
              />
              <div class="border-2 rounded-lg p-3 text-center transition-colors"
                :class="form.severity === severity.value 
                  ? `border-${severity.color}-500 bg-${severity.color}-50 text-${severity.color}-700`
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <div :class="`text-${severity.color}-600 mb-1`">{{ severity.icon }}</div>
                <p class="font-medium text-sm">{{ severity.label }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Información adicional -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Información adicional (opcional)
          </label>
          <textarea 
            v-model="form.additionalInfo"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            :class="{ 'border-red-500': errors.additionalInfo }"
            placeholder="¿Ha comido algo inusual? ¿Cambios en el comportamiento? ¿Otros detalles relevantes?"
            maxlength="500"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <p v-if="errors.additionalInfo" class="text-sm text-red-600">{{ errors.additionalInfo }}</p>
            <p class="text-xs text-gray-500">{{ form.additionalInfo.length }}/500 caracteres</p>
          </div>
        </div>

        <!-- Disclaimer -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div class="text-sm text-yellow-800">
              <p class="font-medium mb-1">⚠️ Importante</p>
              <p>Este prediagnóstico es generado por inteligencia artificial y tiene fines informativos únicamente. No reemplaza la consulta veterinaria profesional. Siempre consulta con un veterinario para un diagnóstico definitivo.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
        <div class="flex items-center justify-between">
          <button 
            @click="closeModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button 
            @click="submitForm"
            :disabled="!canSubmit || loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ loading ? 'Generando...' : 'Generar Prediagnóstico' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { usePetsStore } from '@/stores/pets'
import { useDiagnosisStore } from '@/stores/diagnosis'
import diagnosisService from '@/services/diagnosisService'

const props = defineProps({
  appointmentId: {
    type: Number,
    default: null
  },
  preselectedPet: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'created'])

const petsStore = usePetsStore()
const diagnosisStore = useDiagnosisStore()

// Estado del formulario
const form = ref({
  petId: props.preselectedPet?.id || '',
  appointmentId: props.appointmentId,
  symptoms: '',
  duration: '',
  severity: '',
  additionalInfo: ''
})

const errors = ref({})
const loading = ref(false)

// Opciones de severidad
const severityOptions = [
  { value: 'mild', label: 'Leve', icon: '😌', color: 'green' },
  { value: 'moderate', label: 'Moderado', icon: '😐', color: 'yellow' },
  { value: 'severe', label: 'Severo', icon: '😰', color: 'red' }
]

// Computed properties
const availablePets = computed(() => petsStore.pets || [])

const selectedPet = computed(() => {
  if (props.preselectedPet) return props.preselectedPet
  return availablePets.value.find(pet => pet.id === form.value.petId)
})

const currentSuggestions = computed(() => {
  if (!selectedPet.value) return []
  return diagnosisService.generatePromptSuggestions(selectedPet.value.species)
})

const canSubmit = computed(() => {
  return form.value.petId && 
         form.value.symptoms.trim().length >= 10 && 
         !loading.value
})

// Methods
const formatSpecies = (species) => {
  const speciesMap = {
    'DOG': 'Perro',
    'CAT': 'Gato', 
    'BIRD': 'Ave',
    'RABBIT': 'Conejo',
    'HAMSTER': 'Hámster',
    'OTHER': 'Otro'
  }
  return speciesMap[species] || species
}

const applySuggestion = (suggestion) => {
  if (form.value.symptoms) {
    form.value.symptoms += '. ' + suggestion
  } else {
    form.value.symptoms = suggestion
  }
}

const validateForm = () => {
  const validation = diagnosisService.validateDiagnosisData(form.value)
  errors.value = validation.errors
  return validation.isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true
  
  try {
    const diagnosis = await diagnosisStore.createPreDiagnosis({
      ...form.value,
      petId: Number(form.value.petId)
    })
    
    emit('created', diagnosis)
    closeModal()
  } catch (error) {
    console.error('Error creating pre-diagnosis:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
}

// Watchers
watch(() => form.value, () => {
  // Limpiar errores cuando el usuario modifica el formulario
  if (Object.keys(errors.value).length > 0) {
    validateForm()
  }
}, { deep: true })

// Lifecycle
onMounted(async () => {
  // Cargar mascotas si no están cargadas
  if (!petsStore.pets.length) {
    try {
      await petsStore.fetchPets()
    } catch (error) {
      console.error('Error loading pets:', error)
    }
  }
})
</script> 