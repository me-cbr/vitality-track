import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiClient } from "../config/api"
import { USE_MOCKS, mockData } from "../config/mockData"
import localStore from "./localStore"
import localRepo from "./localRepo"

export const authService = {
  async login(email, password) {
    try {
      if (USE_MOCKS) {
        // Find user locally (merge seed + local persisted)
        const users = await localRepo.mergeWithSeed("users", mockData.users)
        const user = users.find((u) => u.email === email)
        if (!user || !user.password || password !== user.password) {
          const err = new Error("Invalid credentials")
          err.status = 401
          throw err
        }
        // build a simple profile: include athlete or coach record (merge with local)
        let profile = { user }
        if (user.type === "coach") {
          const coaches = await localRepo.mergeWithSeed("coaches", mockData.coaches)
          const coach = coaches.find((c) => c.user?.email === email)
          profile = coach ? { ...coach, type: "coach", user_type: "coach" } : { ...user, type: "coach", user_type: "coach" }
        } else {
          const athletes = await localRepo.mergeWithSeed("athletes", mockData.athletes)
          const athlete = athletes.find((a) => a.user?.email === email)
          profile = athlete ? { ...athlete, type: "athlete", user_type: "athlete" } : { ...user, type: "athlete", user_type: "athlete" }
        }
        await localStore.setJSON("user:current", profile, 10 * 60 * 1000)
        await AsyncStorage.setItem("userData", JSON.stringify(profile))
        return profile
      }
      const res = await apiClient.post("/auth/jwt/", { username: email, password })
      // show masked tokens for debug
      try {
        const mask = (t) => (t ? `${t.slice(0, 8)}...${t.slice(-4)}` : null)
        // eslint-disable-next-line no-console
        console.debug('authService.login response - tokens:', 'access=', mask(res?.access), 'refresh=', mask(res?.refresh))
      } catch (e) {
        // fallback generic log
        // eslint-disable-next-line no-console
        console.debug('authService.login response:', res)
      }
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
      const cached = await localStore.getJSON("user:current")
      if (cached) return cached

      // try to fetch profile from API using tokens
      if (USE_MOCKS) {
        // nothing in storage but mocks enabled — return a default demo profile (first coach for demo)
        const coach = mockData.coaches[0]
        const profile = { ...coach, type: "coach", user_type: "coach" }
        await AsyncStorage.setItem("userData", JSON.stringify(profile))
        await localStore.setJSON("user:current", profile, 10 * 60 * 1000)
        return profile
      }
      try {
        const profile = await apiClient.get("/users/me/")
        if (profile) {
          await AsyncStorage.setItem("userData", JSON.stringify(profile))
          await localStore.setJSON("user:current", profile, 10 * 60 * 1000)
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
      if (USE_MOCKS) {
        const uidx = mockData.users.findIndex((u) => Number(u.id) === Number(userId))
        if (uidx >= 0) {
          mockData.users[uidx] = { ...mockData.users[uidx], ...updatedData }
          const profile = mockData.users[uidx]
          await AsyncStorage.setItem("userData", JSON.stringify(profile))
          await localStore.setJSON("user:current", profile, 10 * 60 * 1000)
          return Promise.resolve(profile)
        }
        return Promise.resolve(null)
      }
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
      if (USE_MOCKS) {
        // Persist user/profile locally without backend
        const seedMaxUser = Math.max(0, ...mockData.users.map((u) => u.id))
        const user = await localRepo.upsert("users", {
          id: undefined,
          username: userData.user?.username || userData.user?.email,
          first_name: userData.user?.first_name || "Demo",
          last_name: userData.user?.last_name || "User",
          email: userData.user?.email,
          password: userData.user?.password || userData.password || "demo1234",
          type: userData.type || userData.user?.user_type || "athlete",
        }, seedMaxUser)

        if ((user.type || userData.user?.user_type) === "athlete") {
          const seedMaxAth = Math.max(0, ...mockData.athletes.map((a) => a.id))
          const athlete = await localRepo.upsert("athletes", {
            id: undefined,
            user,
            birth_date: userData.birth_date || "1995-01-01",
            weight: userData.weight ?? 70,
            height: userData.height ?? 1.7,
            resting_heart_rate: userData.resting_heart_rate ?? 60,
          }, seedMaxAth)
          await AsyncStorage.setItem("userData", JSON.stringify(athlete))
          await localStore.setJSON("user:current", athlete, 10 * 60 * 1000)
          return athlete
        } else {
          const seedMaxCoach = Math.max(0, ...mockData.coaches.map((c) => c.id))
          const coach = await localRepo.upsert("coaches", {
            id: undefined,
            user,
            cref: userData.cref || "",
            specialty: userData.specialty || "",
            team_size: 0,
            team_athletes: [],
          }, seedMaxCoach)
          await AsyncStorage.setItem("userData", JSON.stringify(coach))
          await localStore.setJSON("user:current", coach, 10 * 60 * 1000)
          return coach
        }
      }
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
