// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'node-server'
  },
  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url))
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['@/public/css/main.css']
})
