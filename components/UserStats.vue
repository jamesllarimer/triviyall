<template>
  <div class="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
    <div class="px-4 py-5 sm:px-6 bg-gray-50">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Game Statistics</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Your overall performance</p>
    </div>

    <div class="border-t border-gray-200">
      <dl>
        <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Games Played</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.gamesPlayed }}</dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Average Score</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.averageScore }}/5</dd>
        </div>
        <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Best Score</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.bestScore }}/5</dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Total Points</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.totalScore }}</dd>
        </div>
        <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Last Played</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.lastPlayed }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ userId: string }>()

const supabase = useSupabase()

const stats = ref({
  gamesPlayed: 0,
  averageScore: '0.0',
  bestScore: 0,
  totalScore: 0,
  lastPlayed: 'Never'
})

const fetchStats = async () => {
  try {
    const { data, error } = await supabase
      .from('game_history')
      .select('score, played_at')
      .eq('user_id', props.userId)

    if (error) throw error
    if (!data || data.length === 0) return

    const scores = data.map(g => g.score)
    const total = scores.reduce((sum, s) => sum + s, 0)
    const lastDate = data
      .map(g => g.played_at)
      .sort()
      .at(-1)

    stats.value = {
      gamesPlayed: data.length,
      averageScore: (total / data.length).toFixed(1),
      bestScore: Math.max(...scores),
      totalScore: total,
      lastPlayed: lastDate
        ? new Date(lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Never'
    }
  } catch (err) {
    console.error('Error fetching user stats:', err)
  }
}

onMounted(fetchStats)
</script>
