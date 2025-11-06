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

  async register(userData) {
    // TODO: Implement registration with backend
    // return await apiClient.post('/auth/register', userData);
    throw new Error("Registration not implemented yet")
  },
}
