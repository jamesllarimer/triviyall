<!-- components/MainNav.vue -->
<template>
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold text-orange-600">TriviYall</span>
            </NuxtLink>
          </div>
          
          <div class="flex items-center">
            <template v-if="isAuthenticated">
              <NuxtLink
                v-if="isAdmin"
                to="/dashboard"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin Dashboard
              </NuxtLink>
              
              <div class="ml-3 relative">
                <div>
                  <button
                    @click="showDropdown = !showDropdown"
                    class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <span class="sr-only">Open user menu</span>
                    <div class="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <span class="text-orange-600 font-medium">
                        {{ userInitial }}
                      </span>
                    </div>
                  </button>
                </div>
  
                <div
                  v-if="showDropdown"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                >
                  <NuxtLink
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showDropdown = false"
                  >
                    Your Profile
                  </NuxtLink>
                  <button
                    @click="handleSignOut"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </template>
            
            <template v-else>
              <NuxtLink
                to="/auth/login"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  
  const { user, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const showDropdown = ref(false)
  
  const isAuthenticated = computed(() => !!user.value)
  const userInitial = computed(() => user.value?.email?.[0].toUpperCase() ?? '?')
  
  // Debug logging
  console.log('Current user state:', user.value)
  console.log('Is admin:', isAdmin.value)
  
  watch(user, (newUser) => {
    console.log('User state changed:', newUser)
  })
  
  const handleSignOut = async () => {
    showDropdown.value = false
    try {
      await signOut()
      await router.push('/auth/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
  
  // Handle clicking outside of dropdown
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      showDropdown.value = false
    }
  }
  
  // Lifecycle hooks
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>