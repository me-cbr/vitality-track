import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform, __DEV__ } from "react-native"

export const USE_MOCK_DATA = false // Set to false when backend is ready

// Configure your backend URL here
// For development: use your local IP address (e.g., 'http://192.168.1.100:8000')
// For production: use your deployed backend URL
// Dev hosts: use Android emulator host for Android, localhost for iOS simulator.
const DEV_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://localhost:8000/api'
export const API_BASE_URL = __DEV__ ? DEV_HOST : "http://localhost:8000/api"

// API client with authentication
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.refreshing = false
    this._access = null
    this._refresh = null
  }

  // Token helpers
  async setTokens({ access, refresh }) {
    try {
      this._access = access || null
      this._refresh = refresh || null
      await AsyncStorage.setItem("accessToken", access || "")
      if (refresh) await AsyncStorage.setItem("refreshToken", refresh)
    } catch (err) {
      console.error(" Error saving tokens:", err)
    }
  }

  async clearTokens() {
    try {
      this._access = null
      this._refresh = null
      await AsyncStorage.removeItem("accessToken")
      await AsyncStorage.removeItem("refreshToken")
    } catch (err) {
      console.error(" Error clearing tokens:", err)
    }
  }

  async getAccessToken() {
    try {
      if (this._access) return this._access
      const t = await AsyncStorage.getItem("accessToken")
      this._access = t || null
      return this._access
    } catch (err) {
      return null
    }
  }

  async getRefreshToken() {
    try {
      if (this._refresh) return this._refresh
      const t = await AsyncStorage.getItem("refreshToken")
      this._refresh = t || null
      return this._refresh
    } catch (err) {
      return null
    }
  }

  // Try to refresh access token using refresh token
  async refreshAccessToken() {
    const refresh = await this.getRefreshToken()
    if (!refresh) return null

    try {
      const res = await fetch(`${this.baseURL}/auth/jwt/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      })

      if (!res.ok) return null
      const data = await res.json()
      if (data.access) {
        await this.setTokens({ access: data.access, refresh })
        return data.access
      }
      return null
    } catch (err) {
      console.error(" Error refreshing token:", err)
      return null
    }
  }

  // Main request with automatic refresh on 401
  async request(endpoint, options = {}, retry = true) {
    // pick token: prefer accessToken, fallback to legacy authToken
    const access = (await this.getAccessToken()) || (await AsyncStorage.getItem("authToken"))
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (access) headers.Authorization = `Bearer ${access}`

    const config = { ...options, headers }

    try {
      console.debug(`API Request: ${options.method || 'GET'} ${this.baseURL}${endpoint}`)
      console.debug('Request headers:', headers)
      if (options.body) console.debug('Request body:', options.body)

      const response = await fetch(`${this.baseURL}${endpoint}`, config)

      console.debug(`API Response status: ${response.status} for ${endpoint}`)

      if (response.status === 401 && retry) {
        // try refresh
        const newAccess = await this.refreshAccessToken()
        if (newAccess) {
          // retry original request once
          headers.Authorization = `Bearer ${newAccess}`
          const retryRes = await fetch(`${this.baseURL}${endpoint}`, { ...options, headers })
          if (!retryRes.ok) {
            const errorText = await retryRes.text().catch(() => '')
            console.error(`Retry response not OK: ${retryRes.status} - ${errorText}`)
            const error = await retryRes.json().catch(() => ({ message: errorText || "Network error" }))
            throw new Error(error.message || `HTTP ${retryRes.status}`)
          }
          const retryJson = await retryRes.json().catch(() => null)
          console.debug('Retry response JSON:', retryJson)
          return retryJson
        }
      }

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        console.error(`Response not OK: ${response.status} - ${text}`)
        const error = await (async () => {
          try { return JSON.parse(text || '{}') } catch { return { message: text || 'Network error' } }
        })()
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      // handle empty responses
      const text = await response.text()
      const parsed = text ? JSON.parse(text) : {}
      console.debug(`Response JSON for ${endpoint}:`, parsed)
      return parsed
    } catch (error) {
      console.error(` API Error (${endpoint}):`, error)
      throw error
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: "GET" })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
