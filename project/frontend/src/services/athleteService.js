import { apiClient } from "../config/api"
import { USE_MOCKS, mockData } from "../config/mockData"
import localStore from "./localStore"
import localRepo from "./localRepo"

const cacheFirst = async (key, fetchFn, ttlMs = 2 * 60 * 1000) => {
  const cached = await localStore.getJSON(key)
  if (cached) return cached
  const data = await fetchFn()
  await localStore.setJSON(key, data, ttlMs)
  return data
}

export const athleteService = {
  async getAthletes(coachId = null) {
    try {
      const key = coachId ? `athletes:list:coach:${coachId}` : "athletes:list"
      return await cacheFirst(key, async () => {
        if (USE_MOCKS) {
          const merged = await localRepo.mergeWithSeed("athletes", mockData.athletes)
          if (!coachId) return merged
          const coachPlans = mockData.trainingPlans.filter((p) => p.coach_id === coachId).map((p) => p.athlete_id)
          return merged.filter((a) => coachPlans.includes(a.id))
        }
        const url = coachId ? `/athletes/?coach_id=${coachId}` : "/athletes/"
        return apiClient.get(url)
      })
    } catch (error) {
      console.error("Error fetching athletes:", error)
      throw error
    }
  },

  async getAthleteById(athleteId) {
    try {
      const key = `athletes:${athleteId}`
      return await cacheFirst(key, async () => {
        if (USE_MOCKS) {
          const merged = await localRepo.mergeWithSeed("athletes", mockData.athletes)
          return merged.find((x) => Number(x.id) === Number(athleteId)) || null
        }
        return apiClient.get(`/athletes/${athleteId}/`)
      })
    } catch (error) {
      console.error(" Error fetching athlete:", error)
      throw error
    }
  },

  async createAthlete(athleteData) {
    try {
      if (USE_MOCKS) {
        const seedMax = Math.max(0, ...mockData.athletes.map((a) => a.id))
        const newAthlete = await localRepo.upsert("athletes", { ...athleteData, id: undefined }, seedMax)
        await localStore.remove("athletes:list")
        return Promise.resolve(newAthlete)
      }
      return await apiClient.post("/athletes/", athleteData)
    } catch (error) {
      console.error("Error creating athlete:", error)
      throw error
    }
  },

  async updateAthlete(athleteId, athleteData) {
    try {
      if (USE_MOCKS) {
        const merged = await localRepo.mergeWithSeed("athletes", mockData.athletes)
        const current = merged.find((a) => Number(a.id) === Number(athleteId))
        if (!current) return Promise.resolve(null)
        const updated = await localRepo.upsert("athletes", { ...current, ...athleteData })
        await localStore.remove("athletes:list")
        await localStore.remove(`athletes:${athleteId}`)
        return Promise.resolve(updated)
      }
      return await apiClient.put(`/athletes/${athleteId}/`, athleteData)
    } catch (error) {
      console.error(" Error updating athlete:", error)
      throw error
    }
  },

  async deleteAthlete(athleteId) {
    try {
      if (USE_MOCKS) {
        await localRepo.remove("athletes", athleteId)
        await localStore.remove("athletes:list")
        await localStore.remove(`athletes:${athleteId}`)
        return Promise.resolve({ success: true })
      }
      return await apiClient.delete(`/athletes/${athleteId}/`)
    } catch (error) {
      console.error(" Error deleting athlete:", error)
      throw error
    }
  },

  async getAthleteStats(athleteId) {
    try {
      if (USE_MOCKS) {
        // simple derived metrics for demo
        const sessions = mockData.trainingSessions.filter((s) => Number(s.athlete_id) === Number(athleteId))
        const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
        return Promise.resolve({ total_sessions: sessions.length, total_minutes: totalMinutes })
      }
      return await apiClient.get(`/athletes/${athleteId}/stats/`)
    } catch (error) {
      console.error(" Error fetching athlete stats:", error)
      throw error
    }
  },

  async addAthleteByEmail(email) {
    try {
      if (USE_MOCKS) {
        const user = mockData.users.find((u) => u.email === email)
        if (!user) return { success: false, error: "User not found" }
        const athlete = mockData.athletes.find((a) => a.user?.email === email)
        return { success: true, athlete: athlete || null }
      }
      const response = await apiClient.post("/coach/add-athlete/", { email })
      return { success: true, athlete: response.athlete }
    } catch (error) {
      console.error(" Error adding athlete:", error)
      return { success: false, error: error.message || "Erro ao adicionar atleta" }
    }
  },
}
