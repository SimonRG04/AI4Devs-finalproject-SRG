import apiClient from './apiClient'

export const veterinarianService = {
  // Obtener todos los veterinarios
  async getAllVeterinarians(page = 1, limit = 10, specialty = null) {
    const params = { page, limit }
    if (specialty) params.specialty = specialty
    
    const response = await apiClient.get('/veterinarians', { params })
    return response.data
  },

  // Obtener veterinario por ID
  async getVeterinarianById(id) {
    const response = await apiClient.get(`/veterinarians/${id}`)
    return response.data
  },

  // Obtener perfil del veterinario autenticado
  async getMyProfile() {
    const response = await apiClient.get('/veterinarians/profile')
    return response.data
  },

  // Actualizar perfil del veterinario
  async updateProfile(profileData) {
    const response = await apiClient.put('/veterinarians/profile', profileData)
    return response.data
  },

  // Obtener especialidades disponibles
  async getSpecialties() {
    const response = await apiClient.get('/veterinarians/specialties')
    return response.data
  },

  // Obtener horarios de un veterinario
  async getVeterinarianSchedule(veterinarianId, date = null) {
    const params = {}
    if (date) params.date = date
    
    const response = await apiClient.get(`/veterinarians/${veterinarianId}/schedule`, { params })
    return response.data
  },

  // Actualizar horarios del veterinario
  async updateSchedule(scheduleData) {
    const response = await apiClient.put('/veterinarians/schedule', scheduleData)
    return response.data
  },

  // Obtener estadísticas del veterinario
  async getVeterinarianStats(veterinarianId = null) {
    const endpoint = veterinarianId 
      ? `/veterinarians/${veterinarianId}/stats`
      : '/veterinarians/my-stats'
    
    const response = await apiClient.get(endpoint)
    return response.data
  },

  // Obtener citas del veterinario
  async getVeterinarianAppointments(veterinarianId = null, date = null, status = null) {
    const params = {}
    if (date) params.date = date
    if (status) params.status = status
    
    const endpoint = veterinarianId 
      ? `/veterinarians/${veterinarianId}/appointments`
      : '/veterinarians/my-appointments'
    
    const response = await apiClient.get(endpoint, { params })
    return response.data
  }
}

export default veterinarianService 