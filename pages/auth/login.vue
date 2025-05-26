<!-- pages/auth/login.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Sign In to Trivi-Y'all</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
  
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
  
          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>
  
          <div class="flex items-center justify-between">
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Create account
            </NuxtLink>
          </div>
  
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const { signIn } = useAuth()
  const router = useRouter()
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)
  
  const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Attempting login with:', email.value)
    const { error: signInError, user: signedInUser } = await signIn(email.value, password.value)
    
    if (signInError) throw signInError
    
    console.log('Login successful, user:', signedInUser)
    await router.push('/')
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
  </script>
  
  