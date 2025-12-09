"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    setLoading(true)
    try {
      const userData = await authService.getCurrentUser()
      if (userData) {
        setUser(userData)
      }
    } catch (error) {
      console.log(" Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password)
      setUser(userData)
      return { success: true, user: userData }
    } catch (error) {
      console.log(" Login error:", error)
      return { success: false, error: error.message || "Credenciais inválidas" }
    }
  }

  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData)
      return { success: true, user: newUser }
    } catch (error) {
      console.log(" Register error:", error)
      return { success: false, error: error.message || "Erro ao criar conta" }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.log(" Error logging out:", error)
    }
  }

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = await authService.updateUser(user.id, updatedData)
      setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (error) {
      console.log(" Error updating user:", error)
      throw error
    }
  }

  const refreshProfile = async () => {
    try {
      setLoading(true)
      const profile = await authService.getCurrentUser()
      if (profile) setUser(profile)
      return profile
    } catch (err) {
      console.error(" Error refreshing profile:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
