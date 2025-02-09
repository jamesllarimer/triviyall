<!-- pages/auth/forgot-password.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Reset Your Password</h2>
          <p class="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
  
        <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': error }"
              />
            </div>
            <p v-if="error" class="mt-2 text-sm text-red-600">
              {{ error }}
            </p>
          </div>
  
          <div>
            <button
              type="submit"
              :disabled="loading || !email"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <template v-if="loading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending instructions...
              </template>
              <template v-else>
                Send reset instructions
              </template>
            </button>
          </div>
  
          <div class="text-sm text-center">
            <NuxtLink
              to="/auth/login"
              class="font-medium text-orange-600 hover:text-orange-500"
            >
              Return to sign in
            </NuxtLink>
          </div>
        </form>
  
        <!-- Success State -->
        <div v-else class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Check your email</h3>
          <p class="mt-2 text-sm text-gray-500">
            We've sent password reset instructions to {{ email }}
          </p>
          <div class="mt-6">
            <NuxtLink
              to="/auth/login"
              class="font-medium text-orange-600 hover:text-orange-500"
            >
              Return to sign in
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const supabase = useSupabase()
  const router = useRouter()
  
  const email = ref('')
  const loading = ref(false)
  const error = ref('')
  const emailSent = ref(false)
  
  const handleSubmit = async () => {
    if (!email.value || loading.value) return
  
    loading.value = true
    error.value = ''
  
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.value,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      )
  
      if (resetError) throw resetError
  
      emailSent.value = true
    } catch (err: any) {
      console.error('Password reset error:', err)
      error.value = err.message || 'An error occurred while sending reset instructions'
    } finally {
      loading.value = false
    }
  }
  
  // Redirect if user is already authenticated
  definePageMeta({
    middleware: ['guest']
  })
  </script>