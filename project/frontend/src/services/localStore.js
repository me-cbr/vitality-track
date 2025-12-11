import AsyncStorage from "@react-native-async-storage/async-storage"

// Lightweight local storage with optional TTL (time-to-live)
// Works with React Native + Expo Go
// All values are stored as strings; JSON helpers provided.

const now = () => Date.now()

const buildRecord = (value, ttlMs) => {
  const expiresAt = ttlMs ? now() + Number(ttlMs) : null
  return JSON.stringify({ v: value, e: expiresAt })
}

const parseRecord = (raw) => {
  if (!raw) return { value: null, expired: false }
  try {
    const obj = JSON.parse(raw)
    const expired = obj?.e ? now() > obj.e : false
    return { value: obj?.v ?? null, expired }
  } catch {
    // fallback: treat as plain value
    return { value: raw, expired: false }
  }
}

export const localStore = {
  // Save a string value with optional TTL in ms
  async set(key, value, ttlMs = null) {
    const record = buildRecord(value, ttlMs)
    await AsyncStorage.setItem(key, record)
  },

  // Retrieve a string value; returns null if missing or expired
  async get(key) {
    const raw = await AsyncStorage.getItem(key)
    const { value, expired } = parseRecord(raw)
    if (expired) {
      await AsyncStorage.removeItem(key)
      return null
    }
    return value
  },

  async remove(key) {
    await AsyncStorage.removeItem(key)
  },

  async clear() {
    await AsyncStorage.clear()
  },

  // JSON helpers
  async setJSON(key, obj, ttlMs = null) {
    const value = JSON.stringify(obj)
    await this.set(key, value, ttlMs)
  },

  async getJSON(key) {
    const value = await this.get(key)
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  },
}

export default localStore
