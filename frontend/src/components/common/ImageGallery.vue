<template>
  <div v-if="images && images.length > 0" class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-medium text-gray-900">
        {{ title || 'Imágenes adjuntas' }}
        <span class="text-gray-500">({{ images.length }})</span>
      </h4>
      <button
        v-if="showToggle && images.length > maxVisible"
        @click="showAll = !showAll"
        class="text-sm text-vet-600 hover:text-vet-700"
      >
        {{ showAll ? 'Ver menos' : `Ver todas (${images.length})` }}
      </button>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="(image, index) in visibleImages"
        :key="index"
        class="relative group cursor-pointer"
        @click="openModal(index)"
      >
        <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            :src="image"
            :alt="`Imagen ${index + 1}`"
            class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            @error="onImageError(index)"
          />
        </div>
        
        <!-- Overlay en hover -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
          <EyeIcon class="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
    </div>

    <!-- Modal para vista ampliada -->
    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        @click="closeModal"
      >
        <div class="relative max-w-4xl max-h-full p-4">
          <!-- Botón cerrar -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
          
          <!-- Navegación -->
          <button
            v-if="images.length > 1"
            @click.stop="prevImage"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200"
          >
            <ChevronLeftIcon class="h-6 w-6" />
          </button>
          
          <button
            v-if="images.length > 1"
            @click.stop="nextImage"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200"
          >
            <ChevronRightIcon class="h-6 w-6" />
          </button>
          
          <!-- Imagen principal -->
          <img
            :src="images[currentImageIndex]"
            :alt="`Imagen ${currentImageIndex + 1}`"
            class="max-w-full max-h-full object-contain rounded-lg"
            @click.stop
          />
          
          <!-- Indicador de posición -->
          <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm">
            {{ currentImageIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
  
  <!-- Estado vacío -->
  <div v-else-if="showEmpty" class="text-center py-6 text-gray-500">
    <PhotoIcon class="h-12 w-12 mx-auto mb-2 text-gray-400" />
    <p class="text-sm">{{ emptyMessage || 'No hay imágenes disponibles' }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  EyeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  maxVisible: {
    type: Number,
    default: 4
  },
  showToggle: {
    type: Boolean,
    default: true
  },
  showEmpty: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: ''
  }
})

// Estado local
const showAll = ref(false)
const modalOpen = ref(false)
const currentImageIndex = ref(0)

// Computed
const visibleImages = computed(() => {
  if (!props.images || props.images.length === 0) return []
  
  if (showAll.value || props.images.length <= props.maxVisible) {
    return props.images
  }
  
  return props.images.slice(0, props.maxVisible)
})

// Métodos
const openModal = (index) => {
  currentImageIndex.value = index
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  modalOpen.value = false
  document.body.style.overflow = 'auto'
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0 
    ? props.images.length - 1 
    : currentImageIndex.value - 1
}

const onImageError = (index) => {
  console.error(`Error loading image at index ${index}:`, props.images[index])
}

// Cleanup al desmontar
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (modalOpen.value) {
    document.body.style.overflow = 'auto'
  }
})
</script> 