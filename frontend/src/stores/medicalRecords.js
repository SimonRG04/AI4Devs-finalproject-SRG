import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import medicalRecordService from '../services/medicalRecordService'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const useMedicalRecordsStore = defineStore('medicalRecords', () => {
  // Estado
  const medicalRecords = ref([])
  const currentRecord = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    petId: null,
    dateRange: null,
    recordType: 'all'
  })

  // Getters computados
  const filteredRecords = computed(() => {
    let filtered = [...medicalRecords.value]
    
    if (filters.value.petId) {
      filtered = filtered.filter(record => record.petId === filters.value.petId)
    }
    
    if (filters.value.recordType !== 'all') {
      filtered = filtered.filter(record => record.recordType === filters.value.recordType)
    }
    
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      filtered = filtered.filter(record => {
        const recordDate = parseISO(record.createdAt)
        return recordDate >= start && recordDate <= end
      })
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })

  const recordsByPet = computed(() => {
    const grouped = {}
    medicalRecords.value.forEach(record => {
      const petId = record.petId
      if (!grouped[petId]) {
        grouped[petId] = []
      }
      grouped[petId].push(record)
    })
    
    // Ordenar cada grupo por fecha
    Object.keys(grouped).forEach(petId => {
      grouped[petId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })
    
    return grouped
  })

  const recordTypes = computed(() => {
    const types = [...new Set(medicalRecords.value.map(record => record.recordType).filter(Boolean))]
    return types.sort()
  })

  // Acciones
  const fetchMedicalRecords = async (petId = null) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await medicalRecordService.getMedicalRecords(petId)
      
      // Manejar estructura paginada vs array directo
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          // Si es un array directo
          medicalRecords.value = response
        } else if (response.data && Array.isArray(response.data)) {
          // Si es estructura paginada
          medicalRecords.value = response.data
        } else if (Array.isArray(response.data)) {
          // Fallback para otras estructuras
          medicalRecords.value = response.data || []
        } else {
          console.warn('Unexpected response structure:', response)
          medicalRecords.value = []
        }
      } else {
        medicalRecords.value = []
      }
      
      return medicalRecords.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar registros médicos'
      medicalRecords.value = [] // Asegurar que siempre sea un array
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMedicalRecord = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await medicalRecordService.getMedicalRecord(id)
      currentRecord.value = response.data || response
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar registro médico'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createMedicalRecord = async (recordData) => {
    try {
      loading.value = true
      error.value = null
      
      // Validar datos básicos antes de enviar
      if (!recordData.petId) {
        throw new Error('ID de mascota es requerido')
      }
      if (!recordData.diagnosis) {
        throw new Error('Diagnóstico es requerido')
      }
      if (!recordData.treatment) {
        throw new Error('Tratamiento es requerido')
      }
      
      const response = await medicalRecordService.createMedicalRecord(recordData)
      const newRecord = response.data || response
      
      // Agregar el nuevo registro a la lista
      medicalRecords.value.unshift(newRecord)
      
      // Refrescar todos los registros para asegurar sincronización
      setTimeout(() => refreshAllMedicalRecords(recordData.petId), 1000)
      
      return newRecord
    } catch (err) {
      console.error('Error creating medical record:', err)
      error.value = err.response?.data?.message || err.message || 'Error al crear registro médico'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMedicalRecord = async (id, recordData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await medicalRecordService.updateMedicalRecord(id, recordData)
      const updatedRecord = response.data || response
      
      // Actualizar en la lista
      const index = medicalRecords.value.findIndex(record => record.id === id)
      if (index !== -1) {
        medicalRecords.value[index] = updatedRecord
      }
      
      // Actualizar registro actual si es el mismo
      if (currentRecord.value?.id === id) {
        currentRecord.value = updatedRecord
      }
      
      // Refrescar datos del servidor para asegurar sincronización
      await refreshMedicalRecord(id)
      
      return updatedRecord
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar registro médico'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMedicalRecord = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      await medicalRecordService.deleteMedicalRecord(id)
      
      // Remover de la lista
      medicalRecords.value = medicalRecords.value.filter(record => record.id !== id)
      
      // Limpiar registro actual si es el mismo
      if (currentRecord.value?.id === id) {
        currentRecord.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar registro médico'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentRecord = (record) => {
    currentRecord.value = record
  }

  const clearCurrentRecord = () => {
    currentRecord.value = null
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      petId: null,
      dateRange: null,
      recordType: 'all'
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Métodos de refresh para sincronización automática
  const refreshMedicalRecord = async (id) => {
    try {
      const response = await medicalRecordService.getMedicalRecord(id)
      const refreshedRecord = response.data || response
      
      // Actualizar en la lista si existe
      const index = medicalRecords.value.findIndex(record => record.id === id)
      if (index !== -1) {
        medicalRecords.value[index] = refreshedRecord
      }
      
      // Actualizar registro actual si es el mismo
      if (currentRecord.value?.id === id) {
        currentRecord.value = refreshedRecord
      }
      
      return refreshedRecord
    } catch (err) {
      console.warn('Error refreshing medical record:', err)
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  const refreshAllMedicalRecords = async (petId = null) => {
    try {
      await fetchMedicalRecords(petId)
    } catch (err) {
      console.warn('Error refreshing all medical records:', err)
    }
  }

  // Método de compatibilidad
  const fetchByPetId = async (petId) => {
    return await fetchMedicalRecords(petId)
  }

  // Utilidades para formateo
  const formatRecordDate = (dateString) => {
    return format(parseISO(dateString), 'PPpp', { locale: es })
  }

  const getRecordTypeLabel = (recordType) => {
    const typeMap = {
      'CONSULTATION': 'Consulta',
      'VACCINATION': 'Vacunación',
      'SURGERY': 'Cirugía',
      'EMERGENCY': 'Emergencia',
      'CHECKUP': 'Chequeo',
      'TREATMENT': 'Tratamiento'
    }
    return typeMap[recordType] || recordType
  }

  return {
    // Estado
    medicalRecords,
    currentRecord,
    loading,
    error,
    filters,
    
    // Getters
    filteredRecords,
    recordsByPet,
    recordTypes,
    
    // Acciones
    fetchMedicalRecords,
    fetchMedicalRecord,
    fetchByPetId,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    setCurrentRecord,
    clearCurrentRecord,
    setFilters,
    clearFilters,
    clearError,
    
    // Métodos de refresh
    refreshMedicalRecord,
    refreshAllMedicalRecords,
    
    // Utilidades
    formatRecordDate,
    getRecordTypeLabel
  }
}) 