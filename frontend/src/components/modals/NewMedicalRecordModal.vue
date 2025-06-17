<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="$emit('close')"
          >
            <span class="sr-only">Cerrar</span>
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6" id="modal-title">
              {{ props.editingRecord ? 'Editar Registro Médico' : 'Nuevo Registro Médico' }}
            </h3>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">
                  Título del registro
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

              <!-- Symptoms -->
              <div>
                <label for="symptoms" class="block text-sm font-medium text-gray-700">
                  Síntomas presentados
                </label>
                <textarea
                  id="symptoms"
                  v-model="form.symptoms"
                  rows="3"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe los síntomas observados durante la consulta..."
                ></textarea>
              </div>

              <!-- Diagnosis -->
              <div>
                <label for="diagnosis" class="block text-sm font-medium text-gray-700">
                  Diagnóstico
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

              <!-- Treatment -->
              <div>
                <label for="treatment" class="block text-sm font-medium text-gray-700">
                  Tratamiento
                </label>
                <textarea
                  id="treatment"
                  v-model="form.treatment"
                  rows="3"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Plan de tratamiento recomendado..."
                ></textarea>
              </div>

              <!-- Temperature -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <!-- Weight -->
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
              </div>

              <!-- Prescriptions Section -->
              <div class="border-t pt-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-medium text-gray-900">Prescripciones</h4>
                  <button
                    type="button"
                    @click="addPrescription"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon class="h-4 w-4 mr-2" />
                    Añadir Medicamento
                  </button>
                </div>

                <div v-if="form.prescriptions.length === 0" class="text-center py-6 text-gray-500">
                  No hay medicamentos prescritos
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="(prescription, index) in form.prescriptions"
                    :key="index"
                    class="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Medicamento
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
                          Dosis
                        </label>
                        <input
                          v-model="prescription.dosage"
                          type="text"
                          required
                          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="250mg"
                        />
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Frecuencia
                        </label>
                        <select
                          v-model="prescription.frequency"
                          required
                          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                        >
                          <option value="">Seleccionar frecuencia</option>
                          <option value="ONCE_DAILY">Una vez al día</option>
                          <option value="TWICE_DAILY">Dos veces al día</option>
                          <option value="THREE_TIMES_DAILY">Tres veces al día</option>
                          <option value="FOUR_TIMES_DAILY">Cuatro veces al día</option>
                          <option value="EVERY_6_HOURS">Cada 6 horas</option>
                          <option value="EVERY_8_HOURS">Cada 8 horas</option>
                          <option value="EVERY_12_HOURS">Cada 12 horas</option>
                          <option value="AS_NEEDED">Según necesidad</option>
                          <option value="WEEKLY">Semanal</option>
                          <option value="MONTHLY">Mensual</option>
                        </select>
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
                    
                    <div class="mt-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Instrucciones
                      </label>
                      <textarea
                        v-model="prescription.instructions"
                        rows="2"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder="Instrucciones específicas para la administración..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700">
                  Notas adicionales
                </label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="3"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Observaciones adicionales, instrucciones para el propietario, etc..."
                ></textarea>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <span v-if="loading" class="mr-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ props.editingRecord ? 'Actualizar Registro' : 'Guardar Registro' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useMedicalRecordsStore } from '../../stores/medicalRecords'
import { useToast } from 'vue-toastification'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  petId: {
    type: [String, Number],
    required: true
  },
  editingRecord: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'created'])

const medicalRecordsStore = useMedicalRecordsStore()
const toast = useToast()

const loading = ref(false)

const form = reactive({
  title: '',
  symptoms: '',
  diagnosis: '',
  treatment: '',
  temperature: null,
  weight: null,
  notes: '',
  prescriptions: []
})

// Inicializar formulario si está editando
const initializeForm = () => {
  if (props.editingRecord) {
    form.title = props.editingRecord.title || ''
    form.symptoms = props.editingRecord.symptoms || ''
    form.diagnosis = props.editingRecord.diagnosis || ''
    form.treatment = props.editingRecord.treatment || ''
    form.temperature = props.editingRecord.temperature || null
    form.weight = props.editingRecord.weight || null
    form.notes = props.editingRecord.notes || ''
    
    // Convertir prescripciones al formato del formulario
    form.prescriptions = (props.editingRecord.prescriptions || []).map(p => ({
      medicationName: p.medication || p.medicationName || '',
      dosage: p.dosage || '',
      frequency: p.frequency || '',
      instructions: p.instructions || '',
      duration: p.duration || 7
    }))
  }
}

// Llamar al inicializar
onMounted(() => {
  initializeForm()
})

const addPrescription = () => {
  form.prescriptions.push({
    medicationName: '',
    dosage: '',
    frequency: '',
    instructions: ''
  })
}

const removePrescription = (index) => {
  form.prescriptions.splice(index, 1)
}

const submitForm = async () => {
  try {
    loading.value = true
    
    const medicalRecordData = {
      petId: Number(props.petId),
      title: form.title,
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      symptoms: form.symptoms || null,
      temperature: form.temperature || null,
      weight: form.weight || null,
      notes: form.notes || null,
      prescriptions: form.prescriptions
        .filter(p => p.medicationName && p.dosage && p.frequency)
        .map(p => ({
          medication: p.medicationName,  // Backend espera 'medication' no 'medicationName'
          dosage: p.dosage,
          frequency: p.frequency,
          instructions: p.instructions || null,
          startDate: new Date().toISOString().split('T')[0],
          durationDays: parseInt(p.duration) || 7,
          status: 'ACTIVE',
          quantity: 1,
          unit: 'comprimidos'
        }))
    }
    
    let result
    
    if (props.editingRecord) {
      // Actualizar registro existente
      result = await medicalRecordsStore.updateMedicalRecord(props.editingRecord.id, medicalRecordData)
      toast.success('Registro médico actualizado exitosamente')
    } else {
      // Crear nuevo registro
      result = await medicalRecordsStore.createMedicalRecord(medicalRecordData)
      toast.success('Registro médico creado exitosamente')
    }
    
    emit('created', result)
    
  } catch (error) {
    console.error('Error creating medical record:', error)
    toast.error(error.message || 'Error al crear el registro médico')
  } finally {
    loading.value = false
  }
}
</script> 