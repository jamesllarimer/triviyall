<!-- components/Game.vue -->
<template>
  <div class="w-full max-w-2xl">
    <!-- Content Warning -->
    <ContentWarning 
      v-if="!gameStarted" 
      @proceed="startGame" 
    />

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center">
      <h2 class="text-3xl font-bold text-indigo-600 animate-bounce">
        Get Reeeaaaadyyy!
      </h2>
    </div>

    <!-- Game Content -->
    <template v-else>
      <!-- Sound Toggle -->
      <div class="flex justify-end mb-4">
        <button
          @click="toggleSound"
          class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <span v-if="soundEnabled">🔊</span>
          <span v-else>🔇</span>
          <span>{{ soundEnabled ? 'Mute' : 'Unmute' }}</span>
        </button>
      </div>

      <!-- Game Complete State -->
      <div v-if="gameComplete" class="text-center space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Game Complete!</h2>
        <div class="text-lg text-gray-600">
          You got {{ score }} out of {{ questions.length }} correct!
        </div>
        
        <!-- Result Pattern -->
        <div class="flex justify-center space-x-1 my-4">
          <div v-for="(result, index) in answerResults" :key="index"
            class="w-8 h-8 flex items-center justify-center rounded"
            :class="result ? 'bg-green-500' : 'bg-red-500'"
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
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span class="mr-2">Share</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
          
          <button
            v-else
            @click="copyToClipboard"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span class="mr-2">Copy Results</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>
          
          <button
            @click="restartGame"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
          <span>Score: {{ score }}</span>
        </div>

        <!-- Question -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-medium text-gray-900 mb-4">
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
                'w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors',
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
              class="w-full inline-flex justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Lock In Answer
            </button>
          </div>
        </div>

        <!-- Next Question Button -->
        <div v-if="answerSubmitted && !gameComplete" class="flex justify-end mt-4">
          <button
            @click="nextQuestion"
            class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
      return 'bg-blue-100 border-2 border-blue-400'
    }
    return 'bg-gray-50 hover:bg-gray-100'
  }

  if (option === currentQuestion.value.correct_answer) {
    return 'bg-green-100 text-green-800 border-2 border-green-400'
  }

  if (option === selectedOption.value) {
    return 'bg-red-100 text-red-800 border-2 border-red-400'
  }

  return 'bg-gray-50 opacity-50'
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

const fetchQuestions = async () => {
  try {
    console.log('Fetching questions...')
    loading.value = true

    const now = new Date()
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay()
    console.log('Current day of week:', dayOfWeek)
    
    const { data: weekData, error: weekError } = await supabase
      .from('weeks')
      .select('id')
      .eq('status', 'active')
      .lte('start_date', now.toISOString().split('T')[0])
      .order('start_date', { ascending: false })
      .limit(1)
      .single()

    console.log('Week data:', weekData)
    if (weekError) throw weekError
    if (!weekData) throw new Error('No active week found')

    const { data: setData, error: setError } = await supabase
      .from('question_sets')
      .select('id')
      .eq('week_id', weekData.id)
      .eq('day_number', dayOfWeek)
      .single()

    console.log('Set data:', setData)
    if (setError) throw setError
    if (!setData) throw new Error('No question set found for today')

    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('set_id', setData.id)

    console.log('Question data:', questionData)
    if (questionError) throw questionError
    
    questions.value = questionData || []
    gameDate.value = now.toISOString()
    
    await new Promise(resolve => setTimeout(resolve, 1500))
  } catch (error) {
    console.error('Error fetching questions:', error)
    alert('Error loading questions')
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