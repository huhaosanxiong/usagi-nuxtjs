import { getTodos, createTodo } from '../../../utils/models'
import { verifyToken } from '../../../utils/models'

export default defineEventHandler(async (event) => {
  // 获取认证令牌
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

  // 处理GET请求 - 获取所有待办事项
  if (getMethod(event) === 'GET') {
    try {
      const todos = await getTodos(userId)
      return {
        success: true,
        data: todos
      }
    } catch (error) {
      console.error('获取待办事项错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '获取待办事项失败'
      })
    }
  }

  // 处理POST请求 - 创建新的待办事项
  if (getMethod(event) === 'POST') {
    const body = await readBody(event)
    const { title, description, priority, due_date } = body

    if (!title) {
      throw createError({
        statusCode: 400,
        statusMessage: '待办事项标题不能为空'
      })
    }

    try {
      const todo = await createTodo(userId, title, description, priority, due_date)
      return {
        success: true,
        message: '待办事项创建成功',
        data: todo
      }
    } catch (error) {
      console.error('创建待办事项错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '创建待办事项失败'
      })
    }
  }
})