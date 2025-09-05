<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">待办事项管理</h1>
        <p class="text-gray-600">登录您的账户</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-gray-700">用户名</span>
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.username }"
            required
          />
          <label v-if="errors.username" class="label">
            <span class="label-text-alt text-red-500">{{ errors.username }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-gray-700">密码</span>
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.password }"
            required
          />
          <label v-if="errors.password" class="label">
            <span class="label-text-alt text-red-500">{{ errors.password }}</span>
          </label>
        </div>

        <div v-if="errorMessage" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          还没有账户？
          <NuxtLink to="/register" class="text-blue-600 hover:text-blue-800 font-medium">
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
import { useAuthStore } from '../../stores/auth'

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