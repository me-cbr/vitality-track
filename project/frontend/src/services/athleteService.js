import { apiClient } from "../config/api"

export const athleteService = {
  async getAthletes(coachId = null) {
    try {
      const url = coachId ? `/athletes/?coach_id=${coachId}` : "/athletes/"
      const data = await apiClient.get(url)
      return data
    } catch (error) {
      console.error("Error fetching athletes:", error)
      throw error
    }
  },

  async getAthleteById(athleteId) {
    try {
      const data = await apiClient.get(`/athletes/${athleteId}/`)
      return data
    } catch (error) {
      console.error(" Error fetching athlete:", error)
      throw error
    }
  },

  async createAthlete(athleteData) {
    try {
      return await apiClient.post("/athletes/", athleteData)
    } catch (error) {
      console.error("Error creating athlete:", error)
      throw error
    }
  },

  async updateAthlete(athleteId, athleteData) {
    try {
      return await apiClient.put(`/athletes/${athleteId}/`, athleteData)
    } catch (error) {
      console.error(" Error updating athlete:", error)
      throw error
    }
  },

  async deleteAthlete(athleteId) {
    try {
      return await apiClient.delete(`/athletes/${athleteId}/`)
    } catch (error) {
      console.error(" Error deleting athlete:", error)
      throw error
    }
  },

  async getAthleteStats(athleteId) {
    try {
      return await apiClient.get(`/athletes/${athleteId}/stats/`)
    } catch (error) {
      console.error(" Error fetching athlete stats:", error)
      throw error
    }
  },

  async addAthleteByEmail(email) {
    try {
      const response = await apiClient.post("/coach/add-athlete/", { email })
      return { success: true, athlete: response.athlete }
    } catch (error) {
      console.error(" Error adding athlete:", error)
      return { success: false, error: error.message || "Erro ao adicionar atleta" }
    }
  },
}
