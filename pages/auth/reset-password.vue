<!-- pages/auth/reset-password.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Set New Password</h2>
          <p class="mt-2 text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>
  
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                minlength="8"
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
          </div>
  
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                required
                minlength="8"
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': errors.confirmPassword }"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
                {{ errors.confirmPassword }}
              </p>
            </div>
          </div>
  
          <div v-if="generalError" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ generalError }}</p>
              </div>
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <template v-if="loading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating password...
              </template>
              <template v-else>
                Update password
              </template>
            </button>
          </div>
        </form>
  
        <!-- Success Modal -->
        <div v-if="showSuccessModal" class="relative z-10">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  
          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <h3 class="text-base font-semibold leading-6 text-gray-900">
                      Password Updated
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Your password has been successfully updated. You can now sign in with your new password.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6">
                  <NuxtLink
                    to="/auth/login"
                    class="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    Go to sign in
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const supabase = useSupabase()
  const router = useRouter()
  
  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const errors = ref({
    password: '',
    confirmPassword: ''
  })
  const generalError = ref('')
  const showSuccessModal = ref(false)
  
  const isFormValid = computed(() => {
    return password.value.length >= 8 &&
           password.value === confirmPassword.value
  })
  
  const validateForm = (): boolean => {
    errors.value = {
      password: '',
      confirmPassword: ''
    }
    generalError.value = ''
  
    if (password.value.length < 8) {
      errors.value.password = 'Password must be at least 8 characters long'
    }
  
    if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = 'Passwords do not match'
    }
  
    return !Object.values(errors.value).some(error => error !== '')
  }
  
  const handleSubmit = async () => {
    if (!validateForm() || loading.value) return
  
    loading.value = true
    generalError.value = ''
  
    try {
      const { error } = await supabase.auth.updateUser({
        password: password.value
      })
  
      if (error) throw error
  
      showSuccessModal.value = true
    } catch (err: any) {
     console.error('Password update error:', err)
    generalError.value = err.message || 'An error occurred while updating your password'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Check if we have a valid recovery session
  const session = supabase.auth.session()
  if (!session?.access_token) {
    router.push('/auth/login')
  }
})

definePageMeta({
  middleware: ['guest']
})
</script>