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
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      // 清除localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // 从localStorage恢复认证状态
    restoreAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.user = JSON.parse(user)
        this.token = token
        this.isAuthenticated = true
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
      } catch (error) {
        this.clearAuth()
        throw error
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
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    logout() {
      this.clearAuth()
      navigateTo('/login')
    }
  }
})