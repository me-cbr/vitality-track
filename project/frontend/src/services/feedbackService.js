import { apiClient, USE_MOCK_DATA } from "../config/api"
import { mockFeedbacks } from "../config/mockData"

export const feedbackService = {
  async getFeedbacks() {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockFeedbacks
    }

    try {
      return await apiClient.get("/feedbacks")
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      throw error
    }
  },

  async getFeedbacksByAthlete(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockFeedbacks.filter((f) => f.atleta_id === athleteId)
    }

    try {
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
      }
      mockFeedbacks.unshift(newFeedback)
      return newFeedback
    }

    try {
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
      return feedback
    }

    try {
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
      return { success: true }
    }

    try {
      return await apiClient.delete(`/feedbacks/${feedbackId}`)
    } catch (error) {
      console.error("Error deleting feedback:", error)
      throw error
    }
  },
}
