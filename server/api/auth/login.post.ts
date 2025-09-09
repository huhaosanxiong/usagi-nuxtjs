import { getUserByUsername, verifyPassword, generateToken } from '../../../utils/models'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: '用户名和密码不能为空'
    })
  }

  try {
    // 查找用户
    const user = await getUserByUsername(username)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: '用户名或密码错误'
      })
    }

    // 生成令牌
    const token = generateToken(user.id)

    return {
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
  } catch (error: any) {
    console.error('登录错误:', error)
    // 如果是已经创建的错误，直接抛出
    if (error.statusCode) {
      throw error
    }
    // 否则创建新的错误
    throw createError({
      statusCode: 500,
      message: '登录失败，请稍后重试'
    })
  }
})