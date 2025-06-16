<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-600"></div>
      </div>

      <!-- Edit Pet Form -->
      <div v-else-if="pet" class="space-y-8">
        <!-- Header -->
        <div class="flex items-center space-x-4 mb-8">
          <button
            @click="$router.go(-1)"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeftIcon class="h-6 w-6" />
          </button>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">Editar {{ pet.name }}</h1>
            <p class="mt-2 text-gray-600">Actualiza la información de tu mascota</p>
          </div>
        </div>

        <!-- Pet Form Card -->
        <div class="bg-white shadow rounded-lg p-6">
          <PetForm
            :pet="pet"
            @save="handleSave"
            @cancel="handleCancel"
          />
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Mascota no encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">No se pudo cargar la información de la mascota.</p>
        <div class="mt-6">
          <router-link
            to="/client/pets"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
          >
            Volver a Mis Mascotas
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// Components
import PetForm from '@/components/forms/PetForm.vue'

// Heroicons
import { 
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Services
import petService from '@/services/petService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Reactive data
const loading = ref(true)
const pet = ref(null)
const saving = ref(false)

// Methods
const loadPetDetails = async () => {
  try {
    const petId = parseInt(route.params.id)
    const response = await petService.getPet(petId)
    pet.value = response.data || response
  } catch (error) {
    console.error('Error loading pet details:', error)
    toast.error('Error al cargar los detalles de la mascota')
  } finally {
    loading.value = false
  }
}

const handleSave = async (formData) => {
  try {
    saving.value = true
    const petId = parseInt(route.params.id)
    
    await petService.updatePet(petId, formData)
    toast.success('Mascota actualizada exitosamente')
    
    // Redirigir al detalle de la mascota
    router.push(`/client/pets/${petId}`)
  } catch (error) {
    console.error('Error updating pet:', error)
    toast.error('Error al actualizar la mascota')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.go(-1)
}

// Lifecycle
onMounted(() => {
  loadPetDetails()
})
</script> 