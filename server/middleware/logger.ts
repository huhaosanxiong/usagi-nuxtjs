import winston from 'winston'
import path from 'path'
import fs from 'fs'

// 创建日志目录
const logDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// 配置winston日志记录器
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'nuxt-todo-api' },
  transports: [
    // 错误日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // 综合日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

// 日志中间件
export default defineEventHandler((event) => {
  // 记录请求开始时间
  const startTime = Date.now()
  
  // 在响应发送后记录日志
  event.node.res.on('finish', () => {
    const endTime = Date.now()
    const duration = endTime - startTime
    // 获取请求信息
    const method = event.method
    const url = event.path
    const req = event.node.req
    const res = event.node.res
    const statusCode = event.node.res.statusCode
    const userAgent = req.headers['user-agent'] || 'Unknown'
    const ip = req.socket.remoteAddress || 
               req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               'Unknown'
    // 获取返回结果
    const response = {
      statusCode,
      statusMessage: res.statusMessage,
      // 注意：我们不记录响应体，因为它可能包含敏感信息
      // 如果需要响应体大小，可以在其他地方计算
    }
    
    // 构建日志对象
    const logData = {
      method,
      url,
      duration: `${duration}ms`,
      userAgent,
      ip: Array.isArray(ip) ? ip[0] : ip,
      timestamp: new Date().toISOString(),
      response
    }
    
    // 根据状态码记录不同级别的日志
    if (statusCode >= 500) {
      logger.error('Server Error', logData)
    } else if (statusCode >= 400) {
      logger.warn('Client Error', logData)
    } else {
      logger.info('API Request', logData)
    }
  })
})