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

export const trainingService = {
  async getSessions(athleteId) {
    try {
      return await cacheFirst(`sessions:athlete:${athleteId}`, async () => {
        if (USE_MOCKS) {
          const merged = await localRepo.mergeWithSeed("trainingSessions", mockData.trainingSessions)
          return merged.filter((s) => Number(s.athlete_id) === Number(athleteId))
        }
        return apiClient.get(`/training-sessions/?athlete_id=${athleteId}`)
      })
    } catch (error) {
      console.error("Error fetching sessions:", error)
      throw error
    }
  },

  async getTrainingPlanById(planId) {
    try {
      if (USE_MOCKS) {
        const merged = await localRepo.mergeWithSeed("trainingPlans", mockData.trainingPlans)
        return Promise.resolve(merged.find((p) => Number(p.id) === Number(planId)) || null)
      }
      return await apiClient.get(`/training-plans/${planId}/`)
    } catch (error) {
      console.error("Error fetching training plan:", error)
      throw error
    }
  },

  async createTrainingPlan(planData) {
    try {
      const payload = {
        name: planData.name,
        description: planData.description,
        start_date: planData.start_date,
        end_date: planData.end_date,
        athlete_id: planData.athlete_id,
        coach_id: planData.coach_id,
      }
      if (USE_MOCKS) {
        const seedMax = Math.max(0, ...mockData.trainingPlans.map((p) => p.id))
        const newPlan = await localRepo.upsert("trainingPlans", { id: undefined, ...payload }, seedMax)
        await localStore.remove(`plans:coach:${newPlan.coach_id}`)
        return Promise.resolve(newPlan)
      }
      return await apiClient.post("/training-plans/", payload)
    } catch (error) {
      console.error("Error creating training plan:", error)
      throw error
    }
  },

  async updateTrainingPlan(planId, planData) {
    try {
      const payload = {
        name: planData.name,
        description: planData.description,
        start_date: planData.start_date,
        end_date: planData.end_date,
      }
      if (USE_MOCKS) {
        const merged = await localRepo.mergeWithSeed("trainingPlans", mockData.trainingPlans)
        const current = merged.find((p) => Number(p.id) === Number(planId))
        if (!current) return Promise.resolve(null)
        const updated = await localRepo.upsert("trainingPlans", { ...current, ...payload })
        const coachId = updated.coach_id
        if (coachId) await localStore.remove(`plans:coach:${coachId}`)
        return Promise.resolve(updated)
      }
      return await apiClient.put(`/training-plans/${planId}/`, payload)
    } catch (error) {
      console.error("Error updating training plan:", error)
      throw error
    }
  },

  async getSessionById(sessionId) {
    try {
      if (USE_MOCKS) return Promise.resolve(mockData.trainingSessions.find((s) => Number(s.id) === Number(sessionId)) || null)
      const session = await apiClient.get(`/training-sessions/${sessionId}/`)
      return session
    } catch (error) {
      console.error("Error fetching session:", error)
      throw error
    }
  },

  async createSession(sessionData) {
    try {
      // build payload with English-only field names
      const datePart = sessionData.date
      const timePart = sessionData.time

      const payload = {
        target_zone: sessionData.target_zone,
        training_type: sessionData.training_type,
        intensity: sessionData.intensity,
        duration: sessionData.duration,
        // send separate date/time when available (backend will combine),
        ...(datePart ? { date: datePart } : {}),
        ...(timePart ? { time: timePart } : {}),
        training_plan: sessionData.training_plan || sessionData.training_plan_id,
        athlete_id: sessionData.athlete_id,
      }

      if (USE_MOCKS) {
        const seedMax = Math.max(0, ...mockData.trainingSessions.map((s) => s.id))
        const base = { ...payload }
        if (!base.training_plan && base.athlete_id) {
          const mergedPlans = await localRepo.mergeWithSeed("trainingPlans", mockData.trainingPlans)
          const plan = mergedPlans.find((p) => Number(p.athlete_id) === Number(base.athlete_id))
          if (plan) base.training_plan = plan.id
        }
        const newSession = await localRepo.upsert("trainingSessions", { id: undefined, ...base }, seedMax)
        if (newSession.athlete_id) await localStore.remove(`sessions:athlete:${newSession.athlete_id}`)
        return Promise.resolve(newSession)
      }
      return await apiClient.post("/training-sessions/", payload)
    } catch (error) {
      console.error("Error creating session:", error)
      throw error
    }
  },

  async updateSession(sessionId, sessionData) {
    try {
      const datePart = sessionData.date
      const timePart = sessionData.time

      const payload = {
        target_zone: sessionData.target_zone,
        training_type: sessionData.training_type,
        intensity: sessionData.intensity,
        duration: sessionData.duration,
        ...(datePart ? { date: datePart } : {}),
        ...(timePart ? { time: timePart } : {}),
      }
      if (USE_MOCKS) {
        const merged = await localRepo.mergeWithSeed("trainingSessions", mockData.trainingSessions)
        const current = merged.find((s) => Number(s.id) === Number(sessionId))
        if (!current) return Promise.resolve(null)
        const updated = await localRepo.upsert("trainingSessions", { ...current, ...payload })
        const athleteId = updated.athlete_id
        if (athleteId) await localStore.remove(`sessions:athlete:${athleteId}`)
        return Promise.resolve(updated)
      }
      return await apiClient.put(`/training-sessions/${sessionId}/`, payload)
    } catch (error) {
      console.error("Error updating session:", error)
      throw error
    }
  },

  async completeSession(sessionId) {
    try {
      if (USE_MOCKS) {
        const merged = await localRepo.mergeWithSeed("trainingSessions", mockData.trainingSessions)
        const session = merged.find((s) => Number(s.id) === Number(sessionId))
        if (!session) return Promise.resolve(null)
        const updated = await localRepo.upsert("trainingSessions", { ...session, completed: true })
        if (updated.athlete_id) await localStore.remove(`sessions:athlete:${updated.athlete_id}`)
        return Promise.resolve(updated)
      }
      return await apiClient.patch(`/training-sessions/${sessionId}/conclude/`, {})
    } catch (error) {
      console.error("Error completing session:", error)
      throw error
    }
  },

  async getAssessments(athleteId) {
    try {
      if (USE_MOCKS) {
        const merged = await localRepo.mergeWithSeed("assessments", mockData.assessments)
        return Promise.resolve(merged.filter((s) => Number(s.athlete_id) === Number(athleteId)))
      }
      const assessments = await apiClient.get(`/physical-evaluations/?athlete_id=${athleteId}`)
      return assessments
    } catch (error) {
      console.error("Error fetching assessments:", error)
      throw error
    }
  },

  getDayLabel(dateString) {
    if (!dateString) return "Hoje"

    const sessionDate = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    today.setHours(0, 0, 0, 0)
    tomorrow.setHours(0, 0, 0, 0)
    sessionDate.setHours(0, 0, 0, 0)

    if (sessionDate.getTime() === today.getTime()) return "Hoje"
    if (sessionDate.getTime() === tomorrow.getTime()) return "Amanhã"

    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    return days[sessionDate.getDay()]
  },

  extractZoneNumber(zonaAlvo) {
    if (!zonaAlvo) return 3
    if (typeof zonaAlvo === "number") return zonaAlvo
    const match = zonaAlvo.toString().match(/(\d)/)
    return match ? Number.parseInt(match[1]) : 3
  },
}
