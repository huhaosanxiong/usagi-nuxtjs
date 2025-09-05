<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">待办事项管理</h1>
        <p class="text-gray-600">创建新账户</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
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
            <span class="label-text text-gray-700">邮箱</span>
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="请输入邮箱"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.email }"
            required
          />
          <label v-if="errors.email" class="label">
            <span class="label-text-alt text-red-500">{{ errors.email }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-gray-700">密码</span>
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码（至少6位）"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.password }"
            required
          />
          <label v-if="errors.password" class="label">
            <span class="label-text-alt text-red-500">{{ errors.password }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-gray-700">确认密码</span>
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.confirmPassword }"
            required
          />
          <label v-if="errors.confirmPassword" class="label">
            <span class="label-text-alt text-red-500">{{ errors.confirmPassword }}</span>
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
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          已有账户？
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
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
import { useAuthStore } from '../../stores/auth'

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