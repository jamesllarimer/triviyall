// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    claudeApiKey: process.env.CLAUDE_API_KEY, // Move to private server config
    public: {
      appName: 'TriviYall',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    }
  },

  app: {
    head: {
      title: 'TriviYall',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  compatibilityDate: '2025-02-01'
})