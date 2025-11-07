import { apiClient, USE_MOCK_DATA } from "../config/api"
import { mockTrainingPlans } from "../config/mockData"

export const trainingService = {
  async getTrainingPlans(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return athleteId ? mockTrainingPlans.filter((p) => p.atleta_id === athleteId) : mockTrainingPlans
    }

    try {
      return await apiClient.get(`/training-plans?athlete_id=${athleteId}`)
    } catch (error) {
      console.error(" Error fetching training plans:", error)
      throw error
    }
  },

  async getTrainingPlanById(planId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockTrainingPlans.find((p) => p.id === planId)
    }

    try {
      return await apiClient.get(`/training-plans/${planId}`)
    } catch (error) {
      console.error(" Error fetching training plan:", error)
      throw error
    }
  },

  async createTrainingPlan(planData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newPlan = {
        id: mockTrainingPlans.length + 1,
        ...planData,
        status: "ativo",
        sessoes: [],
      }
      mockTrainingPlans.push(newPlan)
      return newPlan
    }

    try {
      return await apiClient.post("/training-plans", planData)
    } catch (error) {
      console.error(" Error creating training plan:", error)
      throw error
    }
  },

  async updateTrainingPlan(planId, planData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const index = mockTrainingPlans.findIndex((p) => p.id === planId)
      if (index > -1) {
        mockTrainingPlans[index] = { ...mockTrainingPlans[index], ...planData }
        return mockTrainingPlans[index]
      }
      throw new Error("Training plan not found")
    }

    try {
      return await apiClient.put(`/training-plans/${planId}`, planData)
    } catch (error) {
      console.error(" Error updating training plan:", error)
      throw error
    }
  },

  async getSessions(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const plans = mockTrainingPlans.filter((p) => p.atleta_id === athleteId)
      const allSessions = plans.flatMap((p) => p.sessoes || [])

      return allSessions.map((session) => ({
        ...session,
        title: session.nome || session.title,
        timeLabel: session.hora || session.timeLabel,
        dayLabel: session.dayLabel || this.getDayLabel(session.data),
        zone: session.zone || this.extractZoneNumber(session.zona_alvo),
      }))
    }

    try {
      const sessions = await apiClient.get(`/sessions?athlete_id=${athleteId}`)
      return sessions.map((session) => ({
        ...session,
        title: session.nome || session.title,
        timeLabel: session.hora || session.timeLabel,
        dayLabel: this.getDayLabel(session.data),
        zone: this.extractZoneNumber(session.zona_alvo),
      }))
    } catch (error) {
      console.error(" Error fetching sessions:", error)
      throw error
    }
  },

  async getSessionById(sessionId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      for (const plan of mockTrainingPlans) {
        const session = plan.sessoes?.find((s) => s.id === sessionId)
        if (session) {
          return {
            ...session,
            title: session.nome || session.title,
            timeLabel: session.hora || session.timeLabel,
            zone: session.zone || this.extractZoneNumber(session.zona_alvo),
          }
        }
      }
      return null
    }

    try {
      const session = await apiClient.get(`/sessions/${sessionId}`)
      return {
        ...session,
        title: session.nome || session.title,
        timeLabel: session.hora || session.timeLabel,
        zone: this.extractZoneNumber(session.zona_alvo),
      }
    } catch (error) {
      console.error(" Error fetching session:", error)
      throw error
    }
  },

  async createSession(sessionData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const plan = mockTrainingPlans.find((p) => p.id === sessionData.plano_id)
      if (plan) {
        const newSession = {
          id: Date.now(),
          ...sessionData,
          status: "agendado",
        }
        if (!plan.sessoes) plan.sessoes = []
        plan.sessoes.push(newSession)
        return newSession
      }
      throw new Error("Training plan not found")
    }

    try {
      return await apiClient.post("/sessions", sessionData)
    } catch (error) {
      console.error(" Error creating session:", error)
      throw error
    }
  },

  async completeSession(sessionId, completionData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      for (const plan of mockTrainingPlans) {
        const session = plan.sessoes?.find((s) => s.id === sessionId)
        if (session) {
          session.status = "concluido"
          session.completionData = completionData
          return session
        }
      }
      throw new Error("Session not found")
    }

    try {
      return await apiClient.patch(`/sessions/${sessionId}/complete`, completionData)
    } catch (error) {
      console.error(" Error completing session:", error)
      throw error
    }
  },

  getDayLabel(dateString) {
    if (!dateString) return "Hoje"

    const sessionDate = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Reset time for comparison
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
    const match = zonaAlvo.match(/Zona (\d)/)
    return match ? Number.parseInt(match[1]) : 3
  },
}
