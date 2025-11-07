import AsyncStorage from "@react-native-async-storage/async-storage"

// Mock credentials for development
const MOCK_USERS = {
  "atleta@email.com": {
    email: "atleta@email.com",
    password: "atleta",
    type: "athlete",
    name: "Rafael Silva",
    id: "1",
  },
  "treinador@email.com": {
    email: "treinador@email.com",
    password: "treinador",
    type: "coach",
    name: "Carlos Moreira",
    id: "2",
  },
}

export const authService = {
  // Mock login - replace with real API call when backend is ready
  async login(email, password) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = MOCK_USERS[email]
    if (user && user.password === password) {
      const { password: _, ...userData } = user
      // In production, store the token from backend
      await AsyncStorage.setItem("authToken", `mock-token-${userData.id}`)
      await AsyncStorage.setItem("userData", JSON.stringify(userData))
      return userData
    }

    throw new Error("Email ou senha inválidos")

    // TODO: Replace with real API call
    // const response = await apiClient.post('/auth/login', { email, password });
    // await AsyncStorage.setItem('authToken', response.token);
    // await AsyncStorage.setItem('userData', JSON.stringify(response.user));
    // return response.user;
  },

  async logout() {
    await AsyncStorage.removeItem("authToken")
    await AsyncStorage.removeItem("userData")

    // TODO: Call backend logout endpoint if needed
    // await apiClient.post('/auth/logout');
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
    // Simulate network delay
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

    // TODO: Replace with real API call
    // const response = await apiClient.put(`/users/${userId}`, updatedData);
    // await AsyncStorage.setItem('userData', JSON.stringify(response.user));
    // return response.user;
  },

  async register(userData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if email already exists
    if (MOCK_USERS[userData.email]) {
      throw new Error("Email já cadastrado")
    }

    // Create new user
    const newUser = {
      id: String(Object.keys(MOCK_USERS).length + 1),
      email: userData.email,
      name: userData.name,
      type: userData.type,
      // Store additional data based on user type
      ...(userData.type === "athlete" && {
        birthDate: userData.birthDate,
        weight: userData.weight,
        height: userData.height,
        restingHR: userData.restingHR,
      }),
      ...(userData.type === "coach" && {
        cref: userData.cref,
        specialty: userData.specialty,
      }),
    }

    // In mock mode, add to MOCK_USERS
    MOCK_USERS[userData.email] = {
      ...newUser,
      password: userData.password,
    }

    return newUser

    // TODO: Replace with real API call
    // const response = await apiClient.post('/auth/register', userData);
    // return response.user;
  },
}
