<!-- pages/auth/register.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Create Your Account</h2>
          <p class="mt-2 text-sm text-gray-600">
            Join TriviYall and start testing your knowledge
          </p>
        </div>
  
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>
  
          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                required
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
          </div>
  
          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': errors.confirmPassword }"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
                {{ errors.confirmPassword }}
              </p>
            </div>
          </div>
  
          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                required
                :disabled="loading"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3">
              <label for="terms" class="text-sm text-gray-700">
                I agree to the
                <a href="#" class="font-medium text-orange-600 hover:text-orange-500">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>
  
          <!-- General Error Message -->
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
  
          <!-- Submit Button -->
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
                Creating account...
              </template>
              <template v-else>
                Create account
              </template>
            </button>
          </div>
  
          <!-- Sign In Link -->
          <div class="text-sm text-center">
            Already have an account?
            <NuxtLink
              to="/auth/login"
              class="font-medium text-orange-600 hover:text-orange-500"
            >
              Sign in
            </NuxtLink>
          </div>
        </form>
      </div>
  
      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="relative z-10">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <div>
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    Registration Successful
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Please check your email to verify your account before signing in.
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
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  const { signUp } = useAuth()
  const router = useRouter()
  
  // Form state
  const form = ref({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  
  // UI state
  const loading = ref(false)
  const errors = ref({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const generalError = ref('')
  const showSuccessModal = ref(false)
  
  // Computed properties
  const isFormValid = computed(() => {
    return isEmailValid(form.value.email) &&
           isPasswordValid(form.value.password) &&
           form.value.password === form.value.confirmPassword &&
           form.value.acceptTerms
  })
  
  // Validation functions
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  const isPasswordValid = (password: string): boolean => {
    return password.length >= 8
  }
  
  // Form validation
  const validateForm = (): boolean => {
    errors.value = {
      email: '',
      password: '',
      confirmPassword: ''
    }
    generalError.value = ''
  
    if (!isEmailValid(form.value.email)) {
      errors.value.email = 'Please enter a valid email address'
    }
  
    if (!isPasswordValid(form.value.password)) {
      errors.value.password = 'Password must be at least 8 characters long'
    }
  
    if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match'
    }
  
    return !Object.values(errors.value).some(error => error !== '')
  }
  
  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return
  
    loading.value = true
    generalError.value = ''
  
    try {
      const { error } = await signUp(form.value.email, form.value.password)
      
      if (error) throw error
  
      showSuccessModal.value = true
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.message.includes('email')) {
        errors.value.email = 'This email is already registered'
      } else {
        generalError.value = error.message || 'An error occurred during registration'
      }
    } finally {
      loading.value = false
    }
  }
  
  // Route protection - redirect if already authenticated
  definePageMeta({
    middleware: ['guest']
  })
  </script>