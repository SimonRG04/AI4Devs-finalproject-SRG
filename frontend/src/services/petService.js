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
    const response = await apiClient.patch(`/pets/${id}`, petData)
    return response.data
  },

  // Eliminar mascota
  async deletePet(id) {
    const response = await apiClient.delete(`/pets/${id}`)
    return response.data
  },

  // Obtener historial médico de una mascota
  async getPetMedicalHistory(petId) {
    const response = await apiClient.get(`/medical-records/pet/${petId}`)
    return response.data
  },

  // Obtener citas de una mascota
  async getPetAppointments(petId, params = {}) {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params
    }
    const response = await apiClient.get(`/pets/${petId}/appointments`, { params: queryParams })
    return response.data
  },

  // Obtener vacunas de una mascota
  async getPetVaccinations(petId) {
    const response = await apiClient.get(`/pets/${petId}/vaccinations`)
    return response.data
  },

  // Buscar mascotas para veterinarios (por nombre de mascota o propietario)
  async searchPets(searchOptions = {}) {
    const params = {}
    if (searchOptions.query) params.search = searchOptions.query
    if (searchOptions.includeOwner) params.includeOwner = true
    if (searchOptions.limit) params.limit = searchOptions.limit || 10
    
    const response = await apiClient.get('/pets', { params })
    return response.data
  },

  // Obtener mis mascotas (para clientes)
  async getMyPets() {
    const response = await apiClient.get('/pets/my-pets')
    return response.data
  }
}

export default petService 