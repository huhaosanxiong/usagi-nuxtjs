import { getTodos, createTodo } from '../../../utils/models'
import { verifyToken } from '../../../utils/models'
import { logApiRequest, logApiError } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  // 获取认证令牌
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = {
      statusCode: 401,
      message: '未授权访问'
    }
    logApiError(event.method, '/api/todos', null, error)
    throw createError(error)
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  if (!decoded) {
    const error = {
      statusCode: 401,
      message: '无效的令牌'
    }
    logApiError(event.method, '/api/todos', null, error)
    throw createError(error)
  }

  const userId = decoded.userId

  // 处理GET请求 - 获取所有待办事项
  if (getMethod(event) === 'GET') {
    try {
      const todos = await getTodos(userId)
      const result = {
        success: true,
        data: todos
      }
      
      // 记录成功日志
      logApiRequest('GET', '/api/todos', null, result, userId)
      
      return result
    } catch (error) {
      console.error('获取待办事项错误:', error)
      const newError = {
        statusCode: 500,
        message: '获取待办事项失败'
      }
      logApiError('GET', '/api/todos', null, newError, userId)
      throw createError(newError)
    }
  }

  // 处理POST请求 - 创建新的待办事项
  if (getMethod(event) === 'POST') {
    const body = await readBody(event)
    const { title, description, priority, due_date } = body

    if (!title) {
      const error = {
        statusCode: 400,
        message: '待办事项标题不能为空'
      }
      logApiError('POST', '/api/todos', body, error, userId)
      throw createError(error)
    }

    try {
      const todo = await createTodo(userId, title, description, priority, due_date)
      const result = {
        success: true,
        message: '待办事项创建成功',
        data: todo
      }
      
      // 记录成功日志
      logApiRequest('POST', '/api/todos', body, result, userId)
      
      return result
    } catch (error) {
      console.error('创建待办事项错误:', error)
      const newError = {
        statusCode: 500,
        message: '创建待办事项失败'
      }
      logApiError('POST', '/api/todos', body, newError, userId)
      throw createError(newError)
    }
  }
})