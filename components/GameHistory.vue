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
              {{ stats.average_score ? `${stats.average_score}%` : '-' }}
            </dd>
          </div>
        </div>
  
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Best Score</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ stats.best_score ? `${stats.best_score}%` : '-' }}
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
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Games</h3>
        </div>
        <div class="border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Results
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="game in recentGames" :key="game.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(game.played_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ game.score }}/{{ game.total_questions }}
                    ({{ Math.round((game.score / game.total_questions) * 100) }}%)
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-1">
                      <div v-for="(answer, index) in game.answers" :key="index"
                           class="w-6 h-6 flex items-center justify-center rounded"
                           :class="answer.correct ? 'bg-green-100' : 'bg-red-100'">
                        <span :class="answer.correct ? 'text-green-600' : 'text-red-600'">
                          {{ answer.correct ? '✓' : '✗' }}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="recentGames.length === 0">
                  <td colspan="3" class="px-6 py-4 text-sm text-gray-500 text-center">
                    No games played yet
                  </td>
                </tr>
              </tbody>
            </table>
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
  const recentGames = ref<any[]>([])
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
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
  
  const fetchRecentGames = async () => {
    try {
      const { data, error } = await supabase
        .from('game_history')
        .select('*')
        .eq('user_id', props.userId)
        .order('played_at', { ascending: false })
        .limit(10)
  
      if (error) throw error
      recentGames.value = data || []
    } catch (error) {
      console.error('Error fetching recent games:', error)
    }
  }
  
  // Refresh data periodically
  let refreshInterval: any
  
  onMounted(() => {
    fetchGameStats()
    fetchRecentGames()
    
    // Refresh every 5 minutes
    refreshInterval = setInterval(() => {
      fetchGameStats()
      fetchRecentGames()
    }, 5 * 60 * 1000)
  })
  
  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  })
  </script>