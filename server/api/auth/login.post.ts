import { getUserByUsername, verifyPassword, generateToken } from '../../../utils/models'
import { logApiRequest, logApiError } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    const error = {
      statusCode: 400,
      message: '用户名和密码不能为空'
    }
    logApiError('POST', '/api/auth/login', body, error)
    throw createError(error)
  }

  try {
    // 查找用户
    const user = await getUserByUsername(username)
    if (!user) {
      const error = {
        statusCode: 401,
        message: '用户名或密码错误'
      }
      logApiError('POST', '/api/auth/login', body, error)
      throw createError(error)
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      const error = {
        statusCode: 401,
        message: '用户名或密码错误'
      }
      logApiError('POST', '/api/auth/login', body, error)
      throw createError(error)
    }

    // 生成令牌
    const token = generateToken(user.id)

    const result = {
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    }
    
    // 记录成功日志
    logApiRequest('POST', '/api/auth/login', body, result, user.id)
    
    return result
  } catch (error: any) {
    console.error('登录错误:', error)
    // 如果是已经创建的错误，记录日志并重新抛出
    if (error.statusCode) {
      logApiError('POST', '/api/auth/login', body, error)
      throw error
    }
    // 否则创建新的错误
    const newError = {
      statusCode: 500,
      message: '登录失败，请稍后重试'
    }
    logApiError('POST', '/api/auth/login', body, newError)
    throw createError(newError)
  }
})