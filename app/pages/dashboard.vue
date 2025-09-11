<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
    <!-- 顶部导航 -->
    <nav class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">我的待办事项</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
              <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-sm">{{ authStore.getUser?.username?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <span class="text-sm font-medium text-gray-700">欢迎，{{ authStore.getUser?.username }}</span>
            </div>
            <button @click="handleLogout" class="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 px-3 py-2 rounded-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：创建待办事项 -->
        <div class="lg:col-span-1">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-7">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">创建新待办事项</h2>
            </div>
            
            <form @submit.prevent="handleCreateTodo" class="space-y-5">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </div>
                  <input
                    id="title"
                    v-model="newTodo.title"
                    type="text"
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入待办事项标题"
                  />
                </div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">描述</label>
                <div class="relative">
                  <div class="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                    </svg>
                  </div>
                  <textarea
                    id="description"
                    v-model="newTodo.description"
                    rows="3"
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入描述（可选）"
                  ></textarea>
                </div>
              </div>

              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">优先级</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                    </svg>
                  </div>
                  <select
                    id="priority"
                    v-model="newTodo.priority"
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="due_date" class="block text-sm font-medium text-gray-700 mb-2">截止日期</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    id="due_date"
                    v-model="newTodo.due_date"
                    type="date"
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请选择截止日期"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="todoStore.loading"
                class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span>{{ todoStore.loading ? '创建中...' : '创建待办事项' }}</span>
                </div>
              </button>
            </form>
          </div>
        </div>

        <!-- 右侧：待办事项列表 -->
        <div class="lg:col-span-2">
          <!-- 统计信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">全部任务</p>
                  <p class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ todoStore.getTodos.length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">进行中</p>
                  <p class="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{{ todoStore.getInProgressTodos.length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">已完成</p>
                  <p class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{{ todoStore.getCompletedTodos.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="todoStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm text-red-800">{{ todoStore.error }}</p>
            </div>
          </div>

          <!-- 待办事项列表 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                </div>
                <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">待办事项列表</h2>
              </div>
            </div>
            
            <div v-if="todoStore.loading && todoStore.getTodos.length === 0" class="p-12 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-4 text-gray-600 font-medium">加载中...</p>
            </div>
            
            <div v-else-if="todoStore.getTodos.length === 0" class="p-12 text-center">
              <div class="mx-auto w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 class="mt-2 text-lg font-medium text-gray-900">暂无待办事项</h3>
              <p class="mt-2 text-gray-500">创建您的第一个待办事项吧！</p>
            </div>
            
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="todo in todoStore.getTodos"
                :key="todo.id"
                class="p-6 hover:bg-gray-50/50 transition-colors duration-200"
              >
                <!-- 编辑模式 -->
                <div v-if="editingTodo && editingTodo.id === todo.id" class="space-y-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1 space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
                        <input
                          v-model="editForm.title"
                          type="text"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入待办事项标题"
                        />
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
                        <textarea
                          v-model="editForm.description"
                          rows="3"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入描述（可选）"
                        ></textarea>
                      </div>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">优先级</label>
                          <select
                            v-model="editForm.priority"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                          </select>
                        </div>
                        
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">截止日期</label>
                          <input
                            v-model="editForm.due_date"
                            type="date"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div class="flex items-center space-x-2">
                        <button
                          @click="handleUpdateTodo"
                          :disabled="todoStore.loading"
                          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          保存
                        </button>
                        <button
                          @click="cancelEdit"
                          class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 查看模式 -->
                <div v-else class="flex items-start justify-between">
                  <div class="flex items-start space-x-4 flex-1">
                    <div class="flex items-center h-6 mt-1">
                      <input
                        type="checkbox"
                        :checked="todo.status === 'completed'"
                        @change="toggleTodoStatus(todo)"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3
                        class="text-base font-semibold"
                        :class="todo.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'"
                      >
                        {{ todo.title }}
                      </h3>
                      <p
                        v-if="todo.description"
                        class="mt-2 text-sm text-gray-600"
                        :class="todo.status === 'completed' ? 'line-through' : ''"
                      >
                        {{ todo.description }}
                      </p>
                      <div class="mt-3 flex flex-wrap items-center gap-3">
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          :class="getStatusClass(todo.status)"
                        >
                          {{ getStatusText(todo.status) }}
                        </span>
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          :class="getPriorityClass(todo.priority)"
                        >
                          {{ getPriorityText(todo.priority) }}
                        </span>
                        <span
                          v-if="todo.due_date"
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {{ formatDate(todo.due_date) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <button
                      @click="editTodo(todo)"
                      class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200"
                      title="编辑"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteTodo(todo.id)"
                      class="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                      title="删除"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todos'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

const newTodo = ref({
  title: '',
  description: '',
  priority: 'medium',
  due_date: ''
})

const editingTodo = ref(null)
const editForm = ref({
  title: '',
  description: '',
  priority: 'medium',
  due_date: ''
})

const handleCreateTodo = async () => {
  if (!newTodo.value.title.trim()) return

  try {
    await todoStore.createTodo({
      title: newTodo.value.title,
      description: newTodo.value.description,
      priority: newTodo.value.priority,
      due_date: newTodo.value.due_date || null
    })
    
    // 重置表单
    newTodo.value = {
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    }
  } catch (error) {
    console.error('创建待办事项失败:', error)
  }
}

const toggleTodoStatus = async (todo) => {
  const newStatus = todo.status === 'completed' ? 'pending' : 'completed'
  try {
    await todoStore.updateTodo(todo.id, { status: newStatus })
  } catch (error) {
    console.error('更新待办事项状态失败:', error)
  }
}

const editTodo = (todo) => {
  editingTodo.value = todo
  editForm.value = {
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    due_date: todo.due_date ? formatDateForInput(todo.due_date) : ''
  }
}

const handleUpdateTodo = async () => {
  if (!editForm.value.title.trim()) return

  try {
    await todoStore.updateTodo(editingTodo.value.id, {
      title: editForm.value.title,
      description: editForm.value.description,
      priority: editForm.value.priority,
      due_date: editForm.value.due_date || null
    })
    
    // 重置编辑状态
    editingTodo.value = null
    editForm.value = {
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    }
  } catch (error) {
    console.error('更新待办事项失败:', error)
  }
}

const cancelEdit = () => {
  editingTodo.value = null
  editForm.value = {
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  }
}

const deleteTodo = async (id) => {
  if (!confirm('确定要删除这个待办事项吗？')) return

  try {
    await todoStore.deleteTodo(id)
  } catch (error) {
    console.error('删除待办事项失败:', error)
  }
}

const handleLogout = () => {
  authStore.logout()
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return '待处理'
    case 'in_progress':
      return '进行中'
    case 'completed':
      return '已完成'
    default:
      return '未知'
  }
}

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'high':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityText = (priority) => {
  switch (priority) {
    case 'low':
      return '低优先级'
    case 'medium':
      return '中优先级'
    case 'high':
      return '高优先级'
    default:
      return '未知'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 将日期转换为 YYYY-MM-DD 格式用于日期选择器
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(async () => {
  authStore.restoreAuth()
  
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }

  await todoStore.fetchTodos()
})
</script>