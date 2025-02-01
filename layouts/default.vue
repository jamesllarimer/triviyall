<!-- layouts/default.vue -->
<template>
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold">Trivia Admin</h1>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NuxtLink
                  to="/dashboard"
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  :class="[$route.path === '/dashboard' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                >
                  Dashboard
                </NuxtLink>
                <NuxtLink
                  to="/questions"
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  :class="[$route.path.startsWith('/questions') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                >
                  Questions
                </NuxtLink>
                <NuxtLink
                  to="/sets"
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  :class="[$route.path.startsWith('/sets') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                >
                  Question Sets
                </NuxtLink>
                <NuxtLink
                  to="/categories"
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  :class="[$route.path.startsWith('/categories') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                >
                  Categories
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <div class="py-10">
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const route = useRoute()
  </script>