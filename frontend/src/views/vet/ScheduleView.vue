<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Horarios</h1>
        <p class="mt-2 text-gray-600">Configura tu disponibilidad y horarios de trabajo</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Schedule Configuration -->
      <div v-else class="space-y-8">
        <!-- Weekly Schedule -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Horario Semanal</h3>
          </div>
          <div class="p-6">
            <div class="space-y-6">
              <div
                v-for="day in weekDays"
                :key="day.key"
                class="flex items-center space-x-4"
              >
                <!-- Day Name -->
                <div class="w-24">
                  <label class="text-sm font-medium text-gray-700">
                    {{ day.name }}
                  </label>
                </div>

                <!-- Available Toggle -->
                <div class="flex items-center">
                  <input
                    :id="`available-${day.key}`"
                    v-model="schedule[day.key].available"
                    type="checkbox"
                    class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300 rounded"
                  />
                  <label :for="`available-${day.key}`" class="ml-2 text-sm text-gray-700">
                    Disponible
                  </label>
                </div>

                <!-- Time Slots -->
                <div v-if="schedule[day.key].available" class="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Hora inicio</label>
                    <input
                      v-model="schedule[day.key].startTime"
                      type="time"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Hora fin</label>
                    <input
                      v-model="schedule[day.key].endTime"
                      type="time"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <button
                @click="saveSchedule"
                :disabled="saving"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="saving" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </span>
                <span v-else>Guardar Horario</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Break Times -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Descansos</h3>
              <button
                @click="addBreak"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Agregar Descanso
              </button>
            </div>
          </div>
          <div class="p-6">
            <div v-if="breaks.length === 0" class="text-center py-8">
              <ClockIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No hay descansos configurados</h3>
              <p class="mt-1 text-sm text-gray-500">Agrega descansos para bloquear tiempo en tu horario.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="(breakTime, index) in breaks"
                :key="index"
                class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Día</label>
                    <select
                      v-model="breakTime.day"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    >
                      <option v-for="day in weekDays" :key="day.key" :value="day.key">
                        {{ day.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Hora inicio</label>
                    <input
                      v-model="breakTime.startTime"
                      type="time"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Hora fin</label>
                    <input
                      v-model="breakTime.endTime"
                      type="time"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    />
                  </div>
                </div>
                <button
                  @click="removeBreak(index)"
                  class="p-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Vacation/Time Off -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Vacaciones y Ausencias</h3>
              <button
                @click="addVacation"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Agregar Ausencia
              </button>
            </div>
          </div>
          <div class="p-6">
            <div v-if="vacations.length === 0" class="text-center py-8">
              <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No hay ausencias programadas</h3>
              <p class="mt-1 text-sm text-gray-500">Programa vacaciones o días libres.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="(vacation, index) in vacations"
                :key="index"
                class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Fecha inicio</label>
                    <input
                      v-model="vacation.startDate"
                      type="date"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Fecha fin</label>
                    <input
                      v-model="vacation.endDate"
                      type="date"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Motivo</label>
                    <input
                      v-model="vacation.reason"
                      type="text"
                      placeholder="Vacaciones, enfermedad, etc."
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    />
                  </div>
                </div>
                <button
                  @click="removeVacation(index)"
                  class="p-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule Preview -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Vista Previa del Horario</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
              <div
                v-for="day in weekDays"
                :key="day.key"
                class="text-center"
              >
                <h4 class="text-sm font-medium text-gray-900 mb-2">{{ day.name }}</h4>
                <div v-if="schedule[day.key].available" class="space-y-1">
                  <div class="text-xs text-gray-600 bg-green-100 rounded px-2 py-1">
                    {{ schedule[day.key].startTime }} - {{ schedule[day.key].endTime }}
                  </div>
                  <div
                    v-for="breakTime in getBreaksForDay(day.key)"
                    :key="`break-${breakTime.startTime}`"
                    class="text-xs text-gray-600 bg-yellow-100 rounded px-2 py-1"
                  >
                    Descanso: {{ breakTime.startTime }} - {{ breakTime.endTime }}
                  </div>
                </div>
                <div v-else class="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">
                  No disponible
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

// Heroicons
import { 
  PlusIcon,
  TrashIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

// Services
import scheduleService from '@/services/scheduleService'

const toast = useToast()

// Reactive data
const loading = ref(true)
const saving = ref(false)

// Week days configuration
const weekDays = [
  { key: 'monday', name: 'Lunes' },
  { key: 'tuesday', name: 'Martes' },
  { key: 'wednesday', name: 'Miércoles' },
  { key: 'thursday', name: 'Jueves' },
  { key: 'friday', name: 'Viernes' },
  { key: 'saturday', name: 'Sábado' },
  { key: 'sunday', name: 'Domingo' }
]

// Schedule data
const schedule = ref({
  monday: { available: true, startTime: '09:00', endTime: '17:00' },
  tuesday: { available: true, startTime: '09:00', endTime: '17:00' },
  wednesday: { available: true, startTime: '09:00', endTime: '17:00' },
  thursday: { available: true, startTime: '09:00', endTime: '17:00' },
  friday: { available: true, startTime: '09:00', endTime: '17:00' },
  saturday: { available: false, startTime: '09:00', endTime: '13:00' },
  sunday: { available: false, startTime: '09:00', endTime: '13:00' }
})

const breaks = ref([])
const vacations = ref([])

// Methods
const loadSchedule = async () => {
  try {
    // Load existing schedule from API
    const response = await scheduleService.getVetSchedule()
    if (response.data) {
      // Update schedule with API data
      Object.assign(schedule.value, response.data.weeklySchedule || {})
      breaks.value = response.data.breaks || []
      vacations.value = response.data.vacations || []
    }
  } catch (error) {
    console.error('Error loading schedule:', error)
    // Use default schedule if API fails
  } finally {
    loading.value = false
  }
}

const saveSchedule = async () => {
  saving.value = true
  try {
    const scheduleData = {
      weeklySchedule: schedule.value,
      breaks: breaks.value,
      vacations: vacations.value
    }
    
    await scheduleService.updateVetSchedule(scheduleData)
    toast.success('Horario guardado exitosamente')
  } catch (error) {
    console.error('Error saving schedule:', error)
    toast.error('Error al guardar el horario')
  } finally {
    saving.value = false
  }
}

const addBreak = () => {
  breaks.value.push({
    day: 'monday',
    startTime: '12:00',
    endTime: '13:00'
  })
}

const removeBreak = (index) => {
  breaks.value.splice(index, 1)
}

const addVacation = () => {
  const today = new Date().toISOString().split('T')[0]
  vacations.value.push({
    startDate: today,
    endDate: today,
    reason: ''
  })
}

const removeVacation = (index) => {
  vacations.value.splice(index, 1)
}

const getBreaksForDay = (day) => {
  return breaks.value.filter(breakTime => breakTime.day === day)
}

// Lifecycle
onMounted(() => {
  loadSchedule()
})
</script>
