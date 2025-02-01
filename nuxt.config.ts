// nuxt.config.ts
export default defineNuxtConfig({
  modules: [],

  css: ['~/assets/css/tailwind.css'],

  runtimeConfig: {
    public: {
      appName: 'TriviYall',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY
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

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})