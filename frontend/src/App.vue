<template>
  <header class="bg-blue-600 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">VetAI Connect</h1>
      <nav>
        <RouterLink to="/" class="px-3 py-2 hover:text-blue-200">Inicio</RouterLink>
      </nav>
    </div>
  </header>

  <main class="container mx-auto p-4">
    <RouterView />
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script> 