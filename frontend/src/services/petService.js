import apiClient from './apiClient'

const petService = {
  // Obtener mascotas - puede ser del cliente autenticado o todas (para veterinarios)
  async getPets(clientId = null) {
    if (clientId) {
      const response = await apiClient.get(`/pets?clientId=${clientId}`)
      return response.data
    } else {
      // Si no se especifica clientId, obtener las mascotas del usuario autenticado
      const response = await apiClient.get('/pets/my-pets')
      return response.data
    }
  },

  // Obtener todas las mascotas con paginación (para veterinarios)
  async getAllPets(page = 1, limit = 10, search = '') {
    const params = { page, limit }
    if (search) params.search = search
    
    const response = await apiClient.get('/pets', { params })
    return response.data
  },

  // Obtener una mascota por ID
  async getPet(id) {
    const response = await apiClient.get(`/pets/${id}`)
    return response.data
  },

  // Crear nueva mascota
  async createPet(petData) {
    const response = await apiClient.post('/pets', petData)
    return response.data
  },

  // Actualizar mascota
  async updatePet(id, petData) {
    const response = await apiClient.put(`/pets/${id}`, petData)
    return response.data
  },

  // Eliminar mascota
  async deletePet(id) {
    const response = await apiClient.delete(`/pets/${id}`)
    return response.data
  },

  // Obtener historial médico de una mascota
  async getPetMedicalHistory(petId) {
    const response = await apiClient.get(`/pets/${petId}/medical-records`)
    return response.data
  },

  // Obtener citas de una mascota
  async getPetAppointments(petId) {
    const response = await apiClient.get(`/pets/${petId}/appointments`)
    return response.data
  },

  // Obtener vacunas de una mascota
  async getPetVaccinations(petId) {
    const response = await apiClient.get(`/pets/${petId}/vaccinations`)
    return response.data
  }
}

export default petService 