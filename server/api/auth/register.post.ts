import { createUser, getUserByUsername, getUserByEmail, verifyPassword, generateToken } from '../../../utils/models'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body

  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: '用户名、邮箱和密码不能为空'
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: '密码长度至少为6位'
    })
  }

  try {
    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: '用户名已存在'
      })
    }

    // 检查邮箱是否已存在
    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      throw createError({
        statusCode: 400,
        statusMessage: '邮箱已被注册'
      })
    }

    // 创建用户
    const user = await createUser(username, email, password)
    const token = generateToken(user.id)

    return {
      success: true,
      message: '注册成功',
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
    console.error('注册错误:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '注册失败，请稍后重试'
    })
  }
})