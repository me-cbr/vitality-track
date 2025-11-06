import { apiClient, USE_MOCK_DATA } from "../config/api"
import { mockESRRecords } from "../config/mockData"

export const esrService = {
  async getESRRecords(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockESRRecords.filter((r) => r.atleta_id === athleteId)
    }

    try {
      return await apiClient.get(`/esr?athlete_id=${athleteId}`)
    } catch (error) {
      console.error(" Error fetching ESR records:", error)
      throw error
    }
  },

  async createESRRecord(esrData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newRecord = {
        id: mockESRRecords.length + 1,
        ...esrData,
        data: new Date().toISOString(),
      }
      mockESRRecords.unshift(newRecord)
      return newRecord
    }

    try {
      return await apiClient.post("/esr", esrData)
    } catch (error) {
      console.error(" Error creating ESR record:", error)
      throw error
    }
  },

  async getLatestESR(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const records = mockESRRecords.filter((r) => r.atleta_id === athleteId)
      return records.length > 0 ? records[0] : null
    }

    try {
      return await apiClient.get(`/esr/latest?athlete_id=${athleteId}`)
    } catch (error) {
      console.error(" Error fetching latest ESR:", error)
      throw error
    }
  },

  async getESRHistory(athleteId, startDate, endDate) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockESRRecords.filter((r) => {
        if (r.atleta_id !== athleteId) return false
        const recordDate = new Date(r.data)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return recordDate >= start && recordDate <= end
      })
    }

    try {
      const params = new URLSearchParams({
        athlete_id: athleteId,
        start_date: startDate,
        end_date: endDate,
      })
      return await apiClient.get(`/esr/history?${params}`)
    } catch (error) {
      console.error(" Error fetching ESR history:", error)
      throw error
    }
  },
}
