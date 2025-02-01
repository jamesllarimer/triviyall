// pages/dashboard.vue
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Trivia Admin Dashboard</h1>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showAddQuestionModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Question
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <dt class="text-sm font-medium text-gray-500 truncate">Total Questions</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.totalQuestions }}</dd>
        </div>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <dt class="text-sm font-medium text-gray-500 truncate">Active Question Sets</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.activeSets }}</dd>
        </div>
      </div>
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <dt class="text-sm font-medium text-gray-500 truncate">Categories</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.totalCategories }}</dd>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="bg-white shadow rounded-lg">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-4" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="currentTab = tab.id"
            :class="[
              currentTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-4">
        <!-- Questions List -->
        <div v-if="currentTab === 'questions'" class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Questions</h2>
            <div class="flex space-x-2">
              <select
                v-model="questionsFilter.category"
                class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Question</th>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Set</th>
                <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="question in filteredQuestions" :key="question.id">
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ question.question }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ getCategoryName(question.category_id) }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ getSetName(question.set_id) }}
                </td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    @click="editQuestion(question)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Question Sets -->
        <div v-if="currentTab === 'sets'" class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Question Sets</h2>
            <button
              @click="showAddSetModal = true"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              New Set
            </button>
          </div>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              v-for="set in questionSets"
              :key="set.id"
              class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  Week of {{ formatDate(set.week_start_date) }}
                </p>
                <p class="text-sm text-gray-500">
                  Status: {{ set.status }}
                </p>
              </div>
              <button
                @click="editSet(set)"
                class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div v-if="currentTab === 'categories'" class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Categories</h2>
            <button
              @click="showAddCategoryModal = true"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Category
            </button>
          </div>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="category in categories"
              :key="category.id"
              class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  {{ category.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ category.description }}
                </p>
              </div>
              <button
                @click="editCategory(category)"
                class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <QuestionModal
      v-model="showAddQuestionModal"
      :categories="categories"
      :editing-question="editingQuestion"
      @save="saveQuestion"
    />
    
    <SetModal
      v-model="showAddSetModal"
      :editing-set="editingSet"
      @save="saveSet"
    />
    
    <CategoryModal
      v-model="showAddCategoryModal"
      :editing-category="editingCategory"
      @save="saveCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QuestionModal from '../components/QuestionModal.vue'
import SetModal from '../components/SetModal.vue'
import CategoryModal from '../components/CategoryModal.vue'

// State
const currentTab = ref('questions')
const showAddQuestionModal = ref(false)
const showAddSetModal = ref(false)
const showAddCategoryModal = ref(false)
const stats = ref({
  totalQuestions: 0,
  activeSets: 0,
  totalCategories: 0
})

const editingQuestion = ref(null)
const editingSet = ref(null)
const editingCategory = ref(null)

// Data
const questions = ref([])
const categories = ref([])
const questionSets = ref([])

// Filters
const questionsFilter = ref({
  category: '',
})

// Navigation
const tabs = [
  { id: 'questions', name: 'Questions' },
  { id: 'sets', name: 'Question Sets' },
  { id: 'categories', name: 'Categories' },
]

// Computed
const filteredQuestions = computed(() => {
  let filtered = questions.value
  if (questionsFilter.value.category) {
    filtered = filtered.filter(q => q.category_id === questionsFilter.value.category)
  }
  return filtered
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Unknown'
}

const getSetName = (setId: string) => {
  const set = questionSets.value.find(s => s.id === setId)
  return set ? `Week of ${formatDate(set.week_start_date)}` : 'Unassigned'
}

const editQuestion = (question: any) => {
  editingQuestion.value = question
  showAddQuestionModal.value = true
}

const editSet = (set: any) => {
  editingSet.value = set
  showAddSetModal.value = true
}

const editCategory = (category: any) => {
  editingCategory.value = category
  showAddCategoryModal.value = true
}

// CRUD Operations
const saveQuestion = async (questionData: any) => {
  const supabase = useSupabase()
  
  try {
    if (editingQuestion.value) {
      // Update existing question
      const { data, error } = await supabase
        .from('questions')
        .update(questionData)
        .eq('id', editingQuestion.value.id)
        .select()
      
      if (error) throw error
      
      // Update local state
      const index = questions.value.findIndex(q => q.id === editingQuestion.value.id)
      if (index !== -1) {
        questions.value[index] = data[0]
      }
    } else {
      // Create new question
      const { data, error } = await supabase
        .from('questions')
        .insert(questionData)
        .select()
      
      if (error) throw error
      
      // Add to local state
      questions.value.push(data[0])
    }
    
    // Reset editing state
    editingQuestion.value = null
    await fetchData() // Refresh all data
  } catch (error) {
    console.error('Error saving question:', error)
    alert('Error saving question')
  }
}

const saveSet = async (setData: any) => {
  const supabase = useSupabase()
  
  try {
    if (editingSet.value) {
      // Update existing set
      const { data, error } = await supabase
        .from('question_sets')
        .update(setData)
        .eq('id', editingSet.value.id)
        .select()
      
      if (error) throw error
      
      // Update local state
      const index = questionSets.value.findIndex(s => s.id === editingSet.value.id)
      if (index !== -1) {
        questionSets.value[index] = data[0]
      }
    } else {
      // Create new set
      const { data, error } = await supabase
        .from('question_sets')
        .insert(setData)
        .select()
      
      if (error) throw error
      
      // Add to local state
      questionSets.value.push(data[0])
    }
    
    // Reset editing state
    editingSet.value = null
    await fetchData() // Refresh all data
  } catch (error) {
    console.error('Error saving set:', error)
    alert('Error saving question set')
  }
}

const saveCategory = async (categoryData: any) => {
  const supabase = useSupabase()
  
  try {
    if (editingCategory.value) {
      // Update existing category
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', editingCategory.value.id)
        .select()
      
      if (error) throw error
      
      // Update local state
      const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
      if (index !== -1) {
        categories.value[index] = data[0]
      }
    } else {
      // Create new category
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
      
      if (error) throw error
      
      // Add to local state
      categories.value.push(data[0])
    }
    
    // Reset editing state
    editingCategory.value = null
    await fetchData() // Refresh all data
  } catch (error) {
    console.error('Error saving category:', error)
    alert('Error saving category')
  }
}

const deleteQuestion = async (questionId: string) => {
  const supabase = useSupabase()
  
  if (!confirm('Are you sure you want to delete this question?')) return
  
  try {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId)
    
    if (error) throw error
    
    // Remove from local state
    questions.value = questions.value.filter(q => q.id !== questionId)
    await fetchData() // Refresh data
  } catch (error) {
    console.error('Error deleting question:', error)
    alert('Error deleting question')
  }
}

const deleteSet = async (setId: string) => {
  const supabase = useSupabase()
  
  if (!confirm('Are you sure you want to delete this question set?')) return
  
  try {
    const { error } = await supabase
      .from('question_sets')
      .delete()
      .eq('id', setId)
    
    if (error) throw error
    
    // Remove from local state
    questionSets.value = questionSets.value.filter(s => s.id !== setId)
    await fetchData() // Refresh data
  } catch (error) {
    console.error('Error deleting set:', error)
    alert('Error deleting question set')
  }
}

const deleteCategory = async (categoryId: string) => {
  const supabase = useSupabase()
  
  if (!confirm('Are you sure you want to delete this category? This will affect all questions in this category.')) return
  
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
    
    if (error) throw error
    
    // Remove from local state
    categories.value = categories.value.filter(c => c.id !== categoryId)
    await fetchData() // Refresh data
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('Error deleting category')
  }
}

// Data fetching
const fetchData = async () => {
  const supabase = useSupabase()
  
  try {
    // Fetch questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*')
    if (questionsError) throw questionsError
    questions.value = questionsData || []
    
    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
    if (categoriesError) throw categoriesError
    categories.value = categoriesData || []
    
    // Fetch question sets
    const { data: setsData, error: setsError } = await supabase
      .from('question_sets')
      .select('*')
    if (setsError) throw setsError
    questionSets.value = setsData || []
    
    // Update stats
    stats.value = {
      totalQuestions: questions.value.length,
      activeSets: questionSets.value.filter(s => s.status === 'active').length,
      totalCategories: categories.value.length
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Error fetching data')
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>