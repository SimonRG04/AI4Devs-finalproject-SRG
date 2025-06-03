<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="mt-2 text-gray-600">Gestiona tu información personal</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Profile Form -->
      <div v-else class="bg-white shadow rounded-lg">
        <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
          <div class="px-6 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombre -->
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">
                  Nombre *
                </label>
                <Field
                  name="firstName"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                  :class="{ 'border-red-500': errors.firstName }"
                />
                <ErrorMessage name="firstName" class="text-red-500 text-sm mt-1" />
              </div>

              <!-- Apellido -->
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">
                  Apellido *
                </label>
                <Field
                  name="lastName"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                  :class="{ 'border-red-500': errors.lastName }"
                />
                <ErrorMessage name="lastName" class="text-red-500 text-sm mt-1" />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Correo electrónico *
                </label>
                <Field
                  name="email"
                  type="email"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                  :class="{ 'border-red-500': errors.email }"
                />
                <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
              </div>

              <!-- Teléfono -->
              <div>
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <Field
                  name="phoneNumber"
                  type="tel"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                  :class="{ 'border-red-500': errors.phoneNumber }"
                />
                <ErrorMessage name="phoneNumber" class="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <!-- Cambiar Contraseña -->
            <div class="mt-8 pt-8 border-t border-gray-200">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Cambiar Contraseña</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700">
                    Contraseña actual
                  </label>
                  <Field
                    name="currentPassword"
                    type="password"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    :class="{ 'border-red-500': errors.currentPassword }"
                  />
                  <ErrorMessage name="currentPassword" class="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700">
                    Nueva contraseña
                  </label>
                  <Field
                    name="newPassword"
                    type="password"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vet-500 focus:border-vet-500"
                    :class="{ 'border-red-500': errors.newPassword }"
                  />
                  <ErrorMessage name="newPassword" class="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Actualizando...
                </span>
                <span v-else>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { Form, Field, ErrorMessage, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

const toast = useToast()
const authStore = useAuthStore()
const loading = ref(false)

// Form handling
const { setValues, resetForm } = useForm()

// Validation schema
const schema = yup.object({
  firstName: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  
  lastName: yup
    .string()
    .required('El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  
  email: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Debe ser un correo electrónico válido'),
  
  phoneNumber: yup
    .string()
    .matches(/^\+?[\d\s\-()]*$/, 'Formato de teléfono inválido'),
  
  currentPassword: yup
    .string()
    .when('newPassword', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required('Debes ingresar tu contraseña actual')
    }),
  
  newPassword: yup
    .string()
    .when('currentPassword', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema
        .required('Debes ingresar una nueva contraseña')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
    })
})

// Load user data
const loadUserData = () => {
  const user = authStore.user
  if (user) {
    setValues({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      phoneNumber: user.phone_number || ''
    })
  }
}

// Submit handler
const onSubmit = async (values) => {
  try {
    const updateData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber
    }

    // Add password data if provided
    if (values.currentPassword && values.newPassword) {
      updateData.currentPassword = values.currentPassword
      updateData.newPassword = values.newPassword
    }

    // Here you would call the API to update profile
    // await authStore.updateProfile(updateData)
    
    toast.success('Perfil actualizado exitosamente')
    
    // Clear password fields
    setValues({
      ...values,
      currentPassword: '',
      newPassword: ''
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    toast.error('Error al actualizar el perfil')
  }
}

// Lifecycle
onMounted(() => {
  loadUserData()
})
</script>
