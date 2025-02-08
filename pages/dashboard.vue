<!-- pages/dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <h1 class="text-3xl font-bold text-gray-900">Trivia Admin Dashboard</h1>
        <div class="mt-4 sm:mt-0">
          <button @click="showAddQuestionModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Question
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <dt class="text-sm font-medium text-gray-500 truncate">Total Questions</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.totalQuestions }}</dd>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <dt class="text-sm font-medium text-gray-500 truncate">Available Questions</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.availableQuestions }}</dd>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <dt class="text-sm font-medium text-gray-500 truncate">Total Weeks</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.totalWeeks }}</dd>
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
            <button v-for="tab in tabs" :key="tab.name" @click="currentTab = tab.id" :class="[
              currentTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]">
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
                <select v-model="questionsFilter.category"
                  class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <select v-model="questionsFilter.availability"
                  class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="">All Questions</option>
                  <option value="available">Available Only</option>
                  <option value="used">Previously Used</option>
                </select>
              </div>
            </div>

            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Question</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Used</th>
                  <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="question in filteredQuestions" :key="question.id"
                    :class="{ 'opacity-75': !question.is_available }">
                  <td class="whitespace-normal px-3 py-4 text-sm text-gray-500">
                    {{ question.question }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ getCategoryName(question.category_id) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ question.last_used_date ? formatDate(question.last_used_date) : 'Never' }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button @click="editQuestion(question)" class="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button @click="deleteQuestion(question.id)" class="ml-4 text-red-600 hover:text-red-900">
                      Delete
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
              <button @click="showAddSetModal = true"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                New Set
              </button>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div v-for="set in questionSets" :key="set.id"
                class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    Set {{ set.id.slice(0, 8) }}
                  </p>
                  <div class="mt-1 text-sm text-gray-500">
                    <p>Questions:</p>
                    <ul class="list-disc pl-5">
                      <li v-for="question in set.questions" :key="question.id">
                        {{ question.question.slice(0, 50) }}...
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="flex flex-col space-y-2">
                  <button @click="editSet(set)" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    Edit
                  </button>
                  <button @click="deleteSet(set.id)" class="text-red-600 hover:text-red-900 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div v-if="currentTab === 'categories'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Categories</h2>
              <button @click="showAddCategoryModal = true"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Add Category
              </button>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="category in categories" :key="category.id"
                class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ category.name }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ category.description }}
                  </p>
                </div>
                <div class="flex flex-col space-y-2">
                  <button @click="editCategory(category)" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    Edit
                  </button>
                  <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-900 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Weeks List -->
          <div v-if="currentTab === 'weeks'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Weeks</h2>
              <button @click="showAddWeekModal = true"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                New Week
              </button>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div v-for="week in weeks" :key="week.id" class="bg-white shadow rounded-lg p-6">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">
                      Week of {{ formatDate(week.start_date) }}
                    </h3>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="editWeek(week)" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Edit
                    </button>
                    <button @click="deleteWeek(week.id)" class="text-red-600 hover:text-red-900 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>

                <!-- Daily Set Status -->
                <div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <div v-for="(day, index) in days" :key="day"
                       class="flex justify-between text-sm bg-gray-50 rounded-md p-2">
                    <span class="font-medium">{{ day }}:</span>
                    <span :class="getDaySetStatus(week.id, index + 1).color">
                      {{ getDaySetStatus(week.id, index + 1).text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <QuestionModal v-model="showAddQuestionModal" :categories="categories" :editing-question="editingQuestion"
      @save="saveQuestion" />
    <SetModal v-model="showAddSetModal" :editing-set="editingSet" :questions="questions" :categories="categories"
      @save="saveSet" />
    <CategoryModal v-model="showAddCategoryModal" :editing-category="editingCategory" @save="saveCategory" />
    <WeekModal v-model="showAddWeekModal" :editing-week="editingWeek" :question-sets="questionSets" :questions="questions"
      @save="saveWeek" />
  </div>
</template>

//pages/dashboard.vue script section
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QuestionModal from '../components/QuestionModal.vue'
import SetModal from '../components/SetModal.vue'
import CategoryModal from '../components/CategoryModal.vue'
import WeekModal from '../components/WeekModal.vue'

// State
const currentTab = ref('weeks')
const showAddQuestionModal = ref(false)
const showAddSetModal = ref(false)
const showAddCategoryModal = ref(false)
const showAddWeekModal = ref(false)

const stats = ref({
  totalQuestions: 0,
  availableQuestions: 0,
  totalCategories: 0,
  totalWeeks: 0
})

const editingQuestion = ref(null)
const editingSet = ref(null)
const editingCategory = ref(null)
const editingWeek = ref(null)

// Data
const questions = ref([])
const categories = ref([])
const questionSets = ref([])
const weeks = ref([])

// Constants
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Filters
const questionsFilter = ref({
  category: '',
  availability: ''
})

// Navigation
const tabs = [
  { id: 'weeks', name: 'Weeks' },
  { id: 'questions', name: 'Questions' },
  { id: 'sets', name: 'Question Sets' },
  { id: 'categories', name: 'Categories' }
]

// Computed
const filteredQuestions = computed(() => {
  let filtered = questions.value

  if (questionsFilter.value.category) {
    filtered = filtered.filter(q => q.category_id === questionsFilter.value.category)
  }

  if (questionsFilter.value.availability === 'available') {
    filtered = filtered.filter(q => q.is_available)
  } else if (questionsFilter.value.availability === 'used') {
    filtered = filtered.filter(q => !q.is_available)
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

const getDaySetStatus = (weekId: string, dayNumber: number) => {
  const set = questionSets.value.find(s => s.week_id === weekId && s.day_number === dayNumber)
  if (!set) {
    return { text: 'No Set', color: 'text-gray-500' }
  }
  return { text: 'Assigned', color: 'text-indigo-600' }
}

// Edit Actions
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

const editWeek = (week: any) => {
  editingWeek.value = week
  showAddWeekModal.value = true
}

// CRUD Operations
const fetchQuestions = async () => {
  const supabase = useSupabase()
  
  try {
    const { data, error } = await supabase
      .from('available_questions')
      .select('*')
    
    if (error) throw error
    questions.value = data || []
  } catch (error) {
    console.error('Error fetching questions:', error)
    alert('Error loading questions')
  }
}

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
    showAddQuestionModal.value = false
    await fetchData() // Refresh all data
  } catch (error) {
    console.error('Error saving question:', error)
    alert('Error saving question')
  }
}

const saveSet = async (setData: any) => {
  const supabase = useSupabase()
  const { questionIds } = setData

  try {
    let setId: string

    if (editingSet.value) {
      setId = editingSet.value.id
    } else {
      // Create new set
      const { data, error } = await supabase
        .from('question_sets')
        .insert({})
        .select()
        .single()

      if (error) throw error
      setId = data.id
    }

    // First, clear any existing question assignments for this set
    const { error: clearError } = await supabase
      .from('questions')
      .update({ set_id: null })
      .eq('set_id', setId)

    if (clearError) throw clearError

    // Then assign questions to this set
    const { error: updateError } = await supabase
      .from('questions')
      .update({ set_id: setId })
      .in('id', questionIds)

    if (updateError) throw updateError

    // Mark questions as used
    const today = new Date().toISOString().split('T')[0]
    for (const questionId of questionIds) {
      const { error: usageError } = await supabase.rpc(
        'mark_question_used',
        { 
          question_id_param: questionId,
          used_date_param: today
        }
      )
      
      if (usageError) throw usageError
    }

    // Reset editing state and refresh data
    editingSet.value = null
    showAddSetModal.value = false
    await fetchData()
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
    showAddCategoryModal.value = false
    await fetchData() // Refresh all data
  } catch (error) {
    console.error('Error saving category:', error)
    alert('Error saving category')
  }
}

const saveWeek = async (weekData: any) => {
  const supabase = useSupabase()
  const { setAssignments, ...weekDetails } = weekData

  try {
    let weekId: string

    if (editingWeek.value) {
      // Update existing week
      const { data, error } = await supabase
        .from('weeks')
        .update(weekDetails)
        .eq('id', editingWeek.value.id)
        .select()

      if (error) throw error
      weekId = editingWeek.value.id

      // Update local state
      const index = weeks.value.findIndex(w => w.id === editingWeek.value.id)
      if (index !== -1) {
        weeks.value[index] = data[0]
      }
    } else {
      // Create new week
      const { data, error } = await supabase
        .from('weeks')
        .insert(weekDetails)
        .select()

      if (error) throw error
      weekId = data[0].id

      // Add to local state
      weeks.value.push(data[0])
    }

    // First, clear any existing set assignments for this week
    const { error: clearError } = await supabase
      .from('question_sets')
      .update({
        week_id: null,
        day_number: null
      })
      .eq('week_id', weekId)

    if (clearError) throw clearError

    // Then update each set with its new assignment
    for (const { day_number, set_id } of setAssignments) {
      if (set_id) {  // Only update if a set was selected
        const { error: updateError } = await supabase
          .from('question_sets')
          .update({
            week_id: weekId,
            day_number: day_number
          })
          .eq('id', set_id)

        if (updateError) throw updateError
      }
    }

    // Reset editing state
    editingWeek.value = null
    showAddWeekModal.value = false
    await fetchData() // Refresh all data
  } catch (error) {
    console.error('Error saving week:', error)
    alert('Error saving week')
  }
}

// Delete Operations
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
    // First update questions to remove set_id
    const { error: updateError } = await supabase
      .from('questions')
      .update({ set_id: null })
      .eq('set_id', setId)

    if (updateError) throw updateError

    // Then delete the set
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

const deleteWeek = async (weekId: string) => {
  const supabase = useSupabase()

  if (!confirm('Are you sure you want to delete this week? This will remove all associated question sets.')) return

  try {
    // First update any question sets to remove references to this week
    const { error: updateError } = await supabase
      .from('question_sets')
      .update({ 
        week_id: null,
        day_number: null 
      })
      .eq('week_id', weekId)

    if (updateError) throw updateError

    // Then delete the week
    const { error } = await supabase
      .from('weeks')
      .delete()
      .eq('id', weekId)

    if (error) throw error

    // Remove from local state
    weeks.value = weeks.value.filter(w => w.id !== weekId)
    await fetchData() // Refresh data
  } catch (error) {
    console.error('Error deleting week:', error)
    alert('Error deleting week')
  }
}

// Data fetching
const fetchData = async () => {
  const supabase = useSupabase()

  try {
    // Fetch questions with availability info
    await fetchQuestions()

    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
    if (categoriesError) throw categoriesError
    categories.value = categoriesData || []

    // Fetch weeks with their question sets
    const { data: weeksData, error: weeksError } = await supabase
      .from('weeks')
      .select('*')
      .order('start_date', { ascending: false })
    if (weeksError) throw weeksError
    weeks.value = weeksData || []

    // Fetch question sets with their questions and week assignments
    const { data: setsData, error: setsError } = await supabase
      .from('question_sets')
      .select(`
        *,
        questions (*),
        week:weeks (
          id,
          start_date
        )
      `)
    if (setsError) throw setsError
    questionSets.value = setsData || []

    // Update stats
    stats.value = {
      totalQuestions: questions.value.length,
      availableQuestions: questions.value.filter(q => q.is_available).length,
      totalCategories: categories.value.length,
      totalWeeks: weeks.value.length
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