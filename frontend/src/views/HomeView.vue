<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span class="text-blue-600">VetAI</span> Connect
          </h1>
          <p class="text-xl sm:text-2xl text-gray-600 mb-8">
            Plataforma inteligente para el cuidado veterinario
          </p>
          <p class="text-lg text-gray-500 max-w-2xl mx-auto">
            Conecta con veterinarios expertos, gestiona el historial médico de tus mascotas 
            y accede a diagnósticos asistidos por inteligencia artificial.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <router-link 
            to="/register" 
            class="btn-primary text-lg px-8 py-3 w-full sm:w-auto"
          >
            Comenzar ahora
          </router-link>
          <router-link 
            to="/login" 
            class="btn-secondary text-lg px-8 py-3 w-full sm:w-auto"
          >
            Iniciar sesión
          </router-link>
        </div>

        <!-- Features -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Historial Médico</h3>
            <p class="text-gray-600">
              Mantén un registro completo del historial médico de tus mascotas en un solo lugar.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Citas Online</h3>
            <p class="text-gray-600">
              Agenda citas con veterinarios de forma rápida y sencilla desde cualquier lugar.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">IA Diagnóstica</h3>
            <p class="text-gray-600">
              Diagnósticos asistidos por inteligencia artificial para un cuidado más preciso.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-500">
          © 2024 VetAI Connect. Cuidando a tus mascotas con tecnología avanzada.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No necesitamos importaciones adicionales para esta vista estática
</script> 