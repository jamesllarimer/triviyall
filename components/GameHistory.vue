<!-- components/GameHistory.vue -->
<template>
  <div class="space-y-8">
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Games Played</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.games_played || 0 }}</dd>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Average Score</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ formatScore(stats.average_score) }}/5
          </dd>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Best Score</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ stats.best_score || 0 }}/5
          </dd>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <dt class="text-sm font-medium text-gray-500 truncate">Total Points</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.total_score || 0 }}</dd>
        </div>
      </div>
    </div>

    <!-- Recent Games -->
    <div class="bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="px-4 py-5 sm:px-6 bg-gray-50">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Games</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Your game history</p>
      </div>

      <div class="divide-y divide-gray-200">
        <div v-for="game in games" :key="game.id" class="p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">
              {{ formatDate(game.played_at) }}
            </span>
            <span class="font-medium text-orange-600">
              {{ game.score }}/{{ game.total_questions }}
            </span>
          </div>

          <!-- Answer Pattern -->
          <div class="flex space-x-1">
            <div v-for="(answer, index) in getAnswerPattern(game.answers)" 
                 :key="index"
                 class="w-6 h-6 flex items-center justify-center rounded"
                 :class="answer.is_correct ? 'bg-green-500' : 'bg-orange-500'"
            >
              <span class="text-white text-xs font-bold">
                {{ answer.is_correct ? '✓' : '✗' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="!games.length" class="p-4 text-center text-gray-500">
          No games played yet
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string
}>()

const supabase = useSupabase()
const stats = ref<any>({})
const games = ref<any[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Add formatting helper for average score
const formatScore = (score: number | null) => {
  if (score === null) return '0'
  return Number(score).toFixed(1)
}

// Helper function to process the answers JSONB data
const getAnswerPattern = (answers: any) => {
  if (!answers) return []
  // Make sure we're working with an array
  const answersArray = Array.isArray(answers) ? answers : JSON.parse(answers)
  return answersArray.map(a => ({
    is_correct: a.is_correct
  }))
}

const fetchGameStats = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_stats', {
        user_id_param: props.userId
      })

    if (error) throw error
    stats.value = data[0] || {}
  } catch (error) {
    console.error('Error fetching game stats:', error)
  }
}

const fetchGames = async () => {
  try {
    const { data, error } = await supabase
      .from('game_history')
      .select('*')
      .eq('user_id', props.userId)
      .order('played_at', { ascending: false })
      .limit(10)

    if (error) throw error
    console.log('Fetched games:', data)
    games.value = data
  } catch (err) {
    console.error('Error fetching games:', err)
  }
}

// Refresh data periodically
let refreshInterval: any

onMounted(() => {
  fetchGameStats()
  fetchGames()
  
  // Refresh every 5 minutes
  refreshInterval = setInterval(() => {
    fetchGameStats()
    fetchGames()
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>