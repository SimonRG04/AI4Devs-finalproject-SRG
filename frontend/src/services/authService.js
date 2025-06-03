import apiClient from './apiClient'

const authService = {
  // Login de usuario
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  // Registro de nuevo cliente
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  // Logout
  async logout() {
    // En el backend actual no hay endpoint específico de logout
    // pero podríamos implementarlo para invalidar tokens
    return Promise.resolve()
  },

  // Refresh de tokens - el backend usa el token del header Authorization
  async refresh() {
    const response = await apiClient.post('/auth/refresh')
    return response.data
  },

  // Obtener perfil actual
  async getProfile() {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  // Actualizar perfil
  async updateProfile(profileData) {
    const response = await apiClient.put('/auth/profile', profileData)
    return response.data
  }
}

export default authService 