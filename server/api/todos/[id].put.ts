import { updateTodo, verifyToken } from '../../../utils/models'
import { logApiRequest, logApiError } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = {
      statusCode: 401,
      message: '未授权访问'
    }
    logApiError('PUT', `/api/todos/${getRouterParam(event, 'id')}`, null, error)
    throw createError(error)
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  if (!decoded) {
    const error = {
      statusCode: 401,
      message: '无效的令牌'
    }
    logApiError('PUT', `/api/todos/${getRouterParam(event, 'id')}`, null, error)
    throw createError(error)
  }

  const userId = decoded.userId
  const todoId = getRouterParam(event, 'id')
  
  if (!todoId || isNaN(Number(todoId))) {
    const error = {
      statusCode: 400,
      message: '无效的待办事项ID'
    }
    logApiError('PUT', `/api/todos/${todoId}`, null, error, userId)
    throw createError(error)
  }

  const body = await readBody(event)
  const { title, description, status, priority, due_date } = body

  try {
    const updatedTodo = await updateTodo(Number(todoId), userId, {
      title,
      description,
      status,
      priority,
      due_date
    })

    if (!updatedTodo) {
      const error = {
        statusCode: 404,
        message: '待办事项不存在'
      }
      logApiError('PUT', `/api/todos/${todoId}`, body, error, userId)
      throw createError(error)
    }

    const result = {
      success: true,
      message: '待办事项更新成功',
      data: updatedTodo
    }
    
    // 记录成功日志
    logApiRequest('PUT', `/api/todos/${todoId}`, body, result, userId)
    
    return result
  } catch (error) {
    console.error('更新待办事项错误:', error)
    // 如果是已经创建的错误，记录日志并重新抛出
    if (error.statusCode) {
      logApiError('PUT', `/api/todos/${todoId}`, body, error, userId)
      throw error
    }
    // 否则创建新的错误
    const newError = {
      statusCode: 500,
      message: '更新待办事项失败'
    }
    logApiError('PUT', `/api/todos/${todoId}`, body, newError, userId)
    throw createError(newError)
  }
})