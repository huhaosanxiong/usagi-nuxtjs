export interface User {
  id: number
  username: string
  email: string
}

export interface Todo {
  id: number
  user_id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
}