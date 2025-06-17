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
    const response = await apiClient.patch(`/appointments/${id}`, appointmentData)
    return response.data
  },

  // Cancelar cita
  async cancelAppointment(id, reason = '') {
    const response = await apiClient.put(`/appointments/${id}/cancel`, { reason })
    return response.data
  },

  // Confirmar cita
  async confirmAppointment(id) {
    const response = await apiClient.put(`/appointments/${id}/confirm`)
    return response.data
  },

  // Completar cita
  async completeAppointment(id) {
    const response = await apiClient.put(`/appointments/${id}/complete`)
    return response.data
  },

  // Obtener disponibilidad de horarios de un veterinario específico
  async getVeterinarianAvailability(veterinarianId, date, duration = 30) {
    const response = await apiClient.get(`/appointments/availability/${veterinarianId}`, {
      params: { date, duration }
    })
    return response.data
  },

  // Obtener disponibilidad de todos los veterinarios
  async getAllVeterinariansAvailability(date, duration = 30) {
    const response = await apiClient.get('/appointments/availability', {
      params: { date, duration }
    })
    return response.data
  },

  // Método legacy para mantener compatibilidad
  async getAvailability(veterinarianId, date) {
    return this.getVeterinarianAvailability(veterinarianId, date)
  },

  // Método más específico para obtener slots disponibles
  async getAvailableSlots(veterinarianId, date, duration = 30) {
    return this.getVeterinarianAvailability(veterinarianId, date, duration)
  },

  // Obtener citas del día para veterinario
  async getTodayAppointments() {
    const response = await apiClient.get('/appointments/today')
    return response.data
  },

  // Obtener próximas citas - versión que funciona con veterinarios
  async getUpcomingAppointments(limit = 5) {
    const response = await apiClient.get('/appointments/upcoming', {
      params: { limit: limit.toString() }
    })
    return response.data
  },

  // Obtener citas de hoy para veterinario (usando endpoint específico)
  async getMyVetTodayAppointments() {
    const today = new Date().toISOString().split('T')[0]
    const response = await apiClient.get('/veterinarians/my-appointments', { 
      params: { date: today } 
    })
    return response.data
  },

  // Obtener próximas citas para veterinario (usando endpoint específico)
  async getMyVetUpcomingAppointments(limit = 5) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateFrom = tomorrow.toISOString().split('T')[0]
    
    const response = await apiClient.get('/veterinarians/my-appointments', { 
      params: { dateFrom } 
    })
    
    // Aplicar límite del lado del cliente
    const data = response?.data || response || []
    return Array.isArray(data) ? data.slice(0, limit) : []
  },

  // Obtener mis citas (para clientes)
  async getMyAppointments(params = {}) {
    const response = await apiClient.get('/appointments/my-appointments', { params })
    return response.data
  },

  // Obtener citas para veterinarios (método que faltaba)
  async getVetAppointments(params = {}) {
    const response = await apiClient.get('/appointments', { params })
    return response.data
  },

  // Obtener mis citas como veterinario (usando el endpoint específico del veterinario)
  async getMyVetAppointments(params = {}) {
    const response = await apiClient.get('/veterinarians/my-appointments', { params })
    return response.data
  },

  // Actualizar estado de cita (método que faltaba)
  async updateAppointmentStatus(id, status) {
    const response = await apiClient.patch(`/appointments/${id}`, { status })
    return response.data
  },

  // Reprogramar cita (método específico)
  async rescheduleAppointment(id, rescheduleData) {
    const response = await apiClient.patch(`/appointments/${id}`, {
      scheduledAt: rescheduleData.scheduled_at,
      notes: rescheduleData.reason ? `Reprogramada: ${rescheduleData.reason}` : undefined
    })
    return response.data
  },

  // Métodos del prediagnóstico
  async refreshPreDiagnosis(appointmentId) {
    try {
      // Esto realmente solo recarga la cita para obtener el estado actualizado del prediagnóstico
      return await this.getAppointment(appointmentId)
    } catch (error) {
      console.error('Error refreshing pre-diagnosis:', error)
      throw error
    }
  },

  // Obtener prediagnóstico específico de una cita
  async getAppointmentPreDiagnosis(appointmentId) {
    try {
      const response = await apiClient.get(`/appointments/${appointmentId}/pre-diagnosis`)
      return response.data
    } catch (error) {
      console.warn('No pre-diagnosis found for appointment:', error)
      return null
    }
  }
}

export default appointmentService 