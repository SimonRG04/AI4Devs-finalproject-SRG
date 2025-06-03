<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-12">
        <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">Reprogramar Cita</h3>
        <p class="mt-1 text-sm text-gray-500">Esta funcionalidad estará disponible próximamente.</p>
        <div class="mt-6">
          <router-link
            to="/client/appointments"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vet-600 hover:bg-vet-700"
          >
            Volver a Mis Citas
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CalendarIcon } from '@heroicons/vue/24/outline'
</script> 