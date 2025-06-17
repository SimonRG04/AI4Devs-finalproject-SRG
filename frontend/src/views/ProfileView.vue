<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-vet-200 border-t-vet-600 mb-4"></div>
          <p class="text-gray-600">Cargando datos del perfil...</p>
        </div>
      </div>

      <!-- Profile Form -->
      <div v-else class="bg-white shadow-xl rounded-2xl overflow-hidden">
        <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
          <!-- User Info Header -->
          <div class="bg-gradient-to-r from-vet-500 to-vet-600 px-6 py-8 text-white">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-2xl font-bold">{{ userInitials }}</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold">{{ displayName }}</h2>
                <p class="text-vet-100">{{ authStore.user?.email }}</p>
                <span class="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium mt-2">
                  {{ roleDisplay }}
                </span>
              </div>
            </div>
          </div>

          <div class="px-8 py-8">
            <!-- Información Personal -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg class="w-5 h-5 text-vet-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-2 2v5"></path>
                </svg>
                Información Personal
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nombre -->
                <div class="space-y-2">
                  <label for="firstName" class="block text-sm font-medium text-gray-700">
                    Nombre *
                  </label>
                  <Field
                    name="firstName"
                    type="text"
                    v-model="formData.firstName"
                    class="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vet-500 focus:border-vet-500 transition-colors"
                    :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.firstName }"
                  />
                  <ErrorMessage name="firstName" class="text-red-500 text-sm" />
                </div>

                <!-- Apellido -->
                <div class="space-y-2">
                  <label for="lastName" class="block text-sm font-medium text-gray-700">
                    Apellido *
                  </label>
                  <Field
                    name="lastName"
                    type="text"
                    v-model="formData.lastName"
                    class="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vet-500 focus:border-vet-500 transition-colors"
                    :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.lastName }"
                  />
                  <ErrorMessage name="lastName" class="text-red-500 text-sm" />
                </div>

                <!-- Email -->
                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Correo electrónico *
                  </label>
                  <Field
                    name="email"
                    type="email"
                    v-model="formData.email"
                    class="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vet-500 focus:border-vet-500 transition-colors"
                    :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
                  />
                  <ErrorMessage name="email" class="text-red-500 text-sm" />
                </div>

                <!-- Teléfono -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <Field
                    name="phoneNumber"
                    v-slot="{ field, meta }"
                  >
                    <CountryPhoneInput
                      :model-value="formData.phoneNumber"
                      @update:model-value="updatePhoneNumber"
                      placeholder="Número de teléfono"
                      :has-error="!!errors.phoneNumber"
                    />
                  </Field>
                  <ErrorMessage name="phoneNumber" class="text-red-500 text-sm" />
                </div>
              </div>
            </div>

            <!-- Cambiar Contraseña -->
            <div class="border-t border-gray-200 pt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg class="w-5 h-5 text-vet-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Cambiar Contraseña
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700">
                    Contraseña actual
                  </label>
                  <Field
                    name="currentPassword"
                    type="password"
                    class="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vet-500 focus:border-vet-500 transition-colors"
                    :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.currentPassword }"
                  />
                  <ErrorMessage name="currentPassword" class="text-red-500 text-sm" />
                </div>

                <div class="space-y-2">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700">
                    Nueva contraseña
                  </label>
                  <Field
                    name="newPassword"
                    type="password"
                    class="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vet-500 focus:border-vet-500 transition-colors"
                    :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.newPassword }"
                  />
                  <ErrorMessage name="newPassword" class="text-red-500 text-sm" />
                </div>
              </div>

              <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex">
                  <svg class="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="text-sm text-blue-700">
                    <p class="font-medium">Para cambiar tu contraseña:</p>
                    <ul class="mt-1 list-disc list-inside space-y-1">
                      <li>Ingresa tu contraseña actual</li>
                      <li>La nueva contraseña debe tener al menos 6 caracteres</li>
                      <li>La nueva contraseña debe ser diferente a la actual</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between gap-4">
              <button
                type="button"
                @click="reloadProfile"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500 disabled:opacity-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span v-if="loading">Recargando...</span>
                <span v-else>Recargar Datos</span>
              </button>
              
              <div class="flex space-x-3">
                <button
                  type="button"
                  @click="resetFormData"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-vet-600 hover:bg-vet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="isSubmitting">Actualizando...</span>
                  <span v-else>Guardar Cambios</span>
                </button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { Form, Field, ErrorMessage, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import CountryPhoneInput from '@/components/common/CountryPhoneInput.vue'

const toast = useToast()
const authStore = useAuthStore()
const loading = ref(false)

// Form data reactive
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  currentPassword: '',
  newPassword: ''
})

// Computed properties para mostrar datos del usuario
const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const firstName = formData.value.firstName || authStore.user.firstName || ''
  const lastName = formData.value.lastName || authStore.user.lastName || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
})

const displayName = computed(() => {
  if (!authStore.user) return 'Usuario'
  const firstName = formData.value.firstName || authStore.user.firstName || ''
  const lastName = formData.value.lastName || authStore.user.lastName || ''
  return `${firstName} ${lastName}`.trim() || authStore.user.fullName || 'Usuario'
})

const roleDisplay = computed(() => {
  const role = authStore.user?.role
  switch (role) {
    case 'CLIENT': return 'Cliente'
    case 'VET': return 'Veterinario'
    case 'ADMIN': return 'Administrador'
    default: return 'Usuario'
  }
})

// Form handling
const { setValues, resetForm, setFieldValue } = useForm()

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
    .nullable()
    .test('phone-format', 'Debe ser un número telefónico válido', function(value) {
      if (!value) return true // Campo opcional
      return /^\+\d{1,4}\d{4,14}$/.test(value)
    }),
  
  currentPassword: yup
    .string()
    .optional()
    .test('current-password-required', 'La contraseña actual es obligatoria si quieres cambiarla', function(value) {
      const { newPassword } = this.parent
      if (newPassword && newPassword.length > 0) {
        return value && value.length > 0
      }
      return true
    }),
  
  newPassword: yup
    .string()
    .optional()
    .test('password-required', 'La nueva contraseña es obligatoria si ingresas la actual', function(value) {
      const { currentPassword } = this.parent
      if (currentPassword && currentPassword.length > 0) {
        return value && value.length >= 6
      }
      return true
    })
    .test('password-different', 'La nueva contraseña debe ser diferente a la actual', function(value) {
      const { currentPassword } = this.parent
      if (currentPassword && value) {
        return value !== currentPassword
      }
      return true
    })
})

// Load user data
const loadUserData = async () => {
  try {
    console.log('🔄 Cargando datos del perfil...')
    
    // Primero intentar obtener datos frescos del servidor
    await authStore.fetchProfile()
    console.log('✅ Datos obtenidos del servidor')
  } catch (error) {
    console.warn('⚠️ No se pudieron obtener datos frescos del servidor, usando datos locales:', error)
  }
  
  const user = authStore.user
  if (user) {
    console.log('📋 Datos del usuario:', user)
    
    // Actualizar formData reactivo
    formData.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      currentPassword: '',
      newPassword: ''
    }

    // También actualizar vee-validate
    setValues({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      currentPassword: '',
      newPassword: ''
    })

    console.log('✅ Formulario poblado con datos:', formData.value)
  } else {
    console.warn('❌ No hay datos de usuario disponibles')
  }
}

// Update phone number handler
const updatePhoneNumber = (value) => {
  formData.value.phoneNumber = value
  setFieldValue('phoneNumber', value)
}

// Submit handler
const onSubmit = async (values) => {
  try {
    loading.value = true
    
    const updateData = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      phoneNumber: formData.value.phoneNumber || undefined
    }

    // Add password data if provided
    if (formData.value.currentPassword && formData.value.newPassword) {
      updateData.currentPassword = formData.value.currentPassword
      updateData.newPassword = formData.value.newPassword
    }

    console.log('📤 Enviando datos de actualización:', updateData)

    // Call the API to update profile
    const updatedUser = await authStore.updateProfile(updateData)
    
    toast.success('Perfil actualizado exitosamente')
    
    // Clear password fields
    formData.value.currentPassword = ''
    formData.value.newPassword = ''
    
    setValues({
      ...formData.value,
      currentPassword: '',
      newPassword: ''
    })
    
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar el perfil'
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}

// Método para recargar el perfil manualmente
const reloadProfile = async () => {
  loading.value = true
  try {
    await loadUserData()
    toast.success('Datos recargados correctamente')
  } catch (error) {
    console.error('Error reloading profile:', error)
    toast.error('Error al recargar los datos del perfil')
  } finally {
    loading.value = false
  }
}

// Reset form data
const resetFormData = async () => {
  await loadUserData()
  toast.info('Formulario restablecido')
}

// Watch para sincronizar cambios del auth store
watch(() => authStore.user, (newUser) => {
  if (newUser && !loading.value) {
    console.log('👁️ Usuario actualizado en store, sincronizando formulario')
    loadUserData()
  }
}, { deep: true })

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    // Si no hay datos del usuario cargados, cargar desde el storage
    if (!authStore.user) {
      await authStore.loadUserFromStorage()
    }
    
    // Cargar datos del perfil (esto obtendrá datos frescos del servidor)
    await loadUserData()
  } catch (error) {
    console.error('Error loading profile:', error)
    toast.error('Error al cargar los datos del perfil')
  } finally {
    loading.value = false
  }
})
</script>
