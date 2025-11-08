import { apiClient, USE_MOCK_DATA } from "../config/api"
import { mockAthletes, mockAthleteStats } from "../config/mockData"

export const athleteService = {
  async getAthletes(coachId = null) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (coachId) {
        return mockAthletes.filter((a) => a.treinador_id === coachId)
      }
      return mockAthletes
    }

    try {
      const url = coachId ? `/athletes?coach_id=${coachId}` : "/athletes"
      const data = await apiClient.get(url)
      return data.map((athlete) => ({
        ...athlete,
        name: athlete.nome || athlete.name,
        age: athlete.age || calculateAge(athlete.data_nascimento),
        hrRep: athlete.frequencia_cardiaca_repouso || athlete.hrRep,
        esr: athlete.ultimaESR || athlete.esr,
      }))
    } catch (error) {
      console.error(" Error fetching athletes:", error)
      throw error
    }
  },

  async getAthleteById(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const athlete = mockAthletes.find((a) => a.id === athleteId)
      return athlete
        ? {
            ...athlete,
            name: athlete.nome || athlete.name,
            age: calculateAge(athlete.data_nascimento),
            hrRep: athlete.frequencia_cardiaca_repouso,
            esr: athlete.ultimaESR,
          }
        : null
    }

    try {
      const data = await apiClient.get(`/athletes/${athleteId}`)
      return {
        ...data,
        name: data.nome || data.name,
        age: data.age || calculateAge(data.data_nascimento),
        hrRep: data.frequencia_cardiaca_repouso || data.hrRep,
        esr: data.ultimaESR || data.esr,
      }
    } catch (error) {
      console.error(" Error fetching athlete:", error)
      throw error
    }
  },

  async createAthlete(athleteData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newAthlete = {
        id: mockAthletes.length + 1,
        ...athleteData,
        ultimaESR: null,
        ultimaAvaliacao: null,
      }
      mockAthletes.push(newAthlete)
      return newAthlete
    }

    try {
      return await apiClient.post("/athletes", athleteData)
    } catch (error) {
      console.error(" Error creating athlete:", error)
      throw error
    }
  },

  async updateAthlete(athleteId, athleteData) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const index = mockAthletes.findIndex((a) => a.id === athleteId)
      if (index > -1) {
        mockAthletes[index] = { ...mockAthletes[index], ...athleteData }
        return mockAthletes[index]
      }
      throw new Error("Athlete not found")
    }

    try {
      return await apiClient.put(`/athletes/${athleteId}`, athleteData)
    } catch (error) {
      console.error(" Error updating athlete:", error)
      throw error
    }
  },

  async deleteAthlete(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const index = mockAthletes.findIndex((a) => a.id === athleteId)
      if (index > -1) {
        mockAthletes.splice(index, 1)
      }
      return { success: true }
    }

    try {
      return await apiClient.delete(`/athletes/${athleteId}`)
    } catch (error) {
      console.error(" Error deleting athlete:", error)
      throw error
    }
  },

  async getAthleteStats(athleteId) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return (
        mockAthleteStats[athleteId] || {
          weeklySessionsCompleted: 3,
          weeklySessionsTotal: 5,
          totalLoad: 245,
          streak: 7,
          totalMinutes: 285,
          weeklyProgress: {
            completed: 3,
            total: 5,
            percentage: 60,
            nextSession: "Treino Aeróbico - Amanhã 09:00",
          },
          esrMedio: 6.7,
          totalTreinos: 5,
          tempoTotal: "3.5h",
          melhorESR: 10,
          piorESR: 4,
        }
      )
    }

    try {
      return await apiClient.get(`/athletes/${athleteId}/stats`)
    } catch (error) {
      console.error(" Error fetching athlete stats:", error)
      throw error
    }
  },

  async addAthleteByEmail(email) {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simulate finding athlete by email
      const existingAthlete = mockAthletes.find((a) => a.email === email)

      if (existingAthlete) {
        // Check if already added
        if (existingAthlete.treinadorId) {
          return { success: false, error: "Atleta já possui um treinador" }
        }

        // Add coach to athlete
        existingAthlete.treinadorId = 2 // Mock coach ID
        return { success: true, athlete: existingAthlete }
      }

      return { success: false, error: "Atleta não encontrado com este email" }
    }

    try {
      const response = await apiClient.post("/coach/add-athlete", { email })
      return { success: true, athlete: response.athlete }
    } catch (error) {
      console.error(" Error adding athlete:", error)
      return { success: false, error: error.message || "Erro ao adicionar atleta" }
    }
  },
}

function calculateAge(birthDate) {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}
