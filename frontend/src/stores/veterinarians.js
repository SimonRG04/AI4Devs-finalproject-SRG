import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import veterinarianService from '../services/veterinarianService'

export const useVeterinariansStore = defineStore('veterinarians', () => {
  // Estado
  const veterinarians = ref([])
  const currentVeterinarian = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    specialization: '',
    status: 'active'
  })

  // Getters computados
  const filteredVeterinarians = computed(() => {
    let filtered = [...veterinarians.value]
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(vet => 
        vet.user?.firstName?.toLowerCase().includes(search) ||
        vet.user?.lastName?.toLowerCase().includes(search) ||
        vet.specialization?.toLowerCase().includes(search) ||
        vet.licenseNumber?.toLowerCase().includes(search)
      )
    }
    
    if (filters.value.specialization) {
      filtered = filtered.filter(vet => vet.specialization === filters.value.specialization)
    }
    
    if (filters.value.status === 'active') {
      filtered = filtered.filter(vet => vet.isActive)
    }
    
    return filtered
  })

  const availableVeterinarians = computed(() => {
    return veterinarians.value.filter(vet => vet.isActive)
  })

  const specializations = computed(() => {
    const specs = [...new Set(veterinarians.value.map(vet => vet.specialization).filter(Boolean))]
    return specs.sort()
  })

  // Acciones
  const fetchVeterinarians = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await veterinarianService.getVeterinarians()
      veterinarians.value = response.data || response
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar veterinarios'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchVeterinarian = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await veterinarianService.getVeterinarian(id)
      currentVeterinarian.value = response.data || response
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar veterinario'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVeterinarian = async (id, veterinarianData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await veterinarianService.updateVeterinarian(id, veterinarianData)
      const updatedVeterinarian = response.data || response
      
      // Actualizar en la lista
      const index = veterinarians.value.findIndex(vet => vet.id === id)
      if (index !== -1) {
        veterinarians.value[index] = updatedVeterinarian
      }
      
      // Actualizar veterinario actual si es el mismo
      if (currentVeterinarian.value?.id === id) {
        currentVeterinarian.value = updatedVeterinarian
      }
      
      return updatedVeterinarian
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar veterinario'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchVeterinarianSchedule = async (veterinarianId, date) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await veterinarianService.getSchedule(veterinarianId, date)
      
      return response.data || response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar horario'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentVeterinarian = (veterinarian) => {
    currentVeterinarian.value = veterinarian
  }

  const clearCurrentVeterinarian = () => {
    currentVeterinarian.value = null
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      specialization: '',
      status: 'active'
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // Estado
    veterinarians,
    currentVeterinarian,
    loading,
    error,
    filters,
    
    // Getters
    filteredVeterinarians,
    availableVeterinarians,
    specializations,
    
    // Acciones
    fetchVeterinarians,
    fetchVeterinarian,
    updateVeterinarian,
    fetchVeterinarianSchedule,
    setCurrentVeterinarian,
    clearCurrentVeterinarian,
    setFilters,
    clearFilters,
    clearError
  }
}) 