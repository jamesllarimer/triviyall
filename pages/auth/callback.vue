<!-- pages/auth/callback.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const supabase = useSupabase()
  const router = useRouter()
  
  onMounted(async () => {
    try {
      const { error } = await supabase.auth.getSession()
      if (error) throw error
      
      // Successful authentication, redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Authentication error:', error)
      // On error, redirect to login page
      router.push('/auth/login')
    }
  })
  </script>