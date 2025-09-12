import { updateTodo, verifyToken } from '../../../utils/models'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = {
      statusCode: 401,
      message: '未授权访问'
    }
    throw createError(error)
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  if (!decoded) {
    const error = {
      statusCode: 401,
      message: '无效的令牌'
    }
    throw createError(error)
  }

  const userId = decoded.userId
  const todoId = getRouterParam(event, 'id')
  
  if (!todoId || isNaN(Number(todoId))) {
    const error = {
      statusCode: 400,
      message: '无效的待办事项ID'
    }
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
      throw createError(error)
    }

    const result = {
      success: true,
      message: '待办事项更新成功',
      data: updatedTodo
    }
    
    return result
  } catch (error: any) {
    console.error('更新待办事项错误:', error)
    // 如果是已经创建的错误，记录日志并重新抛出
    if (error.statusCode) {
      throw error
    }
    // 否则创建新的错误
    const newError = {
      statusCode: 500,
      message: '更新待办事项失败'
    }
    throw createError(newError)
  }
})