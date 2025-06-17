<template>
  <div class="relative">
    <div class="flex">
      <!-- Selector de País -->
      <div class="relative">
        <button
          type="button"
          @click="toggleDropdown"
          class="flex items-center px-3 py-2 border border-gray-300 border-r-0 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-vet-500 focus:border-vet-500"
          :class="{ 'border-red-500': hasError }"
        >
          <span class="text-lg mr-2">{{ selectedCountry.flag }}</span>
          <span class="text-sm font-medium text-gray-600">{{ selectedCountry.dialCode }}</span>
          <svg class="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- Dropdown de países -->
        <div
          v-if="isDropdownOpen"
          class="absolute z-50 mt-1 w-72 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <!-- Buscador -->
          <div class="p-2 border-b border-gray-200">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar país..."
              class="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-vet-500"
            />
          </div>
          
          <!-- Lista de países -->
          <ul class="py-1">
            <li
              v-for="country in filteredCountries"
              :key="country.code"
              @click="selectCountry(country)"
              class="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              <span class="text-lg mr-3">{{ country.flag }}</span>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900">{{ country.name }}</div>
                <div class="text-xs text-gray-500">{{ country.dialCode }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Input del número -->
      <input
        :value="phoneNumber"
        @input="updatePhoneNumber"
        type="tel"
        :placeholder="placeholder"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-vet-500 focus:border-vet-500"
        :class="{ 'border-red-500': hasError }"
      />
    </div>

    <!-- Overlay para cerrar dropdown -->
    <div
      v-if="isDropdownOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Número de teléfono'
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// Estados
const isDropdownOpen = ref(false)
const searchTerm = ref('')
const phoneNumber = ref('')

// Lista de países (ordenados por relevancia para veterinarias)
const countries = ref([
  // Países principales de Latinoamérica
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  
  // Centroamérica y Caribe
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
  { code: 'PA', name: 'Panamá', dialCode: '+507', flag: '🇵🇦' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
  { code: 'DO', name: 'República Dominicana', dialCode: '+1', flag: '🇩🇴' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1', flag: '🇵🇷' },
  
  // Norteamérica
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', dialCode: '+1', flag: '🇨🇦' },
  
  // Europa
  { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸' },
  { code: 'FR', name: 'Francia', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Alemania', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'NL', name: 'Países Bajos', dialCode: '+31', flag: '🇳🇱' },
  { code: 'CH', name: 'Suiza', dialCode: '+41', flag: '🇨🇭' },
  
  // Otros países importantes
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nueva Zelanda', dialCode: '+64', flag: '🇳🇿' },
  { code: 'JP', name: 'Japón', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Corea del Sur', dialCode: '+82', flag: '🇰🇷' }
])

// País seleccionado por defecto (Colombia)
const selectedCountry = ref(countries.value[0])

// Países filtrados por búsqueda
const filteredCountries = computed(() => {
  if (!searchTerm.value) return countries.value
  
  return countries.value.filter(country =>
    country.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    country.dialCode.includes(searchTerm.value)
  )
})

// Métodos
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    searchTerm.value = ''
  }
}

const closeDropdown = () => {
  isDropdownOpen.value = false
  searchTerm.value = ''
}

const selectCountry = (country) => {
  selectedCountry.value = country
  closeDropdown()
  updateFullNumber()
}

const updatePhoneNumber = (event) => {
  // Solo permitir números, espacios, guiones y paréntesis
  const value = event.target.value.replace(/[^\d\s\-()]/g, '')
  phoneNumber.value = value
  updateFullNumber()
}

const updateFullNumber = () => {
  if (phoneNumber.value.trim()) {
    // Limpiar el número de espacios y caracteres especiales
    const cleanNumber = phoneNumber.value.replace(/\D/g, '')
    if (cleanNumber) {
      const fullNumber = `${selectedCountry.value.dialCode}${cleanNumber}`
      emit('update:modelValue', fullNumber)
    } else {
      emit('update:modelValue', '')
    }
  } else {
    emit('update:modelValue', '')
  }
}

// Parsear número inicial si existe
const parseInitialValue = () => {
  if (props.modelValue) {
    // Buscar país por código de área
    const foundCountry = countries.value.find(country => 
      props.modelValue.startsWith(country.dialCode)
    )
    
    if (foundCountry) {
      selectedCountry.value = foundCountry
      phoneNumber.value = props.modelValue.substring(foundCountry.dialCode.length)
    } else {
      phoneNumber.value = props.modelValue
    }
  }
}

// Cerrar dropdown con ESC
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isDropdownOpen.value) {
    closeDropdown()
  }
}

onMounted(() => {
  parseInitialValue()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script> 