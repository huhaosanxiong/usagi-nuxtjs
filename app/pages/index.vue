<script setup>
// 页面加载时检查认证状态并重定向
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.restoreAuth()
  
  if (authStore.isLoggedIn) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div class="text-center">
      <div class="loading loading-spinner loading-lg"></div>
      <p class="mt-4 text-gray-600">正在跳转...</p>
    </div>
  </div>
</template>