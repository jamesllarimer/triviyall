<!-- components/Game.vue -->
<template>
  <div class="w-full max-w-2xl">
    <!-- Debug Date Selector (dev only) -->
    <div v-if="isDevelopment" class="mb-4 p-4 bg-orange-100 border border-orange-200 rounded-lg">
      <h3 class="text-sm font-medium text-yellow-800 mb-2">Debug Mode</h3>
      <div class="flex items-center space-x-4">
        <input
          type="date"
          v-model="debugDate"
          class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          @click="fetchQuestions"
          class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
        >
          Test Date
        </button>
      </div>
    </div>

    <!-- Content Warning -->
    <ContentWarning 
      v-if="!gameStarted" 
      @proceed="startGame" 
    />

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center">
      <h2 class="text-3xl font-bold text-white animate-bounce drop-shadow-lg">
        Get Reeeaaaadyyy!
      </h2>
    </div>

    <!-- Game Content -->
    <template v-else>
      <!-- Sound Toggle -->
      <div class="flex justify-end mb-4">
        <button
          @click="toggleSound"
          class="flex items-center space-x-2 text-sm text-white hover:text-orange-200 transition-colors duration-200"
        >
          <span v-if="soundEnabled">🔊</span>
          <span v-else>🔇</span>
          <span>{{ soundEnabled ? 'Mute' : 'Unmute' }}</span>
        </button>
      </div>

      <!-- Game Complete State -->
      <div v-if="gameComplete" class="text-center space-y-6 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-xl">
        <h2 class="text-2xl font-bold text-orange-600">Game Complete!</h2>
        <div class="text-lg text-gray-600">
          You got {{ score }} out of {{ questions.length }} correct!
        </div>
        
        <!-- Result Pattern -->
        <div class="flex justify-center space-x-1 my-4">
          <div v-for="(result, index) in answerResults" :key="index"
            class="w-8 h-8 flex items-center justify-center rounded"
            :class="result ? 'bg-green-500' : 'bg-orange-500'"
          >
            <span class="text-white font-bold">
              {{ result ? '✓' : '✗' }}
            </span>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <button
            v-if="canNativeShare"
            @click="nativeShare"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-all duration-200"
          >
            <span class="mr-2">Share</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
          
          <button
            v-else
            @click="copyToClipboard"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-all duration-200"
          >
            <span class="mr-2">Copy Results</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>
          
          <button
            @click="restartGame"
            class="inline-flex items-center px-6 py-3 border-2 border-orange-500 text-base font-medium rounded-full shadow-sm text-orange-500 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-all duration-200"
          >
            Play Again
          </button>
        </div>

        <!-- Share Success Message -->
        <div v-if="showShareSuccess" 
          class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md text-sm"
        >
          {{ shareSuccessMessage }}
        </div>
      </div>

      <!-- Question Display -->
      <div v-else class="space-y-6">
        <!-- Progress -->
        <div class="flex justify-between items-center text-sm text-white">
          <span>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
          <span>Score: {{ score }}</span>
        </div>

        <!-- Question -->
        <div class="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-6">
          <h2 class="text-xl font-medium text-orange-600 mb-4">
            {{ currentQuestion.question }}
          </h2>

          <!-- Options -->
          <div class="space-y-3">
            <button
              v-for="option in shuffledOptions"
              :key="option"
              :disabled="answerSubmitted"
              @click="selectOption(option)"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                getOptionClasses(option)
              ]"
            >
              {{ option }}
            </button>
          </div>

          <!-- Submit Answer Button -->
          <div v-if="selectedOption && !answerSubmitted" class="mt-4">
            <button
              @click="submitAnswer"
              class="w-full inline-flex justify-center px-4 py-2 border border-transparent text-base font-medium rounded-full text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-all duration-200"
            >
              Lock In Answer
            </button>
          </div>
        </div>

        <!-- Next Question Button -->
        <div v-if="answerSubmitted && !gameComplete" class="flex justify-end mt-4">
          <button
            @click="nextQuestion"
            class="inline-flex items-center px-4 py-2 border-2 border-white text-base font-medium rounded-full text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200"
          >
            Next Question
          </button>
        </div>
      </div>

      <!-- Answer Feedback -->
      <AnswerFeedback 
        :is-correct="feedbackState.isCorrect"
        :show="feedbackState.show"
        :sound-enabled="soundEnabled"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabase()

// State
const loading = ref(true)
const questions = ref<any[]>([])
const currentQuestionIndex = ref(0)
const score = ref(0)
const answerSubmitted = ref(false)
const gameComplete = ref(false)
const showShareSuccess = ref(false)
const shareSuccessMessage = ref('')
const canNativeShare = ref(false)
const gameStarted = ref(false)
const soundEnabled = ref(false)

// Answer feedback state
const feedbackState = ref({
  isCorrect: false,
  show: false
})

const answerResults = ref<boolean[]>([])
const gameDate = ref('')
const selectedOption = ref<string | null>(null)

// Computed
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {})

// Add new state variables
const isDevelopment = process.dev // Nuxt provides this
const debugDate = ref(new Date().toISOString().split('T')[0])

// Methods
const startGame = async (enableSound: boolean) => {
  console.log('Game starting with sound:', enableSound)
  soundEnabled.value = enableSound
  gameStarted.value = true
  await fetchQuestions()
}

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
}

const getShuffledOptions = (question: any) => {
  if (!question?.options) return []
  return [...question.options].sort(() => Math.random() - 0.5)
}

const shuffledOptions = computed(() => {
  return getShuffledOptions(currentQuestion.value)
})

const getOptionClasses = (option: string) => {
  if (!answerSubmitted.value) {
    if (option === selectedOption.value) {
      return 'bg-orange-100 border-2 border-orange-400 text-orange-600'
    }
    return 'bg-white hover:bg-orange-50 border-2 border-transparent hover:border-orange-300'
  }

  if (option === currentQuestion.value.correct_answer) {
    return 'bg-green-100 text-green-800 border-2 border-green-400'
  }

  if (option === selectedOption.value) {
    return 'bg-orange-100 text-orange-800 border-2 border-orange-400'
  }

  return 'bg-white/50 opacity-50 border-2 border-transparent'
}

const selectOption = (option: string) => {
  if (!answerSubmitted.value) {
    selectedOption.value = option
  }
}

const submitAnswer = () => {
  if (answerSubmitted.value || !selectedOption.value) return

  answerSubmitted.value = true
  const isCorrect = selectedOption.value === currentQuestion.value.correct_answer
  
  // Show feedback
  feedbackState.value = {
    isCorrect,
    show: true
  }
  
  if (isCorrect) {
    score.value++
  }
  answerResults.value.push(isCorrect)
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    answerSubmitted.value = false
    selectedOption.value = null
    feedbackState.value.show = false
  } else {
    gameComplete.value = true
  }
}

const generateShareText = () => {
  const date = new Date(gameDate.value)
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
  
  const results = answerResults.value
    .map(result => result ? '🟩' : '🟥')
    .join('')
    
  const baseUrl = window.location.origin
  
  return `TriviYall ${dateStr}\n${score.value}/${questions.length}\n\n${results}\n\nPlay today's TriviYall at ${baseUrl}`
}

const copyToClipboard = async () => {
  const text = generateShareText()
  
  try {
    await navigator.clipboard.writeText(text)
    shareSuccessMessage.value = 'Results copied to clipboard!'
    showShareSuccess.value = true
    setTimeout(() => {
      showShareSuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
    alert('Failed to copy results to clipboard')
  }
}

const nativeShare = async () => {
  const text = generateShareText()
  const shareData = {
    title: 'TriviYall Results',
    text: text,
    url: window.location.origin
  }

  try {
    await navigator.share(shareData)
    shareSuccessMessage.value = 'Shared successfully!'
    showShareSuccess.value = true
    setTimeout(() => {
      showShareSuccess.value = false
    }, 2000)
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error sharing:', err)
      await copyToClipboard()
    }
  }
}

const restartGame = () => {
  currentQuestionIndex.value = 0
  score.value = 0
  answerSubmitted.value = false
  gameComplete.value = false
  answerResults.value = []
  selectedOption.value = null
  feedbackState.value.show = false
  fetchQuestions()
}

// Modify fetchQuestions to use debug date when available
const fetchQuestions = async () => {
  try {
    console.log('Fetching questions...')
    loading.value = true

    // Use debug date in development mode, or current date in production
    const targetDate = isDevelopment ? new Date(debugDate.value) : new Date()
    const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay()
    
    console.log('Target date:', targetDate.toISOString())
    console.log('Day of week:', dayOfWeek)
    
    // First, get the current active week
    const { data: weekData, error: weekError } = await supabase
      .from('weeks')
      .select('id')
      .lte('start_date', targetDate.toISOString().split('T')[0])
      .order('start_date', { ascending: false })
      .limit(1)
      .single()

    console.log('Week data:', weekData)
    if (weekError) throw weekError
    if (!weekData) throw new Error('No active week found')

    // Then, get the question set for today
    const { data: setData, error: setError } = await supabase
      .from('question_sets')
      .select('id')
      .eq('week_id', weekData.id)
      .eq('day_number', dayOfWeek)
      .single()

    console.log('Set data:', setData)
    if (setError) throw setError
    if (!setData) throw new Error('No question set found for today')

    // Get questions for this set
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('set_id', setData.id)

    console.log('Question data:', questionData)
    if (questionError) throw questionError
    if (!questionData?.length) throw new Error('No questions found for today')
    if (questionData.length !== 5) throw new Error(`Invalid number of questions: ${questionData.length} (expected 5)`)
    
    // Transform the questions to handle jsonb options field
    questions.value = questionData.map(q => ({
      ...q,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options)
    }))
    
    gameDate.value = targetDate.toISOString()
    
    await new Promise(resolve => setTimeout(resolve, 1500))
  } catch (error) {
    console.error('Error fetching questions:', error)
    alert('Error loading questions: ' + (error instanceof Error ? error.message : 'Unknown error'))
  } finally {
    console.log('Loading complete')
    loading.value = false
  }
}

// Check if the Web Share API is available
onMounted(() => {
  canNativeShare.value = !!navigator.share
})
</script>