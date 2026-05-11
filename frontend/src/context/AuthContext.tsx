import { createContext, useContext, useState, type ReactNode } from 'react'
import type { LoginResponse } from '../types'

interface AuthCtx {
  user: LoginResponse | null
  login: (data: LoginResponse) => void
  logout: () => void
  isAuth: boolean
}

const AuthContext = createContext<AuthCtx>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })

  const login = (data: LoginResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
