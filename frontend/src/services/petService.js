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
    const params = { 
      page: String(page), 
      limit: String(limit)
    }
    if (search) params.search = search
    
    try {
      const response = await apiClient.get('/pets', { params })
      return response.data
    } catch (error) {
      console.error('Error getting all pets:', error)
      return { data: [], total: 0, page: 1, totalPages: 1 }
    }
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
  },

  // Obtener mascotas de manera segura para veterinarios (evita errores de validación)
  async getPetsSafe(searchOptions = {}) {
    try {
      // Construir parámetros como strings para evitar errores de validación
      const params = {}
      if (searchOptions.page) params.page = String(searchOptions.page || 1)
      if (searchOptions.limit) params.limit = String(searchOptions.limit || 10)
      if (searchOptions.search) params.search = searchOptions.search
      if (searchOptions.includeOwner) params.includeOwner = 'true'
      
      const response = await apiClient.get('/pets', { params })
      
      // Manejar diferentes estructuras de respuesta
      if (response?.data?.data) {
        return {
          data: response.data.data,
          total: response.data.total || 0,
          page: response.data.page || 1,
          totalPages: response.data.totalPages || 1
        }
      } else if (response?.data) {
        const data = Array.isArray(response.data) ? response.data : []
        return {
          data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      }
      
      return { data: [], total: 0, page: 1, totalPages: 1 }
    } catch (error) {
      console.error('Error getting pets safely:', error)
      return { data: [], total: 0, page: 1, totalPages: 1 }
    }
  }
}

export default petService 