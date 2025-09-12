import { createUser, getUserByUsername, getUserByEmail, verifyPassword, generateToken } from '../../../utils/models'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body

  if (!username || !email || !password) {
    const error = {
      statusCode: 400,
      message: '用户名、邮箱和密码不能为空'
    }
    throw createError(error)
  }

  if (password.length < 6) {
    const error = {
      statusCode: 400,
      message: '密码长度至少为6位'
    }
    throw createError(error)
  }

  try {
    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      const error = {
        statusCode: 400,
        message: '用户名已存在'
      }
      throw createError(error)
    }

    // 检查邮箱是否已存在
    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      const error = {
        statusCode: 400,
        message: '邮箱已被注册'
      }
      throw createError(error)
    }

    // 创建用户
    const user = await createUser(username, email, password)
    const token = generateToken(user.id)

    const result = {
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
    
    return result
  } catch (error: any) {
    console.error('注册错误:', error)
    // 如果是已经创建的错误，记录日志并重新抛出
    if (error.statusCode) {
      throw error
    }
    // 否则创建新的错误
    const newError = {
      statusCode: 500,
      message: '注册失败，请稍后重试'
    }
    throw createError(newError)
  }
})