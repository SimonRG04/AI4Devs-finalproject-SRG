<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-auto flex items-center justify-center">
          <h1 class="text-2xl font-bold text-blue-600">VetAI Connect</h1>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear cuenta nueva
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          O
          <router-link to="/login" class="font-medium text-vet-600 hover:text-vet-500">
            inicia sesión en tu cuenta existente
          </router-link>
        </p>
      </div>

      <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
        <div class="space-y-6">
          <!-- Nombre y Apellido -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="firstName" class="sr-only">Nombre</label>
              <Field
                name="firstName"
                type="text"
                placeholder="Nombre"
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vet-500 focus:border-vet-500 focus:z-10 sm:text-sm"
                :class="{ 'border-red-500': errors.firstName }"
              />
              <ErrorMessage name="firstName" class="text-red-500 text-sm mt-1" />
            </div>
            
            <div>
              <label for="lastName" class="sr-only">Apellido</label>
              <Field
                name="lastName"
                type="text"
                placeholder="Apellido"
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vet-500 focus:border-vet-500 focus:z-10 sm:text-sm"
                :class="{ 'border-red-500': errors.lastName }"
              />
              <ErrorMessage name="lastName" class="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="sr-only">Correo electrónico</label>
            <Field
              name="email"
              type="email"
              placeholder="Correo electrónico"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vet-500 focus:border-vet-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.email }"
            />
            <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Teléfono -->
          <div>
            <label for="phoneNumber" class="sr-only">Teléfono</label>
            <Field
              name="phoneNumber"
              type="tel"
              placeholder="Teléfono (opcional)"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vet-500 focus:border-vet-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.phoneNumber }"
            />
            <ErrorMessage name="phoneNumber" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Dirección -->
          <div>
            <label for="address" class="sr-only">Dirección</label>
            <Field
              name="address"
              type="text"
              placeholder="Dirección (opcional)"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vet-500 focus:border-vet-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.address }"
            />
            <ErrorMessage name="address" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Contraseña y Confirmación -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="password" class="sr-only">Contraseña</label>
              <Field
                name="password"
                type="password"
                placeholder="Contraseña"
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vet-500 focus:border-vet-500 focus:z-10 sm:text-sm"
                :class="{ 'border-red-500': errors.password }"
              />
              <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
            </div>
            
            <div>
              <label for="confirmPassword" class="sr-only">Confirmar contraseña</label>
              <Field
                name="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vet-500 focus:border-vet-500 focus:z-10 sm:text-sm"
                :class="{ 'border-red-500': errors.confirmPassword }"
              />
              <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <!-- Términos y Condiciones -->
          <div class="flex items-center">
            <Field
              name="acceptTerms"
              type="checkbox"
              class="h-4 w-4 text-vet-600 focus:ring-vet-500 border-gray-300 rounded"
              :class="{ 'border-red-500': errors.acceptTerms }"
            />
            <label class="ml-2 block text-sm text-gray-900">
              Acepto los 
              <a href="/terms" class="text-vet-600 hover:text-vet-500">términos y condiciones</a>
              y la 
              <a href="/privacy" class="text-vet-600 hover:text-vet-500">política de privacidad</a>
            </label>
          </div>
          <ErrorMessage name="acceptTerms" class="text-red-500 text-sm" />

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vet-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando cuenta...
              </span>
              <span v-else>Crear cuenta</span>
            </button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

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
  
  address: yup
    .string(),
  
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
  confirmPassword: yup
    .string()
    .required('Debes confirmar tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  
  acceptTerms: yup
    .boolean()
    .required('Debes aceptar los términos y condiciones')
    .oneOf([true], 'Debes aceptar los términos y condiciones')
})

// Submit handler
const onSubmit = async (values) => {
  try {
    await authStore.register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
      password: values.password
    })
    
    toast.success('Cuenta creada exitosamente')
    
    // Redirigir según el rol del usuario (los usuarios registrados son CLIENT por defecto)
    if (authStore.isAdmin) {
      router.push('/admin')
    } else if (authStore.isVet) {
      router.push('/vet')
    } else if (authStore.isClient) {
      router.push('/dashboard')
    } else {
      // Fallback por si el rol no está definido
      router.push('/dashboard')
    }
    
  } catch (error) {
    console.error('Registration error:', error)
    toast.error(error.message || 'Error al crear la cuenta')
  }
}
</script>
