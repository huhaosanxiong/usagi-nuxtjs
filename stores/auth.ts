import { defineStore } from 'pinia'
import type { AuthState } from '../types'

// 全局变量声明
declare const $fetch: any
declare const navigateTo: any

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    setAuth(user: any, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
      // 保存到localStorage
      try {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      } catch (error) {
        console.error('保存认证信息到localStorage失败:', error)
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      // 清除localStorage
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (error) {
        console.error('清除localStorage认证信息失败:', error)
      }
    },

    // 从localStorage恢复认证状态
    restoreAuth() {
      try {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          this.user = JSON.parse(user)
          this.token = token
          this.isAuthenticated = true
        }
      } catch (error) {
        console.error('从localStorage恢复认证状态失败:', error)
        // 如果localStorage访问失败，清除认证状态
        this.clearAuth()
      }
    },

    async login(username: string, password: string) {
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { username, password }
        })

        if (response.success) {
          this.setAuth(response.data.user, response.data.token)
          return response
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error: any) {
        this.clearAuth()
        // Nuxt 4 错误处理：检查错误响应数据
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message)
        } else if (error.response?.status === 401) {
          throw new Error('用户名或密码错误')
        } else if (error.response?.status === 400) {
          throw new Error('请求参数错误')
        } else if (error.response?.status === 500) {
          throw new Error('服务器内部错误，请稍后重试')
        } else if (error.message?.includes('fetch')) {
          throw new Error('网络连接错误，请检查网络')
        } else {
          throw new Error(error.message || '登录失败，请稍后重试')
        }
      }
    },

    async register(username: string, email: string, password: string) {
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: { username, email, password }
        })

        if (response.success) {
          this.setAuth(response.data.user, response.data.token)
          return response
        } else {
          throw new Error(response.message || '注册失败')
        }
      } catch (error: any) {
        this.clearAuth()
        // Nuxt 4 错误处理：检查错误响应数据
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message)
        } else if (error.response?.status === 400) {
          throw new Error('请求参数错误')
        } else if (error.response?.status === 409) {
          throw new Error('用户名或邮箱已存在')
        } else if (error.response?.status === 500) {
          throw new Error('服务器内部错误，请稍后重试')
        } else if (error.message?.includes('fetch')) {
          throw new Error('网络连接错误，请检查网络')
        } else {
          throw new Error(error.message || '注册失败，请稍后重试')
        }
      }
    },

    logout() {
      this.clearAuth()
      navigateTo('/login')
    }
  }
})