<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold text-white mb-8 drop-shadow-lg">F, Marry, Kill</h1>

    <div v-if="loading" class="text-white text-xl animate-bounce">Loading today's prompt...</div>

    <div v-else-if="!todayPrompt" class="text-center text-white">
      <p class="text-xl mb-2">No F/M/K prompt today!</p>
      <p class="text-orange-100">Check back tomorrow, hunnies.</p>
    </div>

    <template v-else>
      <FMKGame
        v-if="!submitted"
        :prompt="todayPrompt"
        @submitted="onSubmitted"
      />
      <FMKResults
        v-else
        :prompt="todayPrompt"
        :user-choices="userChoices!"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({})

const supabase = useSupabase()
const { user } = useAuth()

const loading = ref(true)
const todayPrompt = ref<any>(null)
const submitted = ref(false)
const userChoices = ref<{ fuck_choice: string; marry_choice: string; kill_choice: string } | null>(null)

const d = new Date()
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

onMounted(async () => {
  try {
    const { data: prompt, error: promptError } = await supabase
      .from('fmk_prompts')
      .select('*')
      .eq('scheduled_date', today)
      .single()

    if (promptError && promptError.code !== 'PGRST116') throw promptError
    if (!prompt) return

    todayPrompt.value = prompt

    // Check if user already responded
    if (user.value) {
      const { data: existing } = await supabase
        .from('fmk_responses')
        .select('fuck_choice, marry_choice, kill_choice')
        .eq('prompt_id', prompt.id)
        .eq('user_id', user.value.id)
        .single()

      if (existing) {
        userChoices.value = existing
        submitted.value = true
      }
    }
  } catch (err) {
    console.error('Error loading FMK prompt:', err)
  } finally {
    loading.value = false
  }
})

const onSubmitted = (choices: { fuck_choice: string; marry_choice: string; kill_choice: string }) => {
  userChoices.value = choices
  submitted.value = true
}
</script>
