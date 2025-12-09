import { apiClient } from "../config/api"

export const feedbackService = {
  async getFeedbacks() {
    try {
      return await apiClient.get("/feedbacks/")
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      throw error
    }
  },

  async getFeedbacksByAthlete(athleteId) {
    try {
      return await apiClient.get(`/feedbacks/?atleta_id=${athleteId}`)
    } catch (error) {
      console.error("Error fetching athlete feedbacks:", error)
      throw error
    }
  },

  async createFeedback(feedbackData) {
    try {
      return await apiClient.post("/feedbacks/", feedbackData)
    } catch (error) {
      console.error("Error creating feedback:", error)
      throw error
    }
  },

  async markAsRead(feedbackId) {
    try {
      return await apiClient.patch(`/feedbacks/${feedbackId}/`, { lido: true })
    } catch (error) {
      console.error("Error marking feedback as read:", error)
      throw error
    }
  },

  async deleteFeedback(feedbackId) {
    try {
      return await apiClient.delete(`/feedbacks/${feedbackId}/`)
    } catch (error) {
      console.error("Error deleting feedback:", error)
      throw error
    }
  },
}
