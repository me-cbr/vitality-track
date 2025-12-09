import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiClient } from "../config/api"

export const authService = {
  async login(email, password) {
    try {
      const res = await apiClient.post("/auth/jwt/", { username: email, password })
      console.debug('authService.login response:', res)
      if (res && res.access) {
        await apiClient.setTokens({ access: res.access, refresh: res.refresh })
        const userProfile = await apiClient.get("/users/me/").catch(() => null)
        console.debug('authService.login fetched profile:', userProfile)
        if (userProfile) {
          await AsyncStorage.setItem("userData", JSON.stringify(userProfile))
          return userProfile
        }

        // if we have tokens but couldn't fetch profile, return explicit error
        throw new Error('Authenticated but could not fetch profile')
      }
      throw new Error("Token not returned")
    } catch (err) {
      console.error(" Login error:", err)
      throw err
    }
  },

  async logout() {
    await apiClient.clearTokens()
    await AsyncStorage.removeItem("userData")
  },

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem("userData")
      if (userData) return JSON.parse(userData)

      // try to fetch profile from API using tokens
      try {
        const profile = await apiClient.get("/users/me/")
        if (profile) {
          await AsyncStorage.setItem("userData", JSON.stringify(profile))
          return profile
        }
      } catch (err) {
        console.warn(" Could not fetch user profile:", err)
      }

      return null
    } catch (error) {
      console.error(" Error getting current user:", error)
      return null
    }
  },

  async updateUser(userId, updatedData) {
    try {
      // try patching user endpoint
      const res = await apiClient.patch(`/users/${userId}/`, updatedData)
      if (res) {
        await AsyncStorage.setItem("userData", JSON.stringify(res))
        return res
      }
      throw new Error("Failed to update user")
    } catch (error) {
      console.error(" Error updating user:", error)
      throw error
    }
  },

  async register(userData) {
    try {
      // ensure nested user contains user_type
      if (!userData.user) userData.user = {}

      // ensure we include user_type for backend inference
      userData.user.user_type = userData.type || userData.user.user_type

      // call unified register endpoint
      console.debug('authService.register payload keys:', Object.keys(userData))
      const res = await apiClient.post("/register/", userData)
      console.debug('authService.register response:', res)

      // if backend returned tokens (access/refresh), save them and fetch profile
      if (res && res.access) {
        await apiClient.setTokens({ access: res.access, refresh: res.refresh })
        const profile = await apiClient.get("/users/me/").catch(() => null)
        if (profile) await AsyncStorage.setItem("userData", JSON.stringify(profile))
        return profile || res
      }

      // fallback: if API returned created resource, attempt to fetch profile
      const profile = await apiClient.get("/users/me/").catch(() => null)
      if (profile) {
        await AsyncStorage.setItem("userData", JSON.stringify(profile))
        return profile
      }

      return res
    } catch (err) {
      console.error(" Register error:", err)
      throw err
    }
  },
}
