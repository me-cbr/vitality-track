import { apiClient } from "../config/api"

export const athleteService = {
  async getAthletes() {
    try {
      return await apiClient.get("/athletes")
    } catch (error) {
      console.error(" Error fetching athletes:", error)
      throw error
    }
  },

  async getAthleteById(athleteId) {
    try {
      return await apiClient.get(`/athletes/${athleteId}`)
    } catch (error) {
      console.error(" Error fetching athlete:", error)
      throw error
    }
  },

  async createAthlete(athleteData) {
    try {
      return await apiClient.post("/athletes", athleteData)
    } catch (error) {
      console.error(" Error creating athlete:", error)
      throw error
    }
  },

  async updateAthlete(athleteId, athleteData) {
    try {
      return await apiClient.put(`/athletes/${athleteId}`, athleteData)
    } catch (error) {
      console.error(" Error updating athlete:", error)
      throw error
    }
  },

  async deleteAthlete(athleteId) {
    try {
      return await apiClient.delete(`/athletes/${athleteId}`)
    } catch (error) {
      console.error(" Error deleting athlete:", error)
      throw error
    }
  },

  async getAthleteStats(athleteId) {
    try {
      return await apiClient.get(`/athletes/${athleteId}/stats`)
    } catch (error) {
      console.error(" Error fetching athlete stats:", error)
      throw error
    }
  },
}
