import { initDatabase } from '../../utils/database'

export default defineNitroPlugin(async () => {
  try {
    await initDatabase()
    console.log('数据库插件初始化成功')
  } catch (error) {
    console.error('数据库插件初始化失败:', error)
  }
})