export interface User {
  id: string
  email: string
  username?: string // Making username optional as we primarily use full_name
  full_name?: string // Added full_name
  firstName?: string
  lastName?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
