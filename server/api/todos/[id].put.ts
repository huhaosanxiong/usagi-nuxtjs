import { updateTodo, verifyToken } from '../../../utils/models'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授权访问'
    })
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: '无效的令牌'
    })
  }

  const userId = decoded.userId
  const todoId = getRouterParam(event, 'id')
  
  if (!todoId || isNaN(Number(todoId))) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的待办事项ID'
    })
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
      throw createError({
        statusCode: 404,
        statusMessage: '待办事项不存在'
      })
    }

    return {
      success: true,
      message: '待办事项更新成功',
      data: updatedTodo
    }
  } catch (error) {
    console.error('更新待办事项错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '更新待办事项失败'
    })
  }
})