<!-- components/SetModal.vue -->
<template>
  <div v-if="modelValue" class="relative z-10">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ isEditing ? 'Edit Question Set' : 'Create New Question Set' }}
            </h3>
            
            <form @submit.prevent="handleSubmit" class="mt-4 space-y-6">
              <!-- Basic Set Info -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select
                  v-model="form.status"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <!-- Question Selection -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-base font-medium text-gray-900">Select Questions (5 required)</h4>
                  <div class="flex items-center space-x-2">
                    <label class="text-sm text-gray-700">Filter by Category:</label>
                    <select
                      v-model="selectedCategory"
                      class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">All Categories</option>
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="border rounded-lg overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Select</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Question</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      <tr v-for="question in filteredQuestions" :key="question.id"
                          :class="{ 'bg-indigo-50': selectedQuestions.includes(question.id) }">
                        <td class="whitespace-nowrap px-3 py-4 text-sm">
                          <input
                            type="checkbox"
                            :value="question.id"
                            v-model="selectedQuestions"
                            :disabled="selectedQuestions.length >= 5 && !selectedQuestions.includes(question.id)"
                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td class="px-3 py-4 text-sm text-gray-900">{{ question.question }}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {{ getCategoryName(question.category_id) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p class="mt-2 text-sm text-gray-500">
                  Selected {{ selectedQuestions.length }} of 5 required questions
                </p>
              </div>

              <div class="mt-5 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  :disabled="!isValid"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:col-start-2 sm:text-sm"
                >
                  {{ isEditing ? 'Save Changes' : 'Create Set' }}
                </button>
                <button
                  type="button"
                  @click="$emit('update:modelValue', false)"
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
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

const props = defineProps<{
  modelValue: boolean
  editingSet?: any
  questions: any[]
  categories: any[]
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const isEditing = computed(() => !!props.editingSet)

const form = ref({
  status: 'draft',
  is_auto_generated: false
})

const selectedCategory = ref('')
const selectedQuestions = ref<string[]>([])

const isValid = computed(() => {
  return selectedQuestions.value.length === 5
})

const filteredQuestions = computed(() => {
  let filtered = props.questions
  if (selectedCategory.value) {
    filtered = filtered.filter(q => q.category_id === selectedCategory.value)
  }
  return filtered.filter(q => !q.set_id || (isEditing.value && q.set_id === props.editingSet?.id))
})

const getCategoryName = (categoryId: string) => {
  const category = props.categories.find(c => c.id === categoryId)
  return category ? category.name : 'Unknown'
}

watchEffect(() => {
  if (props.editingSet) {
    form.value = { 
      status: props.editingSet.status,
      is_auto_generated: props.editingSet.is_auto_generated 
    }
    // Get questions assigned to this set
    selectedQuestions.value = props.questions
      .filter(q => q.set_id === props.editingSet.id)
      .map(q => q.id)
  } else {
    form.value = {
      status: 'draft',
      is_auto_generated: false
    }
    selectedQuestions.value = []
  }
})

const handleSubmit = () => {
  emit('save', {
    ...form.value,
    questionIds: selectedQuestions.value
  })
  emit('update:modelValue', false)
}
</script>