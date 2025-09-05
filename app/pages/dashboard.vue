<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">我的待办事项</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              欢迎，{{ authStore.getUser?.username }}
            </div>
            <button @click="handleLogout" class="btn btn-ghost btn-sm">
              退出登录
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
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">创建新待办事项</h2>
            
            <form @submit.prevent="handleCreateTodo" class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">标题</span>
                </label>
                <input
                  v-model="newTodo.title"
                  type="text"
                  placeholder="请输入待办事项标题"
                  class="input input-bordered w-full"
                  required
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">描述</span>
                </label>
                <textarea
                  v-model="newTodo.description"
                  placeholder="请输入描述（可选）"
                  class="textarea textarea-bordered w-full"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">优先级</span>
                </label>
                <select v-model="newTodo.priority" class="select select-bordered w-full">
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">截止日期</span>
                </label>
                <input
                  v-model="newTodo.due_date"
                  type="date"
                  class="input input-bordered w-full"
                />
              </div>

              <button type="submit" class="btn btn-primary w-full" :disabled="todoStore.loading">
                <span v-if="todoStore.loading" class="loading loading-spinner"></span>
                {{ todoStore.loading ? '创建中...' : '创建待办事项' }}
              </button>
            </form>
          </div>
        </div>

        <!-- 右侧：待办事项列表 -->
        <div class="lg:col-span-2">
          <!-- 统计信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">全部</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ todoStore.getTodos.length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">进行中</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ todoStore.getInProgressTodos.length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">已完成</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ todoStore.getCompletedTodos.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="todoStore.error" class="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ todoStore.error }}</span>
          </div>

          <!-- 待办事项列表 -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">待办事项列表</h2>
            </div>
            
            <div v-if="todoStore.loading && todoStore.getTodos.length === 0" class="p-6 text-center">
              <div class="loading loading-spinner loading-lg"></div>
              <p class="mt-2 text-gray-600">加载中...</p>
            </div>
            
            <div v-else-if="todoStore.getTodos.length === 0" class="p-6 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">暂无待办事项</h3>
              <p class="mt-1 text-sm text-gray-500">创建您的第一个待办事项吧！</p>
            </div>
            
            <div v-else class="divide-y divide-gray-200">
              <div
                v-for="todo in todoStore.getTodos"
                :key="todo.id"
                class="p-6 hover:bg-gray-50"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-3 flex-1">
                    <div class="flex items-center h-5">
                      <input
                        :checked="todo.status === 'completed'"
                        @change="toggleTodoStatus(todo)"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3
                        class="text-sm font-medium"
                        :class="todo.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'"
                      >
                        {{ todo.title }}
                      </h3>
                      <p
                        v-if="todo.description"
                        class="mt-1 text-sm text-gray-600"
                        :class="todo.status === 'completed' ? 'line-through' : ''"
                      >
                        {{ todo.description }}
                      </p>
                      <div class="mt-2 flex items-center space-x-4">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusClass(todo.status)"
                        >
                          {{ getStatusText(todo.status) }}
                        </span>
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getPriorityClass(todo.priority)"
                        >
                          {{ getPriorityText(todo.priority) }}
                        </span>
                        <span
                          v-if="todo.due_date"
                          class="text-xs text-gray-500"
                        >
                          截止日期：{{ formatDate(todo.due_date) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <button
                      @click="editTodo(todo)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteTodo(todo.id)"
                      class="text-red-600 hover:text-red-800"
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
import { useAuthStore } from '../../stores/auth'
import { useTodoStore } from '../../stores/todos'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

const newTodo = ref({
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
      due_date: newTodo.value.due_date
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
  // 这里可以实现编辑功能，暂时简化处理
  console.log('编辑待办事项:', todo)
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

onMounted(async () => {
  authStore.restoreAuth()
  
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }

  await todoStore.fetchTodos()
})
</script>