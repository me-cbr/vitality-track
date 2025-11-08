import { apiClient, USE_MOCK_DATA } from "../config/api"
import { mockFeedbacks } from "../config/mockData"

export const feedbackService = {
  async getFeedbacks() {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("All feedbacks retrieved:", mockFeedbacks)
      return mockFeedbacks
    }

    try {
      console.log("Fetching all feedbacks from API")
      return await apiClient.get("/feedbacks")
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      throw error
    }
  },

  async getFeedbacksByAthlete(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const filtered = mockFeedbacks
        .filter((f) => f.atleta_id === athleteId)
        .sort((a, b) => new Date(b.data) - new Date(a.data))
      console.log("Feedbacks for athlete", athleteId, "retrieved:", filtered)
      return filtered
    }

    try {
      console.log("Fetching feedbacks for athlete from API:", athleteId)
      return await apiClient.get(`/feedbacks?atleta_id=${athleteId}`)
    } catch (error) {
      console.error("Error fetching athlete feedbacks:", error)
      throw error
    }
  },

  async createFeedback(feedbackData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newFeedback = {
        id: mockFeedbacks.length + 1,
        mensagem: feedbackData.mensagem,
        data: feedbackData.data || new Date().toISOString(),
        atleta_id: feedbackData.atleta_id,
        treinador_id: feedbackData.treinador_id,
        lido: false,
        tipo_mensagem: feedbackData.tipo_mensagem || "planejamento",
      }
      mockFeedbacks.unshift(newFeedback)
      console.log("Feedback created (mock):", newFeedback)
      return newFeedback
    }

    try {
      console.log("Creating feedback via API:", feedbackData)
      return await apiClient.post("/feedbacks", feedbackData)
    } catch (error) {
      console.error("Error creating feedback:", error)
      throw error
    }
  },

  async markAsRead(feedbackId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const feedback = mockFeedbacks.find((f) => f.id === feedbackId)
      if (feedback) {
        feedback.lido = true
      }
      console.log("Feedback marked as read (mock):", feedback)
      return feedback
    }

    try {
      console.log("Marking feedback as read via API:", feedbackId)
      return await apiClient.patch(`/feedbacks/${feedbackId}`, { lido: true })
    } catch (error) {
      console.error("Error marking feedback as read:", error)
      throw error
    }
  },

  async deleteFeedback(feedbackId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const index = mockFeedbacks.findIndex((f) => f.id === feedbackId)
      if (index > -1) {
        mockFeedbacks.splice(index, 1)
      }
      console.log("Feedback deleted (mock), remaining:", mockFeedbacks.length)
      return { success: true }
    }

    try {
      console.log("Deleting feedback via API:", feedbackId)
      return await apiClient.delete(`/feedbacks/${feedbackId}`)
    } catch (error) {
      console.error("Error deleting feedback:", error)
      throw error
    }
  },
}
