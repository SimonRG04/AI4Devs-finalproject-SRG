<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <PencilIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
              {{ appointment.notes ? 'Editar Notas' : 'Añadir Notas' }}
            </h3>
            
            <!-- Appointment Info -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Información de la cita</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p><strong>Paciente:</strong> {{ appointment.pet?.name }}</p>
                <p><strong>Fecha:</strong> {{ formatDate(appointment.dateTime) }} - {{ formatTime(appointment.dateTime) }}</p>
                <p><strong>Motivo:</strong> {{ appointment.reason }}</p>
              </div>
            </div>
            
            <form @submit.prevent="submitForm" class="space-y-4">
              <!-- Notes Section -->
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                  Notas de la cita
                </label>
                <div class="border border-gray-300 rounded-md">
                  <!-- Quick Actions Toolbar -->
                  <div class="border-b border-gray-200 bg-gray-50 px-3 py-2 flex items-center space-x-2">
                    <button
                      type="button"
                      @click="insertTemplate('symptoms')"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Síntomas
                    </button>
                    <button
                      type="button"
                      @click="insertTemplate('examination')"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Examen
                    </button>
                    <button
                      type="button"
                      @click="insertTemplate('recommendations')"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Recomendaciones
                    </button>
                    <button
                      type="button"
                      @click="insertTemplate('followup')"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Seguimiento
                    </button>
                  </div>
                  
                  <!-- Text Area -->
                  <textarea
                    ref="notesTextarea"
                    id="notes"
                    v-model="form.notes"
                    rows="8"
                    class="block w-full border-0 resize-none focus:ring-0 p-3"
                    placeholder="Escribe las notas de la cita aquí...

Puedes incluir:
• Observaciones durante la consulta
• Comportamiento del paciente
• Instrucciones especiales para el propietario
• Recomendaciones de seguimiento
• Cualquier información relevante"
                  ></textarea>
                </div>
                
                <!-- Character count -->
                <div class="mt-1 flex justify-between items-center">
                  <p class="text-xs text-gray-500">
                    Usa las plantillas de arriba para añadir secciones comunes rápidamente
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ form.notes.length }} caracteres
                  </p>
                </div>
              </div>

              <!-- Note Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de nota
                </label>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input
                      id="noteType_general"
                      v-model="form.noteType"
                      type="radio"
                      value="GENERAL"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label for="noteType_general" class="ml-2 block text-sm text-gray-900">
                      Nota general
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="noteType_clinical"
                      v-model="form.noteType"
                      type="radio"
                      value="CLINICAL"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label for="noteType_clinical" class="ml-2 block text-sm text-gray-900">
                      Nota clínica
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="noteType_behavioral"
                      v-model="form.noteType"
                      type="radio"
                      value="BEHAVIORAL"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label for="noteType_behavioral" class="ml-2 block text-sm text-gray-900">
                      Nota de comportamiento
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="noteType_admin"
                      v-model="form.noteType"
                      type="radio"
                      value="ADMINISTRATIVE"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label for="noteType_admin" class="ml-2 block text-sm text-gray-900">
                      Nota administrativa
                    </label>
                  </div>
                </div>
              </div>

              <!-- Priority -->
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700">
                  Prioridad de la nota
                </label>
                <select
                  id="priority"
                  v-model="form.priority"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              <!-- Visibility -->
              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    id="visibleToClient"
                    v-model="form.visibleToClient"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="visibleToClient" class="ml-2 block text-sm text-gray-900">
                    Visible para el cliente
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="includeInReport"
                    v-model="form.includeInReport"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="includeInReport" class="ml-2 block text-sm text-gray-900">
                    Incluir en reportes médicos
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancelar
                </button>
                <button
                  v-if="appointment.notes"
                  type="button"
                  @click="clearNotes"
                  class="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Eliminar Notas
                </button>
                <button
                  type="submit"
                  :disabled="loading || !form.notes.trim()"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <span v-if="loading" class="mr-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ appointment.notes ? 'Actualizar Notas' : 'Guardar Notas' }}
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
import { ref, reactive, nextTick } from 'vue'
import { useAppointmentsStore } from '../../stores/appointments'
import { useToast } from 'vue-toastification'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const appointmentsStore = useAppointmentsStore()
const toast = useToast()

const loading = ref(false)
const notesTextarea = ref(null)

const form = reactive({
  notes: props.appointment.notes || '',
  noteType: 'GENERAL',
  priority: 'MEDIUM',
  visibleToClient: false,
  includeInReport: true
})

// Templates for quick insertion
const templates = {
  symptoms: '\n\n## Síntomas Observados\n• \n• \n• \n',
  examination: '\n\n## Examen Físico\n**Estado general:** \n**Temperatura:** \n**Peso:** \n**Otros hallazgos:** \n',
  recommendations: '\n\n## Recomendaciones\n• \n• \n• \n',
  followup: '\n\n## Seguimiento\n**Próxima visita:** \n**Observaciones en casa:** \n**Contactar si:** \n'
}

// Methods
const formatDate = (dateTime) => {
  return format(parseISO(dateTime), 'dd/MM/yyyy', { locale: es })
}

const formatTime = (dateTime) => {
  return format(parseISO(dateTime), 'HH:mm', { locale: es })
}

const insertTemplate = async (templateType) => {
  const template = templates[templateType]
  if (!template) return
  
  const textarea = notesTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  // Insert template at cursor position
  const before = form.notes.substring(0, start)
  const after = form.notes.substring(end)
  form.notes = before + template + after
  
  // Set cursor position after template
  await nextTick()
  const newPosition = start + template.length
  textarea.focus()
  textarea.setSelectionRange(newPosition, newPosition)
}

const submitForm = async () => {
  try {
    loading.value = true
    
    const updateData = {
      notes: form.notes.trim(),
      noteType: form.noteType,
      notePriority: form.priority,
      noteVisibleToClient: form.visibleToClient,
      includeInReport: form.includeInReport
    }
    
    const updatedAppointment = await appointmentsStore.updateAppointment(props.appointment.id, updateData)
    
    emit('updated', updatedAppointment)
    toast.success(props.appointment.notes ? 'Notas actualizadas correctamente' : 'Notas añadidas correctamente')
    
  } catch (error) {
    console.error('Error updating appointment notes:', error)
    toast.error(error.message || 'Error al guardar las notas')
  } finally {
    loading.value = false
  }
}

const clearNotes = async () => {
  if (!confirm('¿Estás seguro de que quieres eliminar todas las notas de esta cita?')) {
    return
  }
  
  try {
    loading.value = true
    
    const updateData = {
      notes: null,
      noteType: null,
      notePriority: null,
      noteVisibleToClient: false,
      includeInReport: false
    }
    
    const updatedAppointment = await appointmentsStore.updateAppointment(props.appointment.id, updateData)
    
    emit('updated', updatedAppointment)
    toast.success('Notas eliminadas correctamente')
    
  } catch (error) {
    console.error('Error clearing appointment notes:', error)
    toast.error(error.message || 'Error al eliminar las notas')
  } finally {
    loading.value = false
  }
}
</script> 