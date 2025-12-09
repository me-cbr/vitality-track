import { apiClient } from "../config/api"

export const trainingService = {
  async getSessions(atletaId) {
    try {
      const sessions = await apiClient.get(`/training-sessions/?athlete_id=${atletaId}`)
      return sessions
    } catch (error) {
      console.error("Error fetching sessions:", error)
      throw error
    }
  },

  async getTrainingPlanById(planId) {
    try {
      return await apiClient.get(`/training-plans/${planId}/`)
    } catch (error) {
      console.error("Error fetching training plan:", error)
      throw error
    }
  },

  async createTrainingPlan(planData) {
    try {
      const payload = {
        nome: planData.nome,
        descricao: planData.descricao,
        data_inicio: planData.data_inicio,
        data_fim: planData.data_fim,
        atleta_id: planData.atleta_id,
        treinador_id: planData.treinador_id,
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
        nome: planData.nome,
        descricao: planData.descricao,
        data_inicio: planData.data_inicio,
        data_fim: planData.data_fim,
      }
      return await apiClient.put(`/training-plans/${planId}/`, payload)
    } catch (error) {
      console.error("Error updating training plan:", error)
      throw error
    }
  },

  async getSessionById(sessionId) {
    try {
      const session = await apiClient.get(`/training-sessions/${sessionId}/`)
      return session
    } catch (error) {
      console.error("Error fetching session:", error)
      throw error
    }
  },

  async createSession(sessionData) {
    try {
      const payload = {
        zona_alvo: sessionData.zona_alvo,
        tipo: sessionData.tipo,
        intensidade: sessionData.intensidade,
        duracao: sessionData.duracao,
        data: `${sessionData.data}T${sessionData.hora}:00`,
        plano_id: sessionData.plano_id,
      }
      return await apiClient.post("/training-sessions/", payload)
    } catch (error) {
      console.error("Error creating session:", error)
      throw error
    }
  },

  async updateSession(sessionId, sessionData) {
    try {
      const payload = {
        zona_alvo: sessionData.zona_alvo,
        tipo: sessionData.tipo,
        intensidade: sessionData.intensidade,
        duracao: sessionData.duracao,
        data: `${sessionData.data}T${sessionData.hora}:00`,
      }
      return await apiClient.put(`/training-sessions/${sessionId}/`, payload)
    } catch (error) {
      console.error("Error updating session:", error)
      throw error
    }
  },

  async completeSession(sessionId) {
    try {
      return await apiClient.patch(`/training-sessions/${sessionId}/conclude/`, {})
    } catch (error) {
      console.error("Error completing session:", error)
      throw error
    }
  },

  async getAssessments(atletaId) {
    try {
      const assessments = await apiClient.get(`/physical-evaluations/?athlete_id=${atletaId}`)
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
