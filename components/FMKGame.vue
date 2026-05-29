<template>
  <div class="w-full max-w-lg space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-white drop-shadow-lg">F, Marry, Kill</h2>
      <p class="text-orange-100 mt-1">Tap a card, then assign it</p>
    </div>

    <!-- Option Cards -->
    <div class="space-y-3">
      <button
        v-for="key in (['a', 'b', 'c'] as const)"
        :key="key"
        @click="selectOption(key)"
        :class="[
          'w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all duration-150 border-2 shadow-sm',
          cardClasses(key)
        ]"
      >
        <div class="flex items-center justify-between">
          <span>{{ prompt[`option_${key}` as keyof typeof prompt] }}</span>
          <span v-if="assignments[key]" :class="badgeClasses(assignments[key]!)" class="ml-3 px-2.5 py-0.5 rounded-full text-sm font-bold shrink-0">
            {{ assignments[key] }}
          </span>
        </div>
      </button>
    </div>

    <!-- Assignment Buttons -->
    <div class="flex justify-center space-x-4">
      <button
        v-for="label in (['F', 'M', 'K'] as const)"
        :key="label"
        @click="assign(label)"
        :disabled="selectedOption === null"
        :class="[
          'w-16 h-16 rounded-full text-white font-bold text-lg transition-all duration-150 shadow-md',
          selectedOption !== null ? assignButtonActive(label) : 'bg-white/30 text-white/50 cursor-not-allowed'
        ]"
      >
        {{ label }}
      </button>
    </div>

    <!-- Submit -->
    <div class="flex justify-center">
      <button
        @click="submit"
        :disabled="!allAssigned || submitting"
        :class="[
          'px-8 py-3 rounded-full text-base font-bold transition-all duration-150 shadow-lg',
          allAssigned && !submitting
            ? 'bg-white text-orange-600 hover:bg-orange-50 transform hover:scale-105'
            : 'bg-white/30 text-white/50 cursor-not-allowed'
        ]"
      >
        {{ submitting ? 'Submitting...' : 'Submit' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type OptionKey = 'a' | 'b' | 'c'
type Assignment = 'F' | 'M' | 'K'

const props = defineProps<{
  prompt: { id: string; option_a: string; option_b: string; option_c: string }
}>()

const emit = defineEmits<{
  (e: 'submitted', choices: { fuck_choice: string; marry_choice: string; kill_choice: string }): void
}>()

const supabase = useSupabase()
const { user } = useAuth()

const selectedOption = ref<OptionKey | null>(null)
const assignments = ref<Record<OptionKey, Assignment | null>>({ a: null, b: null, c: null })
const submitting = ref(false)

const allAssigned = computed(() => (Object.values(assignments.value) as (Assignment | null)[]).every(v => v !== null))

const optionText = (key: OptionKey) => props.prompt[`option_${key}` as keyof typeof props.prompt] as string

const selectOption = (key: OptionKey) => {
  selectedOption.value = selectedOption.value === key ? null : key
}

const assign = (label: Assignment) => {
  if (selectedOption.value === null) return
  const key = selectedOption.value

  // Remove this label from any other card that already has it
  for (const k of (['a', 'b', 'c'] as OptionKey[])) {
    if (k !== key && assignments.value[k] === label) {
      assignments.value[k] = null
    }
  }

  assignments.value[key] = label
  selectedOption.value = null
}

const cardClasses = (key: OptionKey) => {
  const isSelected = selectedOption.value === key
  const assignment = assignments.value[key]

  if (isSelected) return 'bg-white border-orange-400 text-orange-700 scale-[1.02]'
  if (assignment === 'F') return 'bg-red-50 border-red-400 text-red-800'
  if (assignment === 'M') return 'bg-green-50 border-green-400 text-green-800'
  if (assignment === 'K') return 'bg-gray-100 border-gray-400 text-gray-700'
  return 'bg-white/90 border-transparent text-gray-800 hover:bg-white hover:border-orange-300'
}

const badgeClasses = (label: Assignment) => {
  if (label === 'F') return 'bg-red-500 text-white'
  if (label === 'M') return 'bg-green-500 text-white'
  return 'bg-gray-500 text-white'
}

const assignButtonActive = (label: Assignment) => {
  if (label === 'F') return 'bg-red-500 hover:bg-red-600'
  if (label === 'M') return 'bg-green-500 hover:bg-green-600'
  return 'bg-gray-500 hover:bg-gray-600'
}

const submit = async () => {
  if (!allAssigned.value || submitting.value) return
  submitting.value = true

  const findOption = (label: Assignment): string => {
    const key = (Object.entries(assignments.value) as [OptionKey, Assignment | null][]).find(([, v]) => v === label)?.[0]
    return key ? optionText(key) : ''
  }

  const choices = {
    fuck_choice: findOption('F'),
    marry_choice: findOption('M'),
    kill_choice: findOption('K')
  }

  try {
    const { error } = await supabase.from('fmk_responses').insert({
      prompt_id: props.prompt.id,
      user_id: user.value?.id ?? null,
      ...choices
    })
    if (error) throw error
    emit('submitted', choices)
  } catch (err) {
    console.error('Error submitting FMK response:', err)
    alert('Error submitting your response. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>
