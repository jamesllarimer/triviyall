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
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ stats?.games_played || 0 }}
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Average Score</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatScore(stats?.average_score) }}/5
          </dd>
        </div>
        <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Best Score</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ stats?.best_score || 0 }}/5
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Total Score</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ stats?.total_score || 0 }}
          </dd>
        </div>
        <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Last Played</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatDate(stats?.last_played) || 'Never' }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string
}>()

const supabase = useSupabase()
const stats = ref<any>(null)

const formatDate = (date: string | null) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatScore = (score: number | null) => {
  if (score === null) return '0'
  return Number(score).toFixed(1)
}

const fetchStats = async () => {
  try {
    console.log('Fetching stats for user:', props.userId)
    const { data, error } = await supabase
      .rpc('get_user_stats', {
        user_id_param: props.userId
      })

    if (error) throw error
    console.log('Received stats:', data)
    stats.value = data[0] // Function returns array with single row
  } catch (err) {
    console.error('Error fetching user stats:', err)
  }
}

onMounted(() => {
  fetchStats()
})
</script>
