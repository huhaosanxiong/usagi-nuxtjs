import { getUserByUsername, verifyPassword, generateToken } from '../../../utils/models'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: '用户名和密码不能为空'
    })
  }

  try {
    // 查找用户
    const user = await getUserByUsername(username)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: '用户名或密码错误'
      })
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: '用户名或密码错误'
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
  } catch (error) {
    console.error('登录错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '登录失败，请稍后重试'
    })
  }
})