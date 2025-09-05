import { defineStore } from 'pinia'
import type { TodoState } from '../types'
import { useAuthStore } from './auth'
// 全局变量声明
declare const $fetch: any

export const useTodoStore = defineStore('todos', {
  state: (): TodoState => ({
    todos: [],
    loading: false,
    error: null
  }),

  getters: {
    getTodos: (state) => state.todos,
    getPendingTodos: (state) => state.todos.filter(todo => todo.status === 'pending'),
    getInProgressTodos: (state) => state.todos.filter(todo => todo.status === 'in_progress'),
    getCompletedTodos: (state) => state.todos.filter(todo => todo.status === 'completed'),
    getTodosByPriority: (state) => (priority: string) => state.todos.filter(todo => todo.priority === priority)
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    async fetchTodos() {
      this.setLoading(true)
      this.setError(null)
      
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('未登录')
        }

        const response = await $fetch('/api/todos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.success) {
          this.todos = response.data
        } else {
          throw new Error(response.message || '获取待办事项失败')
        }
      } catch (error) {
        this.setError(error instanceof Error ? error.message : '获取待办事项失败')
      } finally {
        this.setLoading(false)
      }
    },

    async createTodo(todoData: {
      title: string
      description?: string
      priority?: 'low' | 'medium' | 'high'
      due_date?: string
    }) {
      this.setLoading(true)
      this.setError(null)
      
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('未登录')
        }

        const response = await $fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: todoData
        })

        if (response.success) {
          this.todos.unshift(response.data)
          return response.data
        } else {
          throw new Error(response.message || '创建待办事项失败')
        }
      } catch (error) {
        this.setError(error instanceof Error ? error.message : '创建待办事项失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async updateTodo(id: number, updates: Partial<any>) {
      this.setLoading(true)
      this.setError(null)
      
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('未登录')
        }

        const response = await $fetch(`/api/todos/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: updates
        })

        if (response.success) {
          const index = this.todos.findIndex(todo => todo.id === id)
          if (index !== -1) {
            this.todos[index] = response.data
          }
          return response.data
        } else {
          throw new Error(response.message || '更新待办事项失败')
        }
      } catch (error) {
        this.setError(error instanceof Error ? error.message : '更新待办事项失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async deleteTodo(id: number) {
      this.setLoading(true)
      this.setError(null)
      
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('未登录')
        }

        const response = await $fetch(`/api/todos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.success) {
          this.todos = this.todos.filter(todo => todo.id !== id)
          return true
        } else {
          throw new Error(response.message || '删除待办事项失败')
        }
      } catch (error) {
        this.setError(error instanceof Error ? error.message : '删除待办事项失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    clearTodos() {
      this.todos = []
      this.error = null
    }
  }
})