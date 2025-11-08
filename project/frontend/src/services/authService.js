import AsyncStorage from "@react-native-async-storage/async-storage"

const MOCK_USERS = {
  "atleta@email.com": {
    id: 1,
    email: "atleta@email.com",
    password: "atleta",
    type: "athlete",
    name: "João Silva",
    athleteId: 1,
  },
  "treinador@email.com": {
    id: 2,
    email: "treinador@email.com",
    password: "treinador",
    type: "coach",
    name: "Dr. Carlos Oliveira",
    coachId: 2,
  },
}

export const authService = {
  async login(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = MOCK_USERS[email]
    if (user && user.password === password) {
      const { password: _, ...userData } = user
      await AsyncStorage.setItem("authToken", `mock-token-${userData.id}`)
      await AsyncStorage.setItem("userData", JSON.stringify(userData))
      return userData
    }

    throw new Error("Email ou senha inválidos")
  },

  async logout() {
    await AsyncStorage.removeItem("authToken")
    await AsyncStorage.removeItem("userData")
  },

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem("userData")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error(" Error getting current user:", error)
      return null
    }
  },

  async updateUser(userId, updatedData) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const userData = await AsyncStorage.getItem("userData")
      if (userData) {
        const currentUser = JSON.parse(userData)
        const updatedUser = { ...currentUser, ...updatedData }
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser))
        return updatedUser
      }
      throw new Error("User not found")
    } catch (error) {
      console.error(" Error updating user:", error)
      throw error
    }
  },

  async register(userData) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (MOCK_USERS[userData.email]) {
      throw new Error("Email já cadastrado")
    }

    const newUser = {
      id: String(Object.keys(MOCK_USERS).length + 1),
      email: userData.email,
      name: userData.name,
      type: userData.type,
      ...(userData.type === "athlete" && {
        athleteId: userData.athleteId,
        birthDate: userData.birthDate,
        weight: userData.weight,
        height: userData.height,
        restingHR: userData.restingHR,
      }),
      ...(userData.type === "coach" && {
        coachId: userData.coachId,
        cref: userData.cref,
        specialty: userData.specialty,
      }),
    }

    MOCK_USERS[userData.email] = {
      ...newUser,
      password: userData.password,
    }

    return newUser
  },
}
