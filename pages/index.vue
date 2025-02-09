<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold text-white mb-8 drop-shadow-lg">TriviYa'll</h1>
    
    <div v-if="!gameStarted" class="text-center">
      <p class="text-xl text-white mb-6 drop-shadow">Get trivi, get TriviYa'll!</p>
      <button
        @click="gameStarted = true"
        class="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-full shadow-lg text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-all duration-200"
      >
        Start TriviYa'll
      </button>
      
      <NuxtLink
        to="/dashboard"
        class="block mt-4 text-sm text-white hover:text-orange-200 transition-colors duration-200"
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