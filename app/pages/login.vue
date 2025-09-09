<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    <div class="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md border border-white/20 p-8">
      <div class="text-center mb-10">
        <div class="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">欢迎回来</h1>
        <p class="text-gray-600 text-lg">登录您的账户，开始高效管理</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <input
              id="username"
              v-model="username"
              type="text"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="请输入用户名"
            />
          </div>
          <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="请输入密码"
            />
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {{ loading ? '登录中...' : '立即登录' }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-gray-600">
          还没有账户？
          <NuxtLink to="/register" class="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
            立即注册
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({
  username: '',
  password: ''
})

const validateForm = () => {
  errors.value = { username: '', password: '' }
  let isValid = true

  if (!username.value.trim()) {
    errors.value.username = '用户名不能为空'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = '密码不能为空'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(username.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    console.error('登录错误详情:', error)
    console.error('错误响应:', error.response?.data)
    console.error('错误消息:', error.message)
    errorMessage.value = error.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

// 页面加载时恢复认证状态
onMounted(() => {
  authStore.restoreAuth()
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
})
</script>