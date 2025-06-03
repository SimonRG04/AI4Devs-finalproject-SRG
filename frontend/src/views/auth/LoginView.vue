<template>
  <div class="min-h-screen flex">
    <!-- Panel izquierdo con información -->
    <div class="hidden lg:block relative w-0 flex-1">
      <img
        class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
        alt="Veterinario con mascota"
      />
      <div class="absolute inset-0 bg-primary-600 bg-opacity-75"></div>
      <div class="absolute inset-0 flex items-center justify-center p-12">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-white mb-4">
            Bienvenido a VetAI Connect
          </h2>
          <p class="text-xl text-primary-100 mb-8">
            La plataforma digital que conecta dueños de mascotas con veterinarios especializados
          </p>
          <div class="grid grid-cols-1 gap-4 text-left max-w-md">
            <div class="flex items-center text-white">
              <CheckCircleIcon class="h-6 w-6 text-vet-400 mr-3" />
              <span>Gestión inteligente de citas</span>
            </div>
            <div class="flex items-center text-white">
              <CheckCircleIcon class="h-6 w-6 text-vet-400 mr-3" />
              <span>Historiales médicos digitales</span>
            </div>
            <div class="flex items-center text-white">
              <CheckCircleIcon class="h-6 w-6 text-vet-400 mr-3" />
              <span>Pre-diagnóstico con IA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Panel derecho con formulario -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <div class="flex items-center">
            <HeartIcon class="h-10 w-10 text-primary-600" />
            <h2 class="ml-3 text-3xl font-bold text-gray-900">VetAI Connect</h2>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿No tienes una cuenta?
            <router-link
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Regístrate aquí
            </router-link>
          </p>
        </div>
        
        <div class="mt-8">
          <div class="mt-6">
            <Form @submit="handleLogin" class="space-y-6">
              <!-- Email -->
              <div>
                <label for="email" class="form-label">
                  Correo electrónico
                </label>
                <Field
                  v-slot="{ field, meta }"
                  name="email"
                  :rules="emailRules"
                >
                  <input
                    v-bind="field"
                    id="email"
                    type="email"
                    autocomplete="email"
                    :class="[
                      'form-input',
                      meta.touched && !meta.valid ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    placeholder="tu@email.com"
                  />
                </Field>
                <ErrorMessage name="email" class="mt-1 text-sm text-red-600" />
              </div>
              
              <!-- Password -->
              <div>
                <label for="password" class="form-label">
                  Contraseña
                </label>
                <Field
                  v-slot="{ field, meta }"
                  name="password"
                  :rules="passwordRules"
                >
                  <input
                    v-bind="field"
                    id="password"
                    type="password"
                    autocomplete="current-password"
                    :class="[
                      'form-input',
                      meta.touched && !meta.valid ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    placeholder="Tu contraseña"
                  />
                </Field>
                <ErrorMessage name="password" class="mt-1 text-sm text-red-600" />
              </div>
              
              <!-- Remember me y forgot password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                    Recordarme
                  </label>
                </div>
                
                <div class="text-sm">
                  <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
              
              <!-- Error general -->
              <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <XCircleIcon class="h-5 w-5 text-red-400" />
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      Error al iniciar sesión
                    </h3>
                    <p class="mt-1 text-sm text-red-700">
                      {{ authStore.error }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Submit button -->
              <div>
                <button
                  type="submit"
                  :disabled="authStore.loading"
                  class="btn-primary w-full justify-center"
                >
                  <span v-if="authStore.loading" class="loading-spinner mr-2"></span>
                  {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from 'vue-toastification'
import { Form, Field, ErrorMessage } from 'vee-validate'
import {
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Reglas de validación
const emailRules = (value) => {
  if (!value) return 'El correo electrónico es requerido'
  if (!/\S+@\S+\.\S+/.test(value)) return 'Ingresa un correo electrónico válido'
  return true
}

const passwordRules = (value) => {
  if (!value) return 'La contraseña es requerida'
  if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
  return true
}

const handleLogin = async (values) => {
  try {
    authStore.clearError()
    
    await authStore.login({
      email: values.email,
      password: values.password
    })
    
    toast.success(`¡Bienvenido, ${authStore.userName}!`)
    
    // Redirigir según el rol del usuario
    if (authStore.isAdmin) {
      router.push('/admin')
    } else if (authStore.isVet) {
      router.push('/vet')
    } else if (authStore.isClient) {
      router.push('/dashboard')
    } else {
      // Fallback por si el rol no está definido o es desconocido
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    // El error ya está manejado en el store
  }
}
</script> 