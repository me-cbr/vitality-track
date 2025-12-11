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

export const feedbackService = {
  async getFeedbacks() {
    try {
      return await cacheFirst("feedbacks:list", async () => {
        if (USE_MOCKS) {
          const merged = await localRepo.mergeWithSeed("feedbacks", mockData.feedbacks)
          return merged
        }
        return apiClient.get("/feedbacks/")
      })
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      throw error
    }
  },

  async getFeedbacksByAthlete(athleteId) {
    try {
      return await cacheFirst(`feedbacks:athlete:${athleteId}`, async () => {
        if (USE_MOCKS) {
          const merged = await localRepo.mergeWithSeed("feedbacks", mockData.feedbacks)
          return merged.filter((f) => Number(f.athlete_id || f.atleta_id) === Number(athleteId))
        }
        return apiClient.get(`/feedbacks/?atleta_id=${athleteId}`)
      })
    } catch (error) {
      console.error("Error fetching athlete feedbacks:", error)
      throw error
    }
  },

  async createFeedback(feedbackData) {
    try {
      if (USE_MOCKS) {
        const seedMax = Math.max(0, ...mockData.feedbacks.map((f) => f.id))
        const rec = await localRepo.upsert("feedbacks", { ...feedbackData, created_at: new Date().toISOString(), lido: false }, seedMax)
        await localStore.remove("feedbacks:list")
        const aid = rec.athlete_id || rec.atleta_id
        if (aid) await localStore.remove(`feedbacks:athlete:${aid}`)
        return Promise.resolve(rec)
      }
      return await apiClient.post("/feedbacks/", feedbackData)
    } catch (error) {
      console.error("Error creating feedback:", error)
      throw error
    }
  },

  async markAsRead(feedbackId) {
    try {
      if (USE_MOCKS) {
        const all = await localRepo.mergeWithSeed("feedbacks", mockData.feedbacks)
        const f = all.find((x) => Number(x.id) === Number(feedbackId))
        if (!f) return Promise.resolve(null)
        const updated = await localRepo.upsert("feedbacks", { ...f, lido: true })
        await localStore.remove("feedbacks:list")
        const aid = updated.athlete_id || updated.atleta_id
        if (aid) await localStore.remove(`feedbacks:athlete:${aid}`)
        return Promise.resolve(updated)
      }
      return await apiClient.patch(`/feedbacks/${feedbackId}/`, { lido: true })
    } catch (error) {
      console.error("Error marking feedback as read:", error)
      throw error
    }
  },

  async deleteFeedback(feedbackId) {
    try {
      if (USE_MOCKS) {
        await localRepo.remove("feedbacks", feedbackId)
        await localStore.remove("feedbacks:list")
        // athlete-specific cache removal is best-effort; we don't know the athleteId here
        return Promise.resolve({ success: true })
      }
      return await apiClient.delete(`/feedbacks/${feedbackId}/`)
    } catch (error) {
      console.error("Error deleting feedback:", error)
      throw error
    }
  },
}
