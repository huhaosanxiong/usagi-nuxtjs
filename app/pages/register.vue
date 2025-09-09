<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    <div class="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md border border-white/20 p-8">
      <div class="text-center mb-10">
        <div class="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">创建账户</h1>
        <p class="text-gray-600 text-lg">加入我们，开启高效工作之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
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
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="请输入用户名"
            />
          </div>
          <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <input
              id="email"
              v-model="email"
              type="email"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="请输入邮箱"
            />
          </div>
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
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
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="请输入密码（至少6位）"
            />
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="请再次输入密码"
            />
          </div>
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
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
          class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {{ loading ? '注册中...' : '立即注册' }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-gray-600">
          已有账户？
          <NuxtLink to="/login" class="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors duration-200">
            立即登录
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
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateForm = () => {
  errors.value = { username: '', email: '', password: '', confirmPassword: '' }
  let isValid = true

  if (!username.value.trim()) {
    errors.value.username = '用户名不能为空'
    isValid = false
  }

  if (!email.value.trim()) {
    errors.value.email = '邮箱不能为空'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = '邮箱格式不正确'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = '密码不能为空'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = '密码长度至少为6位'
    isValid = false
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = '请确认密码'
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.register(username.value, email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || '注册失败，请稍后重试'
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