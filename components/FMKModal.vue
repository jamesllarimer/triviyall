<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="close" />

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          {{ isEditing ? 'Edit F/M/K Prompt' : 'New F/M/K Prompt' }}
        </h2>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              v-model="form.scheduled_date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Option A</label>
            <input
              type="text"
              v-model="form.option_a"
              required
              placeholder="First option"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Option B</label>
            <input
              type="text"
              v-model="form.option_b"
              required
              placeholder="Second option"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Option C</label>
            <input
              type="text"
              v-model="form.option_c"
              required
              placeholder="Third option"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div class="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              {{ isEditing ? 'Save Changes' : 'Create Prompt' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

const props = defineProps<{
  modelValue: boolean
  editingPrompt?: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: any): void
}>()

const isEditing = computed(() => !!props.editingPrompt)

const form = ref({
  scheduled_date: '',
  option_a: '',
  option_b: '',
  option_c: ''
})

watchEffect(() => {
  if (props.editingPrompt) {
    form.value = {
      scheduled_date: props.editingPrompt.scheduled_date,
      option_a: props.editingPrompt.option_a,
      option_b: props.editingPrompt.option_b,
      option_c: props.editingPrompt.option_c
    }
  } else {
    form.value = { scheduled_date: '', option_a: '', option_b: '', option_c: '' }
  }
})

const handleSave = () => {
  emit('save', { ...form.value })
}

const close = () => {
  emit('update:modelValue', false)
}
</script>
