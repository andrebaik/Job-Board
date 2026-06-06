import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    })

    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)

    return response.data.user
  }

  const register = async (formData) => {
    const response = await api.post('/auth/register', formData)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const getMe = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}