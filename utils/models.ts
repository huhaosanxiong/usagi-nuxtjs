import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  created_at: Date
  updated_at: Date
}

export interface Todo {
  id: number
  user_id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: Date
  created_at: Date
  updated_at: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number }
  } catch {
    return null
  }
}

// 用户相关操作
export async function createUser(username: string, email: string, password: string): Promise<User> {
  const password_hash = await hashPassword(password)
  const [result] = await db.execute(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, password_hash]
  )
  const userId = (result as any).insertId
  const user = await getUserById(userId)
  if (!user) {
    throw new Error('用户创建失败')
  }
  return user
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username])
  return (rows as any[])[0] || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email])
  return (rows as any[])[0] || null
}

export async function getUserById(id: number): Promise<User | null> {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id])
  return (rows as any[])[0] || null
}

// 待办事项相关操作
export async function createTodo(userId: number, title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium', due_date?: string): Promise<Todo> {
  const [result] = await db.execute(
    'INSERT INTO todos (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
    [userId, title, description, priority, due_date]
  )
  const todoId = (result as any).insertId
  const todo = await getTodoById(todoId, userId)
  if (!todo) {
    throw new Error('待办事项创建失败')
  }
  return todo
}

export async function getTodos(userId: number): Promise<Todo[]> {
  const [rows] = await db.execute('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [userId])
  return rows as Todo[]
}

export async function getTodoById(id: number, userId: number): Promise<Todo | null> {
  const [rows] = await db.execute('SELECT * FROM todos WHERE id = ? AND user_id = ?', [id, userId])
  return (rows as any[])[0] || null
}

export async function updateTodo(id: number, userId: number, updates: Partial<Todo>): Promise<Todo | null> {
  const fields: string[] = []
  const values: any[] = []
  
  if (updates.title !== undefined) {
    fields.push('title = ?')
    values.push(updates.title)
  }
  if (updates.description !== undefined) {
    fields.push('description = ?')
    values.push(updates.description)
  }
  if (updates.status !== undefined) {
    fields.push('status = ?')
    values.push(updates.status)
  }
  if (updates.priority !== undefined) {
    fields.push('priority = ?')
    values.push(updates.priority)
  }
  if (updates.due_date !== undefined) {
    fields.push('due_date = ?')
    values.push(updates.due_date)
  }
  
  if (fields.length === 0) {
    return getTodoById(id, userId)
  }
  
  values.push(id, userId)
  await db.execute(
    `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    values
  )
  
  return getTodoById(id, userId)
}

export async function deleteTodo(id: number, userId: number): Promise<boolean> {
  const [result] = await db.execute('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId])
  return (result as any).affectedRows > 0
}