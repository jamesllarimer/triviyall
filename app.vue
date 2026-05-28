<!-- app.vue -->
<template>
  <div v-if="!loading">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
  </div>
</template>

<script setup lang="ts">
const { loading } = useAuth()
</script>