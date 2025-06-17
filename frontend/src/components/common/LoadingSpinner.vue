<template>
  <div 
    class="loading-spinner-container"
    :class="containerClasses"
  >
    <div 
      class="loading-spinner"
      :class="spinnerClasses"
      :style="spinnerStyles"
    >
      <div class="spinner-inner"></div>
    </div>
    
    <p 
      v-if="message" 
      class="loading-message"
      :class="messageClasses"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'dark'].includes(value)
  },
  centered: {
    type: Boolean,
    default: true
  },
  overlay: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: null
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const variantClasses = {
  primary: 'border-blue-600 border-t-transparent',
  secondary: 'border-gray-400 border-t-transparent',
  white: 'border-white border-t-transparent',
  dark: 'border-gray-800 border-t-transparent'
}

const containerClasses = computed(() => [
  {
    'fixed inset-0 bg-black bg-opacity-50 z-50': props.overlay,
    'flex items-center justify-center': props.centered && !props.inline,
    'inline-flex items-center space-x-2': props.inline,
    'flex flex-col items-center justify-center space-y-2': props.centered && !props.inline && props.message
  }
])

const spinnerClasses = computed(() => [
  'border-2 rounded-full animate-spin',
  sizeClasses[props.size],
  variantClasses[props.variant]
])

const spinnerStyles = computed(() => ({
  animationDuration: '1s'
}))

const messageClasses = computed(() => [
  'text-sm',
  {
    'text-white': props.overlay || (!props.overlay && props.variant === 'white'),
    'text-gray-600': !props.overlay && props.variant !== 'white'
  }
])
</script>

<style scoped>
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner-inner {
  @apply w-full h-full rounded-full;
}

.loading-message {
  @apply mt-2 text-center;
}
</style> 