import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import petService from '../services/petService'

export const usePetsStore = defineStore('pets', () => {
  // Estado
  const pets = ref([])
  const currentPet = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    species: '',
    status: 'active'
  })

  // Getters computados
  const filteredPets = computed(() => {
    let filtered = [...pets.value]
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(search) ||
        pet.species.toLowerCase().includes(search) ||
        pet.breed?.toLowerCase().includes(search)
      )
    }
    
    if (filters.value.species) {
      filtered = filtered.filter(pet => pet.species === filters.value.species)
    }
    
    if (filters.value.status === 'active') {
      filtered = filtered.filter(pet => !pet.isDeleted)
    }
    
    return filtered
  })

  const petSpecies = computed(() => {
    const species = [...new Set(pets.value.map(pet => pet.species))]
    return species.sort()
  })

  // Acciones
  const fetchPets = async (clientId = null) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await petService.getPets(clientId)
      pets.value = response.data || response
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar mascotas'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPet = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await petService.getPet(id)
      currentPet.value = response.data || response
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar mascota'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createPet = async (petData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await petService.createPet(petData)
      const newPet = response.data || response
      
      // Agregar la nueva mascota a la lista
      pets.value.push(newPet)
      
      return newPet
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear mascota'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePet = async (id, petData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await petService.updatePet(id, petData)
      const updatedPet = response.data || response
      
      // Actualizar en la lista
      const index = pets.value.findIndex(pet => pet.id === id)
      if (index !== -1) {
        pets.value[index] = updatedPet
      }
      
      // Actualizar mascota actual si es la misma
      if (currentPet.value?.id === id) {
        currentPet.value = updatedPet
      }
      
      return updatedPet
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar mascota'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePet = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      await petService.deletePet(id)
      
      // Remover de la lista
      pets.value = pets.value.filter(pet => pet.id !== id)
      
      // Limpiar mascota actual si es la misma
      if (currentPet.value?.id === id) {
        currentPet.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar mascota'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPet = (pet) => {
    currentPet.value = pet
  }

  const clearCurrentPet = () => {
    currentPet.value = null
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      species: '',
      status: 'active'
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // Estado
    pets,
    currentPet,
    loading,
    error,
    filters,
    
    // Getters
    filteredPets,
    petSpecies,
    
    // Acciones
    fetchPets,
    fetchPet,
    createPet,
    updatePet,
    deletePet,
    setCurrentPet,
    clearCurrentPet,
    setFilters,
    clearFilters,
    clearError
  }
}) 