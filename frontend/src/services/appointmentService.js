import apiClient from './apiClient'

const appointmentService = {
  // Obtener citas - puede ser del usuario autenticado o todas (para veterinarios)
  async getAppointments(params = {}) {
    if (params.myAppointments) {
      const queryParams = {}
      if (params.status) queryParams.status = params.status
      
      const response = await apiClient.get('/appointments/my-appointments', { params: queryParams })
      return response.data
    } else {
      // Obtener todas las citas con parámetros de filtrado
      const response = await apiClient.get('/appointments', { params })
      return response.data
    }
  },

  // Obtener una cita por ID
  async getAppointment(id) {
    const response = await apiClient.get(`/appointments/${id}`)
    return response.data
  },

  // Crear nueva cita
  async createAppointment(appointmentData) {
    const response = await apiClient.post('/appointments', appointmentData)
    return response.data
  },

  // Actualizar cita
  async updateAppointment(id, appointmentData) {
    const response = await apiClient.put(`/appointments/${id}`, appointmentData)
    return response.data
  },

  // Cancelar cita
  async cancelAppointment(id, reason = '') {
    const response = await apiClient.patch(`/appointments/${id}/cancel`, { reason })
    return response.data
  },

  // Confirmar cita
  async confirmAppointment(id) {
    const response = await apiClient.patch(`/appointments/${id}/confirm`)
    return response.data
  },

  // Completar cita
  async completeAppointment(id) {
    const response = await apiClient.patch(`/appointments/${id}/complete`)
    return response.data
  },

  // Obtener disponibilidad de horarios
  async getAvailability(veterinarianId, date) {
    const response = await apiClient.get(`/appointments/available-slots`, {
      params: { veterinarianId, date }
    })
    return response.data
  },

  // Obtener citas del día para veterinario
  async getTodayAppointments() {
    const response = await apiClient.get('/appointments/today')
    return response.data
  },

  // Obtener próximas citas
  async getUpcomingAppointments(limit = 5) {
    const response = await apiClient.get('/appointments/upcoming', {
      params: { limit }
    })
    return response.data
  }
}

export default appointmentService 