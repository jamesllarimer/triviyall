# pages/index.vue
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">TriviYall</h1>
    
    <div v-if="!gameStarted" class="text-center">
      <p class="text-xl text-gray-600 mb-6">Ready to test your knowledge?</p>
      <button
        @click="gameStarted = true"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Start TriviYall
      </button>
      
      <NuxtLink
        to="/dashboard"
        class="block mt-4 text-sm text-gray-500 hover:text-gray-700"
      >
        Admin Dashboard
      </NuxtLink>
    </div>
    
    <Game v-else @game-end="gameStarted = false" />
  </div>
</template>

<script setup lang="ts">
const gameStarted = ref(false)
</script>