<!-- components/WeekModal.vue -->
<template>
  <div v-if="modelValue" class="relative z-10">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ isEditing ? 'Edit Week' : 'Add New Week' }}
            </h3>
            
            <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Week Start Date</label>
                <input
                  type="date"
                  v-model="form.start_date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
                <p class="mt-1 text-sm text-gray-500">Choose the Monday that starts this week</p>
              </div>

              <!-- Auto Create Sets Toggle -->
              <div class="relative flex items-start">
                <div class="flex items-center h-5">
                  <input
                    type="checkbox"
                    v-model="form.autoCreateSets"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label class="font-medium text-gray-700">Automatically create question sets</label>
                  <p class="text-gray-500">Creates new sets with available questions for each day</p>
                </div>
              </div>

              <!-- Daily Set Assignment (show only if not auto-creating) -->
              <div v-if="!form.autoCreateSets" class="space-y-4">
                <h4 class="text-sm font-medium text-gray-700">Assign Question Sets to Days</h4>
                <div v-for="(day, index) in days" :key="day" class="grid grid-cols-1 gap-2">
                  <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-gray-700">{{ day }}</label>
                    <select
                      v-model="selectedSets[index + 1]"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">No Set Selected</option>
                      <option 
                        v-for="set in availableSets(index + 1)" 
                        :key="set.id" 
                        :value="set.id"
                      >
                        Set {{ set.id.slice(0, 8) }} - {{ getSetQuestionPreview(set) }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mt-5 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                >
                  {{ isEditing ? 'Save Changes' : 'Add Week' }}
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
  editingWeek?: any
  questionSets: any[]
  questions: any[]
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const isEditing = computed(() => !!props.editingWeek)
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const form = ref({
  start_date: '',
  autoCreateSets: true  // Default to true for convenience
})

const selectedSets = ref<Record<string, string>>({
  '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': ''
})

// Helper function to get preview of questions in a set
const getSetQuestionPreview = (set: any) => {
  const setQuestions = props.questions
    .filter(q => q.set_id === set.id)
    .map(q => q.question)
  return setQuestions.length > 0 
    ? `${setQuestions[0].slice(0, 30)}...` 
    : 'No questions'
}

// Get available sets for a specific day
const availableSets = (dayNumber: number) => {
  return props.questionSets.filter(set => {
    // Include sets that:
    // 1. Are not assigned to any week/day
    const isUnassigned = !set.week_id || !set.day_number
    // 2. Are currently assigned to this week/day (when editing)
    const isCurrentAssignment = isEditing.value && 
      set.week_id === props.editingWeek.id && 
      set.day_number === dayNumber
    // 3. Not already selected for another day in this week
    const isNotSelectedForOtherDay = Object.entries(selectedSets.value).every(([day, setId]) => {
      return day === dayNumber.toString() || setId !== set.id
    })

    return (isUnassigned || isCurrentAssignment) && isNotSelectedForOtherDay
  })
}

watchEffect(() => {
  if (props.editingWeek) {
    form.value = { 
      start_date: props.editingWeek.start_date,
      autoCreateSets: false
    }
    
    // Get current set assignments
    Object.keys(selectedSets.value).forEach(day => {
      const set = props.questionSets.find(s => 
        s.week_id === props.editingWeek.id && 
        s.day_number === parseInt(day)
      )
      selectedSets.value[day] = set ? set.id : ''
    })
  } else {
    form.value = {
      start_date: '',
      autoCreateSets: true
    }
    // Reset set selections
    Object.keys(selectedSets.value).forEach(day => {
      selectedSets.value[day] = ''
    })
  }
})

const handleSubmit = () => {
  emit('save', {
    ...form.value,
    setAssignments: form.value.autoCreateSets ? [] : Object.entries(selectedSets.value).map(([day, setId]) => ({
      day_number: parseInt(day),
      set_id: setId || null
    }))
  })
  emit('update:modelValue', false)
}
</script>