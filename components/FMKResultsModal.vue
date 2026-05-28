<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="close" />

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">F/M/K Results</h2>
            <p class="text-sm text-gray-500 mt-0.5">{{ formattedDate }} · {{ totalResponses }} {{ totalResponses === 1 ? 'response' : 'responses' }}</p>
          </div>
          <button @click="close" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div v-if="loading" class="py-8 text-center text-gray-500">Loading...</div>

        <div v-else-if="totalResponses === 0" class="py-8 text-center text-gray-400">
          No responses yet.
        </div>

        <div v-else class="space-y-5">
          <div v-for="slot in slots" :key="slot.label">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-semibold text-gray-700">{{ slot.emoji }} {{ slot.label }}</span>
            </div>

            <div class="space-y-2">
              <div v-for="option in slot.options" :key="option.text" class="flex items-center space-x-3">
                <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    :style="{ width: option.pct + '%' }"
                    :class="slot.barColor"
                    class="h-5 rounded-full transition-all duration-500"
                  />
                </div>
                <span class="w-8 text-right text-xs font-semibold text-gray-600">{{ option.pct }}%</span>
                <span class="w-32 text-xs text-gray-500 truncate">{{ option.text }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="close"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FMKPrompt } from '~/types'

const props = defineProps<{
  modelValue: boolean
  prompt: FMKPrompt | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const supabase = useSupabase()

const loading = ref(false)
const responses = ref<{ fuck_choice: string; marry_choice: string; kill_choice: string }[]>([])

const totalResponses = computed(() => responses.value.length)

const formattedDate = computed(() => {
  if (!props.prompt) return ''
  const [year, month, day] = props.prompt.scheduled_date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
})

const countPct = (field: 'fuck_choice' | 'marry_choice' | 'kill_choice', optionText: string) => {
  if (totalResponses.value === 0) return 0
  const count = responses.value.filter(r => r[field] === optionText).length
  return Math.round((count / totalResponses.value) * 100)
}

const slots = computed(() => {
  if (!props.prompt) return []
  const options = [props.prompt.option_a, props.prompt.option_b, props.prompt.option_c]

  return [
    {
      label: 'Fuck', emoji: '💋', barColor: 'bg-red-400',
      field: 'fuck_choice' as const,
      options: options.map(t => ({ text: t, pct: countPct('fuck_choice', t) }))
    },
    {
      label: 'Marry', emoji: '💍', barColor: 'bg-green-400',
      field: 'marry_choice' as const,
      options: options.map(t => ({ text: t, pct: countPct('marry_choice', t) }))
    },
    {
      label: 'Kill', emoji: '🪦', barColor: 'bg-gray-400',
      field: 'kill_choice' as const,
      options: options.map(t => ({ text: t, pct: countPct('kill_choice', t) }))
    }
  ]
})

const fetchResults = async () => {
  if (!props.prompt) return
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('fmk_responses')
      .select('fuck_choice, marry_choice, kill_choice')
      .eq('prompt_id', props.prompt.id)
    if (error) throw error
    responses.value = data ?? []
  } catch (err) {
    console.error('Error fetching FMK results:', err)
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue, (open) => {
  if (open) fetchResults()
  else responses.value = []
})

const close = () => emit('update:modelValue', false)
</script>
