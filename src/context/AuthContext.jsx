import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContextValue'
import { loginUser, registerUser } from '../services/authService'

const AUTH_TOKEN_KEY = 'pumpplanner-token'
const AUTH_USER_KEY = 'pumpplanner-user'

function readStoredUser() {
  try {
    const saved = localStorage.getItem(AUTH_USER_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY))

  const saveAuth = useCallback((authData) => {
    setUser(authData.user)
    setToken(authData.token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authData.user))
    localStorage.setItem(AUTH_TOKEN_KEY, authData.token)
    return authData
  }, [])

  const login = useCallback(async (credentials) => {
    const authData = await loginUser(credentials)
    return saveAuth(authData)
  }, [saveAuth])

  const register = useCallback(async (userData) => {
    const authData = await registerUser(userData)
    return saveAuth(authData)
  }, [saveAuth])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }, [])

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  }), [user, token, login, register, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
