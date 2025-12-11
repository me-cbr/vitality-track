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

export const esrService = {
  async getESRRecords(athleteId) {
    try {
      return await cacheFirst(`esr:list:${athleteId}`, async () => {
        if (USE_MOCKS) {
          const merged = await localRepo.mergeWithSeed("subjectiveScales", mockData.subjectiveScales)
          return merged.filter((s) => Number(s.athlete_id) === Number(athleteId))
        }
        return apiClient.get(`/subjective-scales/?athlete_id=${athleteId}`)
      })
    } catch (error) {
      console.error("Error fetching ESR records:", error)
      throw error
    }
  },

  async createESRRecord(esrData) {
    try {
      if (USE_MOCKS) {
        const seedMax = Math.max(0, ...mockData.subjectiveScales.map((s) => s.id))
        const rec = await localRepo.upsert("subjectiveScales", { id: undefined, ...esrData, created_at: new Date().toISOString() }, seedMax)
        if (rec.athlete_id) await localStore.remove(`esr:list:${rec.athlete_id}`)
        await localStore.remove(`esr:latest:${rec.athlete_id}`)
        return Promise.resolve(rec)
      }
      return await apiClient.post("/subjective-scales/", esrData)
    } catch (error) {
      console.error("Error creating ESR record:", error)
      throw error
    }
  },

  async getLatestESR(athleteId) {
    try {
      return await cacheFirst(`esr:latest:${athleteId}`, async () => {
        if (USE_MOCKS) {
          const items = mockData.subjectiveScales.filter((s) => Number(s.athlete_id) === Number(athleteId))
          if (!items.length) return null
          const sorted = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          return sorted[0]
        }
        return apiClient.get(`/subjective-scales/latest/?athlete_id=${athleteId}`)
      })
    } catch (error) {
      console.error("Error fetching latest ESR:", error)
      throw error
    }
  },

  async getESRHistory(athleteId, startDate, endDate) {
    try {
      const key = `esr:history:${athleteId}:${startDate || 'null'}:${endDate || 'null'}`
      return await cacheFirst(key, async () => {
        if (USE_MOCKS) {
          const items = mockData.subjectiveScales.filter((s) => Number(s.athlete_id) === Number(athleteId))
          const start = startDate ? new Date(startDate) : null
          const end = endDate ? new Date(endDate) : null
          const filtered = items.filter((s) => {
            const d = new Date(s.created_at)
            if (start && d < start) return false
            if (end && d > end) return false
            return true
          })
          return filtered
        }
        const params = new URLSearchParams({ atleta_id: athleteId, start_date: startDate, end_date: endDate })
        return apiClient.get(`/subjective-scales/history/?${params}`)
      })
    } catch (error) {
      console.error("Error fetching ESR history:", error)
      throw error
    }
  },
}
