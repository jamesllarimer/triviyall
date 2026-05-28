export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: string
  category_id: string
  set_id: string | null
  is_available: boolean
  last_used_date: string | null
  created_at: string
}

export interface QuestionSet {
  id: string
  is_auto_generated: boolean
  week_id: string | null
  day_number: number | null
  created_at: string
  questions?: Question[]
  week?: { id: string; start_date: string } | null
}

export interface Week {
  id: string
  start_date: string
  created_at: string
}

export interface FMKPrompt {
  id: string
  scheduled_date: string
  option_a: string
  option_b: string
  option_c: string
  created_at: string
}

export interface GameAnswer {
  question_id: string
  selected_answer: string
  correct_answer: string
  is_correct: boolean
}

export interface GameHistoryEntry {
  id: string
  user_id: string
  score: number
  total_questions: number
  question_set_id: string
  answers: GameAnswer[]
  played_at: string
}

export interface Profile {
  id: string
  role: 'admin' | 'user'
  created_at: string
}

export interface UserStats {
  games_played: number
  average_score: number
  best_score: number
  total_score: number
}
