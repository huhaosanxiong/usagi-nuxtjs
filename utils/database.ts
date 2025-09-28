import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'apple',
  database: process.env.DB_NAME || 'nuxt_todo_app',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// 初始化数据库表
export async function initDatabase() {
  try {
    // 检查用户表是否存在，不存在则创建
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
        email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
        password_hash VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // 检查待办事项表是否存在，不存在则创建
    await db.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // 修改现有表的字符集（如果存在）
    try {
      await db.execute(`ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
      await db.execute(`ALTER TABLE todos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    } catch (error) {
      // 忽略表不存在或其他错误
      console.log('修改表字符集，表可能不存在或已经是utf8mb4')
    }

    console.log('数据库初始化完成')
  } catch (error) {
    console.error('数据库初始化失败:', error)
    throw error
  }
}