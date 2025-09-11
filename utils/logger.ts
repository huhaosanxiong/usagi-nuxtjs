import fs from 'fs'
import path from 'path'

// 确保日志目录存在
const logDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// 日志文件路径
const logFile = path.join(logDir, 'api.log')

/**
 * 记录API请求日志
 * @param method HTTP方法
 * @param url 请求URL
 * @param params 请求参数
 * @param result 返回结果
 * @param userId 用户ID（如果有）
 */
export function logApiRequest(method: string, url: string, params: any, result: any, userId?: number) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    method,
    url,
    userId,
    params: sanitizeParams(params),
    result: sanitizeResult(result)
  }
  
  // 写入日志文件
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n')
  
  // 同时输出到控制台（可选）
  console.log(`[API Log] ${method} ${url}`, {
    userId,
    params: logEntry.params,
    result: logEntry.result
  })
}

/**
 * 记录API错误日志
 * @param method HTTP方法
 * @param url 请求URL
 * @param params 请求参数
 * @param error 错误信息
 * @param userId 用户ID（如果有）
 */
export function logApiError(method: string, url: string, params: any, error: any, userId?: number) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    method,
    url,
    userId,
    params: sanitizeParams(params),
    error: {
      message: error.message || String(error),
      statusCode: error.statusCode || 500
    }
  }
  
  // 写入日志文件
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n')
  
  // 同时输出到控制台
  console.error(`[API Error] ${method} ${url}`, {
    userId,
    params: logEntry.params,
    error: logEntry.error
  })
}

/**
 * 清理参数，避免记录敏感信息
 */
function sanitizeParams(params: any) {
  if (!params) return params
  
  const sanitized = { ...params }
  
  // 删除敏感字段
  delete sanitized.password
  delete sanitized.token
  delete sanitized.authorization
  
  return sanitized
}

/**
 * 清理返回结果，避免记录敏感信息
 */
function sanitizeResult(result: any) {
  if (!result) return result
  
  const sanitized = { ...result }
  
  // 删除敏感字段
  if (sanitized.data && typeof sanitized.data === 'object') {
    const sanitizedData = { ...sanitized.data }
    delete sanitizedData.token
    delete sanitizedData.password_hash
    sanitized.data = sanitizedData
  }
  
  return sanitized
}