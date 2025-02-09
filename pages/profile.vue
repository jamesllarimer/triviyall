<!-- pages/profile.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- User Profile Card -->
        <div class="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <div class="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Profile</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Your personal information</p>
          </div>
  
          <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-500">Email address</h4>
                <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
              </div>
  
              <div>
                <h4 class="text-sm font-medium text-gray-500">Member since</h4>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(profile?.created_at) }}</p>
              </div>
  
              <!-- Account Actions -->
              <div class="flex space-x-4">
                <button
                  @click="showChangePasswordModal = true"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change Password
                </button>
  
                <button
                  @click="handleSignOut"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Game History -->
        <GameHistory v-if="user" :user-id="user.id" />
      </div>
  
      <!-- Change Password Modal -->
      <div v-if="showChangePasswordModal" class="relative z-10">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                
                <form @submit.prevent="handlePasswordChange" class="mt-4 space-y-4">
                  <div>
                    <label for="current-password" class="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      id="current-password"
                      v-model="currentPassword"
                      type="password"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
  
                  <div>
                    <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      id="new-password"
                      v-model="newPassword"
                      type="password"
                      required
                      minlength="6"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
  
                  <div>
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      id="confirm-password"
                      v-model="confirmPassword"
                      type="password"
                      required
                      minlength="6"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
  
                  <div v-if="passwordError" class="text-red-600 text-sm">
                    {{ passwordError }}
                  </div>
  
                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      :disabled="passwordLoading || !isPasswordFormValid"
                      class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50"
                    >
                      {{ passwordLoading ? 'Updating...' : 'Update Password' }}
                    </button>
                    <button
                      type="button"
                      @click="closePasswordModal"
                      class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Success Notification -->
      <div v-if="showSuccessMessage" 
           class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ successMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import GameHistory from '~/components/GameHistory.vue'
  import { User } from '@supabase/supabase-js'
  
  // Composables
  const { user, signOut, updatePassword } = useAuth()
  const supabase = useSupabase()
  const router = useRouter()
  
  // State
  const profile = ref<any>(null)
  const showChangePasswordModal = ref(false)
  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const passwordError = ref('')
  const passwordLoading = ref(false)
  const showSuccessMessage = ref(false)
  const successMessage = ref('')
  
  // Computed
  const isPasswordFormValid = computed(() => {
    return currentPassword.value.length >= 6 &&
           newPassword.value.length >= 6 &&
           newPassword.value === confirmPassword.value
  })
  
  // Methods
  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const fetchProfile = async () => {
    if (!user.value) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
        
      if (error) throw error
      profile.value = data
    } catch (error) {
      console.error('Error fetching profile:', error)
      showError('Failed to load profile data')
    }
  }
  
  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      showError('Failed to sign out')
    }
  }
  
  const handlePasswordChange = async () => {
    if (!isPasswordFormValid.value) return
    
    passwordLoading.value = true
    passwordError.value = ''
    
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.value?.email || '',
        password: currentPassword.value
      })
  
      if (signInError) {
        throw new Error('Current password is incorrect')
      }
  
      // Update to new password
      const { error } = await updatePassword(newPassword.value)
      if (error) throw error
      
      closePasswordModal()
      showSuccess('Password updated successfully')
    } catch (error: any) {
      passwordError.value = error.message
    } finally {
      passwordLoading.value = false
    }
  }
  
  const closePasswordModal = () => {
    showChangePasswordModal.value = false
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordError.value = ''
  }
  
  const showSuccess = (message: string) => {
    successMessage.value = message
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
  
  const showError = (message: string) => {
    passwordError.value = message
    setTimeout(() => {
      passwordError.value = ''
    }, 3000)
  }
  
  // Route protection
  definePageMeta({
    middleware: ['auth']
  })
  
  // Lifecycle
  onMounted(() => {
    fetchProfile()
  })
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>