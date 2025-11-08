import { apiClient, USE_MOCK_DATA } from "../config/api"
import { mockESRRecords } from "../config/mockData"

export const esrService = {
  async getESRRecords(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const records = mockESRRecords
        .filter((r) => r.atleta_id === athleteId)
        .sort((a, b) => new Date(b.data) - new Date(a.data))
      console.log("ESR Records retrieved:", records)
      return records
    }

    try {
      console.log("Fetching ESR records from API for athlete:", athleteId)
      return await apiClient.get(`/esr?atleta_id=${athleteId}`)
    } catch (error) {
      console.error("Error fetching ESR records:", error)
      throw error
    }
  },

  async createESRRecord(esrData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newRecord = {
        id: mockESRRecords.length + 1,
        tipo: esrData.tipo || "Recuperacao",
        valor: esrData.valor,
        data: esrData.data || new Date().toISOString(),
        atleta_id: esrData.atleta_id,
      }
      mockESRRecords.unshift(newRecord)
      console.log("ESR Record created (mock):", newRecord)
      return newRecord
    }

    try {
      console.log("Creating ESR record via API:", esrData)
      return await apiClient.post("/esr", esrData)
    } catch (error) {
      console.error("Error creating ESR record:", error)
      throw error
    }
  },

  async getLatestESR(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const records = mockESRRecords.filter((r) => r.atleta_id === athleteId)
      const sorted = records.sort((a, b) => new Date(b.data) - new Date(a.data))
      const latest = sorted.length > 0 ? sorted[0] : null
      console.log("Latest ESR retrieved:", latest)
      return latest
    }

    try {
      console.log("Fetching latest ESR from API for athlete:", athleteId)
      return await apiClient.get(`/esr/latest?atleta_id=${athleteId}`)
    } catch (error) {
      console.error("Error fetching latest ESR:", error)
      throw error
    }
  },

  async getESRHistory(athleteId, startDate, endDate) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const filtered = mockESRRecords.filter((r) => {
        if (r.atleta_id !== athleteId) return false
        const recordDate = new Date(r.data)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return recordDate >= start && recordDate <= end
      })
      console.log("ESR history retrieved:", filtered)
      return filtered
    }

    try {
      const params = new URLSearchParams({
        atleta_id: athleteId,
        start_date: startDate,
        end_date: endDate,
      })
      console.log("Fetching ESR history from API:", params.toString())
      return await apiClient.get(`/esr/history?${params}`)
    } catch (error) {
      console.error("Error fetching ESR history:", error)
      throw error
    }
  },
}
