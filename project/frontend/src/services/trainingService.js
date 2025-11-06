import { apiClient } from "../config/api"

export const trainingService = {
  async getTrainingPlans(athleteId) {
    try {
      return await apiClient.get(`/training-plans?athlete_id=${athleteId}`)
    } catch (error) {
      console.error(" Error fetching training plans:", error)
      throw error
    }
  },

  async getTrainingPlanById(planId) {
    try {
      return await apiClient.get(`/training-plans/${planId}`)
    } catch (error) {
      console.error(" Error fetching training plan:", error)
      throw error
    }
  },

  async createTrainingPlan(planData) {
    try {
      return await apiClient.post("/training-plans", planData)
    } catch (error) {
      console.error(" Error creating training plan:", error)
      throw error
    }
  },

  async updateTrainingPlan(planId, planData) {
    try {
      return await apiClient.put(`/training-plans/${planId}`, planData)
    } catch (error) {
      console.error(" Error updating training plan:", error)
      throw error
    }
  },

  async getSessions(athleteId) {
    try {
      return await apiClient.get(`/sessions?athlete_id=${athleteId}`)
    } catch (error) {
      console.error(" Error fetching sessions:", error)
      throw error
    }
  },

  async getSessionById(sessionId) {
    try {
      return await apiClient.get(`/sessions/${sessionId}`)
    } catch (error) {
      console.error(" Error fetching session:", error)
      throw error
    }
  },

  async createSession(sessionData) {
    try {
      return await apiClient.post("/sessions", sessionData)
    } catch (error) {
      console.error(" Error creating session:", error)
      throw error
    }
  },

  async completeSession(sessionId, completionData) {
    try {
      return await apiClient.patch(`/sessions/${sessionId}/complete`, completionData)
    } catch (error) {
      console.error(" Error completing session:", error)
      throw error
    }
  },
}
