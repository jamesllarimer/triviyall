<template>
    <div v-if="modelValue" class="relative z-10">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                {{ isEditing ? 'Edit Question' : 'Add New Question' }}
              </h3>
              
              <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                <div class="flex justify-between items-center">
                  <label class="block text-sm font-medium text-gray-700">Question</label>
                  <button
                    type="button"
                    @click="generateAIQuestion"
                    class="text-sm text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                    :disabled="!form.category_id || isGenerating"
                  >
                    {{ isGenerating ? 'Generating...' : 'Generate with AI' }}
                  </button>
                </div>
                <textarea
                  v-model="form.question"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                ></textarea>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    v-model="form.category_id"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }} (ID: {{ category.id }})
                    </option>
                  </select>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700">Options</label>
                  <div v-for="(_, index) in 4" :key="index" class="mt-2">
                    <div class="flex items-center space-x-2">
                      <input
                        v-model="form.options[index]"
                        type="text"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        :placeholder="`Option ${index + 1}`"
                        required
                      />
                      <input
                        type="radio"
                        :value="index"
                        v-model="correctAnswerIndex"
                        name="correct-answer"
                        class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">Select the radio button next to the correct answer</p>
                </div>
  
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                  >
                    {{ isEditing ? 'Save Changes' : 'Add Question' }}
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
  import { useQuestionGenerator } from '~/composables/useQuestionGenerator'

  const props = defineProps<{
    modelValue: boolean
    categories: any[]
    editingQuestion?: any
    existingQuestions?: any[]
  }>()
  
  const emit = defineEmits(['update:modelValue', 'save', 'checkDuplicate'])
  
  const isEditing = computed(() => !!props.editingQuestion)
  
  const form = ref({
    question: '',
    category_id: '', // This should match the type expected by your categories
    options: ['', '', '', '']
  })
  
  const correctAnswerIndex = ref(0)
  const isGenerating = ref(false)
  
  // Initialize form when editing
  watchEffect(() => {
    if (props.editingQuestion) {
      form.value = {
        ...props.editingQuestion,
        options: [...props.editingQuestion.options]
      }
      correctAnswerIndex.value = props.editingQuestion.options.indexOf(props.editingQuestion.correct_answer)
    } else {
      form.value = {
        question: '',
        category_id: '',
        options: ['', '', '', '']
      }
      correctAnswerIndex.value = 0
    }
  })
  
  const handleSubmit = () => {
    const questionData = {
      ...form.value,
      correct_answer: form.value.options[correctAnswerIndex.value]
    }
    emit('save', questionData)
    emit('update:modelValue', false)
  }

  const { generateQuestion, findSimilarQuestions } = useQuestionGenerator()

  const generateAIQuestion = async () => {
    console.log('Category ID:', form.value.category_id) // Debug current category
    console.log('Categories:', props.categories) // Debug available categories
    
    if (!form.value.category_id || isGenerating.value) return
    
    isGenerating.value = true
    try {
      console.log('Starting AI generation...')
      const category = props.categories.find(c => c.id === form.value.category_id)
      if (!category) {
        console.error('Category not found:', form.value.category_id)
        return
      }
  
      console.log('Generating question for category:', category.name)
      const generated = await generateQuestion(category.name)
      console.log('Generated response:', generated)
      
      if (!generated) {
        throw new Error('No question generated')
      }
  
      // Check for similar questions
      const similarQuestions = findSimilarQuestions(generated.question, props.existingQuestions || [])
      
      if (similarQuestions.length > 0) {
        if (!confirm('Similar questions found. Do you want to use this question anyway?')) {
          return
        }
      }
  
      form.value.question = generated.question
      form.value.options = generated.options
      correctAnswerIndex.value = generated.options.indexOf(generated.correct_answer)
    } catch (error) {
      console.error('Error generating question:', error)
      alert('Error generating question: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      isGenerating.value = false
    }
  }

  // Debug when category changes
  watchEffect(() => {
    console.log('Selected category changed to:', form.value.category_id)
  })
  </script>
