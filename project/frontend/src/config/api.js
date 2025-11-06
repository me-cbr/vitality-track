import AsyncStorage from "@react-native-async-storage/async-storage"
import { __DEV__ } from "react-native"

// Configure your backend URL here
// For development: use your local IP address (e.g., 'http://192.168.1.100:8000')
// For production: use your deployed backend URL
export const API_BASE_URL = __DEV__ ? "http://localhost:8000/api" : "https://your-production-api.com/api"

// API client with authentication
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async getAuthToken() {
    try {
      return await AsyncStorage.getItem("authToken")
    } catch (error) {
      console.error(" Error getting auth token:", error)
      return null
    }
  }

  async request(endpoint, options = {}) {
    const token = await this.getAuthToken()
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const config = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Network error" }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return await response.json()
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
