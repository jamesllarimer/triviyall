<template>
    <Transition name="feedback">
      <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50">
        <div v-if="isCorrect" class="flex flex-col items-center">
          <div class="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="mt-4 text-2xl font-bold text-green-600">Correct!</span>
        </div>
        <div v-else class="flex flex-col items-center">
          <div class="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center animate-shake">
            <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span class="mt-4 text-2xl font-bold text-red-600">Incorrect!</span>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  
  const props = defineProps<{
    isCorrect: boolean
    show: boolean
    soundEnabled: boolean
  }>()
  
  const isVisible = ref(false)
  
  watch(() => props.show, (newValue) => {
    if (newValue) {
      isVisible.value = true
      
      // Only play sound if enabled
      if (props.soundEnabled) {
        const audio = new Audio(props.isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3')
        audio.play().catch(error => console.log('Audio playback failed:', error))
      }
      
      setTimeout(() => {
        isVisible.value = false
      }, 1500)
    }
  })
  </script>
  
  <style scoped>
  .feedback-enter-active,
  .feedback-leave-active {
    transition: all 0.3s ease;
  }
  
  .feedback-enter-from,
  .feedback-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }
  
  .animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
  </style>