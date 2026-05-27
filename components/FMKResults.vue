<template>
  <div class="w-full max-w-lg space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-white drop-shadow-lg">Community Results</h2>
      <p class="text-orange-100 mt-1">{{ totalResponses }} {{ totalResponses === 1 ? 'player' : 'players' }} have responded</p>
    </div>

    <div v-if="loading" class="text-center text-white">Loading results...</div>

    <div v-else class="space-y-4">
      <div
        v-for="slot in slots"
        :key="slot.label"
        class="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <span class="text-xl">{{ slot.emoji }}</span>
            <span class="font-bold text-gray-900">{{ slot.label }}</span>
          </div>
          <span
            :class="slot.isUserChoice ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'"
            class="px-2.5 py-0.5 rounded-full text-sm font-semibold"
          >
            {{ slot.pct }}%
          </span>
        </div>

        <p class="text-gray-700 font-medium">{{ slot.chosenOption }}</p>

        <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            :style="{ width: slot.pct + '%' }"
            :class="slot.barColor"
            class="h-2 rounded-full transition-all duration-700"
          />
        </div>

        <p v-if="slot.isUserChoice" class="text-xs text-orange-600 font-medium mt-1">Your pick</p>
      </div>
    </div>

    <!-- Share -->
    <div class="flex justify-center">
      <button
        v-if="canNativeShare"
        @click="nativeShare"
        class="inline-flex items-center px-6 py-3 border-2 border-white text-base font-bold rounded-full text-white hover:bg-white/10 transition-all duration-200"
      >
        Share Results
      </button>
      <button
        v-else
        @click="copyToClipboard"
        class="inline-flex items-center px-6 py-3 border-2 border-white text-base font-bold rounded-full text-white hover:bg-white/10 transition-all duration-200"
      >
        Copy Results 📋
      </button>
    </div>

    <div
      v-if="showShareSuccess"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-full text-base font-medium shadow-lg"
    >
      {{ shareSuccessMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  prompt: { id: string; option_a: string; option_b: string; option_c: string; scheduled_date: string }
  userChoices: { fuck_choice: string; marry_choice: string; kill_choice: string }
}>()

const supabase = useSupabase()

const loading = ref(true)
const allResponses = ref<{ fuck_choice: string; marry_choice: string; kill_choice: string }[]>([])
const canNativeShare = ref(false)
const showShareSuccess = ref(false)
const shareSuccessMessage = ref('')

const totalResponses = computed(() => allResponses.value.length)

const countPct = (field: 'fuck_choice' | 'marry_choice' | 'kill_choice', option: string) => {
  if (totalResponses.value === 0) return 0
  const count = allResponses.value.filter(r => r[field] === option).length
  return Math.round((count / totalResponses.value) * 100)
}

const slots = computed(() => [
  {
    label: 'Fuck',
    emoji: '💋',
    field: 'fuck_choice' as const,
    chosenOption: props.userChoices.fuck_choice,
    pct: countPct('fuck_choice', props.userChoices.fuck_choice),
    isUserChoice: true,
    barColor: 'bg-red-400'
  },
  {
    label: 'Marry',
    emoji: '💍',
    field: 'marry_choice' as const,
    chosenOption: props.userChoices.marry_choice,
    pct: countPct('marry_choice', props.userChoices.marry_choice),
    isUserChoice: true,
    barColor: 'bg-green-400'
  },
  {
    label: 'Kill',
    emoji: '🪦',
    field: 'kill_choice' as const,
    chosenOption: props.userChoices.kill_choice,
    pct: countPct('kill_choice', props.userChoices.kill_choice),
    isUserChoice: true,
    barColor: 'bg-gray-400'
  }
])

const generateShareText = () => {
  const date = new Date(props.prompt.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  const baseUrl = window.location.origin
  const f = slots.value[0]
  const m = slots.value[1]
  const k = slots.value[2]

  return `F, Marry, Kill 📅 ${date}\n💋 F: ${f.chosenOption} (${f.pct}% agreed)\n💍 Marry: ${m.chosenOption} (${m.pct}% agreed)\n🪦 Kill: ${k.chosenOption} (${k.pct}% agreed)\nPlay at ${baseUrl}/fmk`
}

const showSuccess = (msg: string) => {
  shareSuccessMessage.value = msg
  showShareSuccess.value = true
  setTimeout(() => { showShareSuccess.value = false }, 2000)
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generateShareText())
    showSuccess('Results copied to clipboard!')
  } catch {
    alert('Failed to copy results to clipboard')
  }
}

const nativeShare = async () => {
  try {
    await navigator.share({ title: 'F, Marry, Kill', text: generateShareText() })
    showSuccess('Shared successfully!')
  } catch (err: any) {
    if (err.name !== 'AbortError') await copyToClipboard()
  }
}

onMounted(async () => {
  canNativeShare.value = !!navigator.share
  try {
    const { data, error } = await supabase
      .from('fmk_responses')
      .select('fuck_choice, marry_choice, kill_choice')
      .eq('prompt_id', props.prompt.id)
    if (error) throw error
    allResponses.value = data ?? []
  } catch (err) {
    console.error('Error fetching FMK results:', err)
  } finally {
    loading.value = false
  }
})
</script>
