<script setup>
// 页面加载时检查认证状态并重定向
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  try {
    authStore.restoreAuth()
    
    if (authStore.isLoggedIn) {
      navigateTo('/dashboard')
    } else {
      navigateTo('/login')
    }
  } catch (error) {
    console.error('认证状态恢复失败:', error)
    // 如果认证状态恢复失败，也重定向到登录页面
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    <div class="relative text-center">
      <div class="mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 animate-pulse">
        <div class="loading loading-spinner loading-lg text-white"></div>
      </div>
      <h1 class="text-3xl font-bold text-white mb-4">正在跳转...</h1>
      <p class="text-white/80 text-lg">请稍候，正在为您准备最佳体验</p>
    </div>
  </div>
</template>