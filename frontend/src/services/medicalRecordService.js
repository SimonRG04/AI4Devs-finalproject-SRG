import apiClient from './apiClient'

export const medicalRecordService = {
  // Obtener todos los registros médicos de una mascota
  async getPetMedicalRecords(petId, page = 1, limit = 10) {
    const response = await apiClient.get(`/medical-records/pet/${petId}`, {
      params: { page, limit }
    })
    return response.data
  },

  // Obtener un registro médico por ID
  async getMedicalRecordById(id) {
    const response = await apiClient.get(`/medical-records/${id}`)
    return response.data
  },

  // Crear nuevo registro médico
  async createMedicalRecord(recordData) {
    const response = await apiClient.post('/medical-records', recordData)
    return response.data
  },

  // Actualizar registro médico
  async updateMedicalRecord(id, recordData) {
    const response = await apiClient.put(`/medical-records/${id}`, recordData)
    return response.data
  },

  // Eliminar registro médico
  async deleteMedicalRecord(id) {
    const response = await apiClient.delete(`/medical-records/${id}`)
    return response.data
  },

  // Obtener registros médicos por cita
  async getRecordsByAppointment(appointmentId) {
    const response = await apiClient.get(`/medical-records/appointment/${appointmentId}`)
    return response.data
  },

  // Obtener historial completo de una mascota
  async getPetFullHistory(petId) {
    const response = await apiClient.get(`/medical-records/pet/${petId}/full-history`)
    return response.data
  },

  // Buscar registros médicos
  async searchMedicalRecords(query, filters = {}) {
    const params = { query, ...filters }
    const response = await apiClient.get('/medical-records/search', { params })
    return response.data
  },

  // Obtener registros médicos del veterinario autenticado
  async getVeterinarianMedicalRecords(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 100,
        includePrescriptions: filters.includePrescriptions || true,
        ...filters
      }
      
      const response = await apiClient.get('/medical-records', { params })
      return response.data
    } catch (error) {
      console.error('Error getting veterinarian medical records:', error)
      throw error
    }
  }
}

export default medicalRecordService 