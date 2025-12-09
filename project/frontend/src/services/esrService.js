import { apiClient } from "../config/api"

export const esrService = {
  async getESRRecords(athleteId) {
    try {
      return await apiClient.get(`/subjective-scales/?athlete_id=${athleteId}`)
    } catch (error) {
      console.error("Error fetching ESR records:", error)
      throw error
    }
  },

  async createESRRecord(esrData) {
    try {
      return await apiClient.post("/subjective-scales/", esrData)
    } catch (error) {
      console.error("Error creating ESR record:", error)
      throw error
    }
  },

  async getLatestESR(athleteId) {
    try {
      return await apiClient.get(`/subjective-scales/latest/?athlete_id=${athleteId}`)
    } catch (error) {
      console.error("Error fetching latest ESR:", error)
      throw error
    }
  },

  async getESRHistory(athleteId, startDate, endDate) {
    try {
      const params = new URLSearchParams({ atleta_id: athleteId, start_date: startDate, end_date: endDate })
      return await apiClient.get(`/subjective-scales/history/?${params}`)
    } catch (error) {
      console.error("Error fetching ESR history:", error)
      throw error
    }
  },
}
