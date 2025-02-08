export const useQuestionGenerator = () => {
  const config = useRuntimeConfig()

  const generateWithClaude = async (prompt: string) => {
    try {
      console.log('Calling Claude API via proxy...')
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to generate response')
      }

      const data = await response.json()
      console.log('Claude API response:', data)
      
      return data.content[0].text
    } catch (error) {
      console.error('Error with Claude API:', error)
      throw error
    }
  }

  const generateQuestion = async (category: string) => {
    const prompt = `Generate a trivia question about ${category} with 4 multiple choice options. 
    Format the response as JSON with the following structure:
    {
      "question": "the question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correct_answer": "the correct option"
    }
    Ensure the correct_answer matches exactly one of the options.`

    try {
      const content = await generateWithClaude(prompt)
      if (!content) throw new Error('No response from AI service')

      return JSON.parse(content)
    } catch (error) {
      console.error('Error generating question:', error)
      throw error
    }
  }

  const findSimilarQuestions = (newQuestion: string, existingQuestions: any[]) => {
    return existingQuestions.filter(q => {
      const similarity = calculateSimilarity(newQuestion.toLowerCase(), q.question.toLowerCase())
      return similarity > 0.8 // 80% similarity threshold
    })
  }

  const calculateSimilarity = (str1: string, str2: string) => {
    const set1 = new Set(str1.split(' '))
    const set2 = new Set(str2.split(' '))
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    return intersection.size / union.size
  }

  return {
    generateQuestion,
    findSimilarQuestions
  }
}
