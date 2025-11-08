import { apiClient, USE_MOCK_DATA } from "../config/api"
import { mockTrainingPlans, mockAvaliacoesFisicas, mockTrainingSessions } from "../config/mockData"

export const trainingService = {
  async getSessions(atletaId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockTrainingSessions
        .filter((s) => s.atleta_id === atletaId)
        .map((session) => ({
          ...session,
          title: session.nome || session.title,
          timeLabel: session.hora || session.timeLabel || this.getDayLabel(session.data),
          dayLabel: this.getDayLabel(session.data),
          zone: this.extractZoneNumber(session.zona_alvo),
        }))
    }

    try {
      const sessions = await apiClient.get(`/sessoes-treinamento?atleta_id=${atletaId}`)
      return sessions.map((session) => ({
        ...session,
        title: session.nome || session.title,
        timeLabel: session.hora || session.timeLabel,
        dayLabel: this.getDayLabel(session.data),
        zone: this.extractZoneNumber(session.zona_alvo),
      }))
    } catch (error) {
      console.error("Error fetching sessions:", error)
      throw error
    }
  },

  // Plans are internal coach organization, athletes see individual sessions

  async getTrainingPlanById(planId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockTrainingPlans.find((p) => p.id === planId)
    }

    try {
      return await apiClient.get(`/planos-treinamento/${planId}`)
    } catch (error) {
      console.error("Error fetching training plan:", error)
      throw error
    }
  },

  async createTrainingPlan(planData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newPlan = {
        id: mockTrainingPlans.length + 1,
        ...planData,
        sessoes: [],
      }
      mockTrainingPlans.push(newPlan)
      return newPlan
    }

    try {
      const payload = {
        nome: planData.nome,
        descricao: planData.descricao,
        data_inicio: planData.data_inicio,
        data_fim: planData.data_fim,
        atleta_id: planData.atleta_id,
        treinador_id: planData.treinador_id,
      }
      return await apiClient.post("/planos-treinamento", payload)
    } catch (error) {
      console.error("Error creating training plan:", error)
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
      const payload = {
        nome: planData.nome,
        descricao: planData.descricao,
        data_inicio: planData.data_inicio,
        data_fim: planData.data_fim,
      }
      return await apiClient.put(`/planos-treinamento/${planId}`, payload)
    } catch (error) {
      console.error("Error updating training plan:", error)
      throw error
    }
  },

  async getSessionById(sessionId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const session = mockTrainingSessions.find((s) => s.id === sessionId)
      if (session) {
        return {
          ...session,
          title: session.nome || session.title,
          timeLabel: session.hora || session.timeLabel,
          zone: this.extractZoneNumber(session.zona_alvo),
        }
      }
      return null
    }

    try {
      const session = await apiClient.get(`/sessoes-treinamento/${sessionId}`)
      return {
        ...session,
        title: session.nome || session.title,
        timeLabel: session.hora || session.timeLabel,
        zone: this.extractZoneNumber(session.zona_alvo),
      }
    } catch (error) {
      console.error("Error fetching session:", error)
      throw error
    }
  },

  async createSession(sessionData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newSession = {
        id: Math.max(...mockTrainingSessions.map((s) => s.id || 0), 0) + 1,
        ...sessionData,
        status: "agendado",
        created_at: new Date().toISOString(),
      }
      mockTrainingSessions.push(newSession)
      return newSession
    }

    try {
      const payload = {
        zona_alvo: sessionData.zona_alvo,
        tipo: sessionData.tipo,
        intensidade: sessionData.intensidade,
        duracao: sessionData.duracao,
        data: `${sessionData.data}T${sessionData.hora}:00`,
        plano_id: sessionData.plano_id,
      }
      return await apiClient.post("/sessoes-treinamento", payload)
    } catch (error) {
      console.error("Error creating session:", error)
      throw error
    }
  },

  async updateSession(sessionId, sessionData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const index = mockTrainingSessions.findIndex((s) => s.id === sessionId)
      if (index > -1) {
        mockTrainingSessions[index] = { ...mockTrainingSessions[index], ...sessionData }
        return mockTrainingSessions[index]
      }
      throw new Error("Session not found")
    }

    try {
      const payload = {
        zona_alvo: sessionData.zona_alvo,
        tipo: sessionData.tipo,
        intensidade: sessionData.intensidade,
        duracao: sessionData.duracao,
        data: `${sessionData.data}T${sessionData.hora}:00`,
      }
      return await apiClient.put(`/sessoes-treinamento/${sessionId}`, payload)
    } catch (error) {
      console.error("Error updating session:", error)
      throw error
    }
  },

  async completeSession(sessionId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const session = mockTrainingSessions.find((s) => s.id === sessionId)
      if (session) {
        session.status = "concluido"
        return session
      }
      throw new Error("Session not found")
    }

    try {
      return await apiClient.patch(`/sessoes-treinamento/${sessionId}/concluir`, {})
    } catch (error) {
      console.error("Error completing session:", error)
      throw error
    }
  },

  async getAssessments(atletaId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const assessments = mockAvaliacoesFisicas.filter((a) => a.atleta_id === atletaId)
      console.log("Assessments retrieved for athlete", atletaId, ":", assessments)
      return assessments
    }

    try {
      console.log("Fetching assessments from API for athlete:", atletaId)
      const assessments = await apiClient.get(`/avaliacoes-fisicas?atleta_id=${atletaId}`)
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
