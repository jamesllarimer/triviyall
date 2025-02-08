import Anthropic from '@anthropic-ai/sdk';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!config.claudeApiKey) {
    console.error('Claude API key is missing')
    throw createError({
      statusCode: 500,
      message: 'Claude API key is not configured'
    })
  }

  try {
    const anthropic = new Anthropic({
      apiKey: config.claudeApiKey
    });

    console.log('Making request to Claude API...')
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",  // Updated model name
      max_tokens: 1024,
      messages: [{ role: "user", content: body.messages[0].content }]
    });

    console.log('Claude API response:', response)
    return response
  } catch (error) {
    console.error('Detailed Claude API error:', error)
    throw createError({
      statusCode: error.status || 500,
      message: error.message || 'Failed to communicate with Claude API',
      cause: error
    })
  }
})
