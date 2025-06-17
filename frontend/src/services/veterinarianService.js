import apiClient from './apiClient'

export const veterinarianService = {
  // Obtener lista de veterinarios
  async getVeterinarians(params = {}) {
    const response = await apiClient.get('/veterinarians', { params })
    return response.data
  },

  // Alias para compatibilidad
  async getAllVeterinarians(params = {}) {
    return this.getVeterinarians(params)
  },

  // Obtener veterinario por ID
  async getVeterinarian(id) {
    const response = await apiClient.get(`/veterinarians/${id}`)
    return response.data
  },

  // Obtener perfil del veterinario autenticado
  async getProfile() {
    const response = await apiClient.get('/veterinarians/profile')
    return response.data
  },

  // Alias para compatibilidad
  async getMyProfile() {
    return this.getProfile()
  },

  // Actualizar perfil del veterinario
  async updateProfile(profileData) {
    const response = await apiClient.put('/veterinarians/profile', profileData)
    return response.data
  },

  // Obtener estadísticas del veterinario autenticado
  async getMyStats() {
    const response = await apiClient.get('/veterinarians/my-stats')
    return response.data
  },

  // Obtener especialidades disponibles
  async getSpecialties() {
    const response = await apiClient.get('/veterinarians/specialties')
    return response.data
  },

  // Obtener disponibilidad de un veterinario
  async getAvailability(veterinarianId, date, duration = 30) {
    const params = { date, duration }
    const response = await apiClient.get(`/appointments/availability/${veterinarianId}`, { params })
    return response.data
  },

  // Obtener disponibilidad de todos los veterinarios
  async getAllAvailability(date, duration = 30) {
    const params = { date, duration }
    const response = await apiClient.get('/appointments/availability', { params })
    return response.data
  },

  // Buscar veterinarios (con filtros opcionales)
  async searchVeterinarians(searchParams = {}) {
    // Construir parámetros de manera segura
    const params = {}
    if (searchParams.search) params.search = searchParams.search
    if (searchParams.specialization) params.specialization = searchParams.specialization
    if (searchParams.page) params.page = String(searchParams.page)
    if (searchParams.limit) params.limit = String(searchParams.limit)
    
    const response = await apiClient.get('/veterinarians', { params })
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
  },

  // Obtener pacientes recientes del veterinario
  async getRecentPatients(limit = 10) {
    try {
      // Usar el endpoint seguro de pets con parámetros como strings
      const params = {
        page: '1',
        limit: String(limit),
        includeOwner: 'true'
      }
      const response = await apiClient.get('/pets', { params })
      
      // Extraer datos de manera robusta
      const pets = response?.data?.data || response?.data || response || []
      return Array.isArray(pets) ? pets : []
    } catch (error) {
      console.error('Error getting recent patients:', error)
      return []
    }
  },

  // Obtener estadísticas del dashboard de manera segura
  async getDashboardStats() {
    try {
      // Simplificar: usar directamente el endpoint de estadísticas real del backend
      const response = await this.getMyStats()
      return response?.data || response || {
        todayAppointments: 0,
        upcomingAppointments: 0,
        totalPatients: 0,
        patientsWithAlerts: 0,
        monthlyAppointments: 0,
        completedAppointments: 0
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      return {
        todayAppointments: 0,
        upcomingAppointments: 0,
        totalPatients: 0,
        patientsWithAlerts: 0,
        monthlyAppointments: 0,
        completedAppointments: 0
      }
    }
  },

  // Obtener veterinario por ID de usuario
  async getVeterinarianByUserId(userId) {
    const response = await apiClient.get(`/veterinarians/user/${userId}`)
    return response.data
  },

  // Obtener todas las especialidades disponibles
  async getSpecializations() {
    const response = await apiClient.get('/veterinarians/specializations')
    return response.data
  },

  // Obtener horario del veterinario
  async getSchedule(veterinarianId, date = null) {
    const params = {}
    if (date) params.date = date
    
    const response = await apiClient.get(`/veterinarians/${veterinarianId}/schedule`, { params })
    return response.data
  },

  // Obtener mi horario
  async getMySchedule(date = null) {
    const params = {}
    if (date) params.date = date
    
    const response = await apiClient.get('/veterinarians/schedule', { params })
    return response.data
  },

  // Actualizar mi horario
  async updateMySchedule(scheduleData) {
    const response = await apiClient.put('/veterinarians/schedule', scheduleData)
    return response.data
  }
}

export default veterinarianService 