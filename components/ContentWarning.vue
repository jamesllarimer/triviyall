<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
        <h2 class="text-xl font-bold mb-4">⚠️ Content Warning</h2>
        <p class="mb-4">This game contains explicit audio content that may not be suitable for all audiences or workplaces.</p>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="soundEnabled"
              v-model="soundEnabled"
              class="rounded border-gray-300"
            >
            <label for="soundEnabled">Enable Sound</label>
          </div>
          <button
            @click="proceed"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const show = ref(true)
  const soundEnabled = ref(false)
  const emit = defineEmits(['proceed'])
  
  const proceed = () => {
    show.value = false
    emit('proceed', soundEnabled.value)
  }
  </script>