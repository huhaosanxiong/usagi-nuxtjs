// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'node-server'
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['./public/css/main.css']
})
