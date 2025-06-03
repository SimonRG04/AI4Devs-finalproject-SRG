<template>
  <div class="pet-form">
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Información Básica -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
          
          <!-- Nombre -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <Field
              name="name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Nombre de la mascota"
            />
            <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Especie -->
          <div>
            <label for="species" class="block text-sm font-medium text-gray-700 mb-1">
              Especie *
            </label>
            <Field name="species" v-slot="{ field }">
              <select
                v-bind="field"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                :class="{ 'border-red-500': errors.species }"
              >
                <option value="">Seleccionar especie</option>
                <option value="DOG">Perro</option>
                <option value="CAT">Gato</option>
                <option value="BIRD">Ave</option>
                <option value="RABBIT">Conejo</option>
                <option value="HAMSTER">Hámster</option>
                <option value="FISH">Pez</option>
                <option value="REPTILE">Reptil</option>
                <option value="OTHER">Otro</option>
              </select>
            </Field>
            <ErrorMessage name="species" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Raza -->
          <div>
            <label for="breed" class="block text-sm font-medium text-gray-700 mb-1">
              Raza *
            </label>
            <Field
              name="breed"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              :class="{ 'border-red-500': errors.breed }"
              placeholder="Raza de la mascota"
            />
            <ErrorMessage name="breed" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Sexo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Sexo *
            </label>
            <Field name="gender" v-slot="{ field }">
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-bind="field"
                    type="radio"
                    value="MALE"
                    class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Macho</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-bind="field"
                    type="radio"
                    value="FEMALE"
                    class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Hembra</span>
                </label>
              </div>
            </Field>
            <ErrorMessage name="gender" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Fecha de Nacimiento -->
          <div>
            <label for="birth_date" class="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento *
            </label>
            <Field
              name="birth_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              :class="{ 'border-red-500': errors.birth_date }"
            />
            <ErrorMessage name="birth_date" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Peso -->
          <div>
            <label for="weight" class="block text-sm font-medium text-gray-700 mb-1">
              Peso (kg) *
            </label>
            <Field
              name="weight"
              type="number"
              step="0.1"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              :class="{ 'border-red-500': errors.weight }"
              placeholder="0.0"
            />
            <ErrorMessage name="weight" class="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <!-- Información Adicional -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>

          <!-- Color -->
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <Field
              name="color"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              placeholder="Color del pelaje/plumaje"
            />
          </div>

          <!-- Microchip -->
          <div>
            <label for="microchip_id" class="block text-sm font-medium text-gray-700 mb-1">
              ID Microchip
            </label>
            <Field
              name="microchip_id"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              placeholder="Número de microchip"
            />
          </div>

          <!-- Esterilizado -->
          <div>
            <label class="flex items-center">
              <Field
                name="is_neutered"
                type="checkbox"
                class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Esterilizado/Castrado</span>
            </label>
          </div>

          <!-- Condiciones Médicas -->
          <div>
            <label for="medical_conditions" class="block text-sm font-medium text-gray-700 mb-1">
              Condiciones Médicas
            </label>
            <Field
              name="medical_conditions"
              as="textarea"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              placeholder="Condiciones médicas conocidas"
            />
          </div>

          <!-- Alergias -->
          <div>
            <label for="allergies" class="block text-sm font-medium text-gray-700 mb-1">
              Alergias
            </label>
            <Field
              name="allergies"
              as="textarea"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              placeholder="Alergias conocidas"
            />
          </div>

          <!-- Alertas Médicas -->
          <div>
            <label for="medical_alerts" class="block text-sm font-medium text-gray-700 mb-1">
              Alertas Médicas
            </label>
            <Field
              name="medical_alerts"
              as="textarea"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              placeholder="Alertas importantes para el veterinario"
            />
          </div>

          <!-- URL de Foto -->
          <div>
            <label for="photo_url" class="block text-sm font-medium text-gray-700 mb-1">
              URL de Foto
            </label>
            <Field
              name="photo_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              placeholder="https://ejemplo.com/foto.jpg"
            />
            <ErrorMessage name="photo_url" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Notas -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
              Notas Adicionales
            </label>
            <Field
              name="notes"
              as="textarea"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vet-500 focus:border-vet-500"
              placeholder="Información adicional sobre la mascota"
            />
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Guardando...
          </span>
          <span v-else>
            {{ pet ? 'Actualizar' : 'Crear' }} Mascota
          </span>
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

// Props
const props = defineProps({
  pet: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['save', 'cancel'])

// Validation Schema
const schema = yup.object({
  name: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  
  species: yup
    .string()
    .required('La especie es obligatoria')
    .oneOf(['DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'FISH', 'REPTILE', 'OTHER'], 'Especie no válida'),
  
  breed: yup
    .string()
    .required('La raza es obligatoria')
    .min(2, 'La raza debe tener al menos 2 caracteres')
    .max(50, 'La raza no puede exceder 50 caracteres'),
  
  gender: yup
    .string()
    .required('El sexo es obligatorio')
    .oneOf(['MALE', 'FEMALE'], 'Sexo no válido'),
  
  birth_date: yup
    .date()
    .required('La fecha de nacimiento es obligatoria')
    .max(new Date(), 'La fecha de nacimiento no puede ser futura'),
  
  weight: yup
    .number()
    .required('El peso es obligatorio')
    .positive('El peso debe ser un número positivo')
    .max(200, 'El peso no puede exceder 200 kg'),
  
  color: yup
    .string()
    .max(30, 'El color no puede exceder 30 caracteres'),
  
  microchip_id: yup
    .string()
    .max(20, 'El ID del microchip no puede exceder 20 caracteres'),
  
  is_neutered: yup.boolean(),
  
  medical_conditions: yup
    .string()
    .max(500, 'Las condiciones médicas no pueden exceder 500 caracteres'),
  
  allergies: yup
    .string()
    .max(300, 'Las alergias no pueden exceder 300 caracteres'),
  
  medical_alerts: yup
    .string()
    .max(300, 'Las alertas médicas no pueden exceder 300 caracteres'),
  
  photo_url: yup
    .string()
    .url('Debe ser una URL válida'),
  
  notes: yup
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
})

// Form submission
const onSubmit = (values) => {
  // Convertir valores para el backend
  const formData = {
    ...values,
    weight: parseFloat(values.weight),
    is_neutered: Boolean(values.is_neutered),
    is_active: true // Por defecto activo
  }
  
  emit('save', formData)
}

// Initialize form with pet data if editing
const initializeForm = () => {
  if (props.pet) {
    // El formulario se inicializará automáticamente con los valores del prop
    return {
      name: props.pet.name || '',
      species: props.pet.species || '',
      breed: props.pet.breed || '',
      gender: props.pet.gender || '',
      birth_date: props.pet.birth_date ? props.pet.birth_date.split('T')[0] : '',
      weight: props.pet.weight || '',
      color: props.pet.color || '',
      microchip_id: props.pet.microchip_id || '',
      is_neutered: props.pet.is_neutered || false,
      medical_conditions: props.pet.medical_conditions || '',
      allergies: props.pet.allergies || '',
      medical_alerts: props.pet.medical_alerts || '',
      photo_url: props.pet.photo_url || '',
      notes: props.pet.notes || ''
    }
  }
  return {}
}
</script>

<style scoped>
.pet-form {
  @apply max-w-4xl mx-auto;
}

/* Custom styles for form elements */
input:focus,
select:focus,
textarea:focus {
  @apply ring-2 ring-vet-500 border-vet-500;
}

/* Radio button custom styling */
input[type="radio"]:checked {
  @apply bg-vet-600 border-vet-600;
}

/* Checkbox custom styling */
input[type="checkbox"]:checked {
  @apply bg-vet-600 border-vet-600;
}
</style> 