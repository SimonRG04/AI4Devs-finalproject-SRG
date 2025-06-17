import { defineStore } from 'pinia'
import diagnosisService from '@/services/diagnosisService'
import { useToast } from 'vue-toastification'

export const useDiagnosisStore = defineStore('diagnosis', {
  state: () => ({
    diagnoses: [],
    currentDiagnosis: null,
    loading: false,
    creating: false,
    error: null,
    aiServiceHealth: null,
    lastHealthCheck: null
  }),

  getters: {
    // Obtener diagnósticos por mascota
    getDiagnosesByPet: (state) => (petId) => {
      return state.diagnoses.filter(diagnosis => diagnosis.petId === petId)
    },

    // Obtener diagnósticos completados
    completedDiagnoses: (state) => {
      return state.diagnoses.filter(diagnosis => diagnosis.status === 'COMPLETED')
    },

    // Obtener diagnósticos pendientes
    pendingDiagnoses: (state) => {
      return state.diagnoses.filter(diagnosis => 
        diagnosis.status === 'PENDING' || diagnosis.status === 'PROCESSING'
      )
    },

    // Obtener diagnósticos fallidos
    failedDiagnoses: (state) => {
      return state.diagnoses.filter(diagnosis => diagnosis.status === 'FAILED')
    },

    // Verificar si hay diagnósticos cargados
    hasDiagnoses: (state) => {
      return state.diagnoses.length > 0
    },

    // Obtener último diagnóstico por mascota
    getLastDiagnosisByPet: (state) => (petId) => {
      const petDiagnoses = state.diagnoses
        .filter(diagnosis => diagnosis.petId === petId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      return petDiagnoses.length > 0 ? petDiagnoses[0] : null
    }
  },

  actions: {
    // Crear nuevo prediagnóstico
    async createPreDiagnosis(diagnosisData) {
      const toast = useToast()
      this.creating = true
      this.error = null

      try {
        const diagnosis = await diagnosisService.createPreDiagnosis(diagnosisData)
        
        // Agregar al estado local
        this.diagnoses.unshift(diagnosis)
        this.currentDiagnosis = diagnosis

        toast.success('Prediagnóstico creado exitosamente. El análisis se procesará en breve.')
        
        // En lugar de polling directo al diagnóstico, se refrescará desde el appointment
        // El polling se manejará desde las vistas de appointment que tienen mejor control de acceso

        return diagnosis
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear prediagnóstico'
        toast.error(this.error)
        throw error
      } finally {
        this.creating = false
      }
    },

    // Obtener diagnóstico específico
    async fetchDiagnosis(id, showToast = false) {
      const toast = useToast()
      this.loading = true
      this.error = null

      try {
        const diagnosis = await diagnosisService.getDiagnosis(id)
        
        // Actualizar en el estado local
        const index = this.diagnoses.findIndex(d => d.id === id)
        if (index !== -1) {
          this.diagnoses[index] = diagnosis
        } else {
          this.diagnoses.unshift(diagnosis)
        }
        
        this.currentDiagnosis = diagnosis

        if (showToast && diagnosis.status === 'COMPLETED') {
          toast.success('Prediagnóstico completado')
        }

        return diagnosis
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener diagnóstico'
        if (showToast) {
          toast.error(this.error)
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    // Refrescar diagnóstico (usado para polling)
    async refreshDiagnosis(id) {
      try {
        const currentDiagnosis = this.diagnoses.find(d => d.id === id)
        if (currentDiagnosis && (currentDiagnosis.status === 'PENDING' || currentDiagnosis.status === 'PROCESSING')) {
          await this.fetchDiagnosis(id, true)
        }
      } catch (error) {
        console.error('Error refreshing diagnosis:', error)
      }
    },

    // Obtener todos los diagnósticos del usuario
    async fetchUserDiagnoses() {
      this.loading = true
      this.error = null

      try {
        const diagnoses = await diagnosisService.getUserDiagnoses()
        this.diagnoses = diagnoses
        return diagnoses
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener diagnósticos'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Obtener diagnósticos de una mascota
    async fetchPetDiagnoses(petId) {
      this.loading = true
      this.error = null

      try {
        const diagnoses = await diagnosisService.getPetDiagnoses(petId)
        
        // Actualizar diagnósticos existentes o agregar nuevos
        diagnoses.forEach(diagnosis => {
          const index = this.diagnoses.findIndex(d => d.id === diagnosis.id)
          if (index !== -1) {
            this.diagnoses[index] = diagnosis
          } else {
            this.diagnoses.push(diagnosis)
          }
        })

        return diagnoses
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener diagnósticos de la mascota'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Verificar estado del servicio de IA
    async checkAIHealth() {
      try {
        const health = await diagnosisService.healthCheck()
        this.aiServiceHealth = health.deepSeek
        this.lastHealthCheck = new Date()
        return health
      } catch (error) {
        this.aiServiceHealth = false
        this.lastHealthCheck = new Date()
        console.error('Error checking AI health:', error)
        return { deepSeek: false }
      }
    },

    // Limpiar diagnóstico actual
    clearCurrentDiagnosis() {
      this.currentDiagnosis = null
    },

    // Limpiar errores
    clearError() {
      this.error = null
    },

    // Limpiar todos los datos
    clearAll() {
      this.diagnoses = []
      this.currentDiagnosis = null
      this.error = null
      this.aiServiceHealth = null
      this.lastHealthCheck = null
    },

    // Polling para diagnósticos pendientes
    startPollingPendingDiagnoses() {
      const pendingIds = this.pendingDiagnoses.map(d => d.id)
      
      if (pendingIds.length > 0) {
        pendingIds.forEach(id => {
          setTimeout(() => {
            this.refreshDiagnosis(id)
          }, 10000) // Verificar cada 10 segundos
        })
      }
    },

    // Actualizar diagnóstico en tiempo real (para WebSocket o polling)
    updateDiagnosisStatus(diagnosisId, newStatus, results = null) {
      const index = this.diagnoses.findIndex(d => d.id === diagnosisId)
      if (index !== -1) {
        this.diagnoses[index] = {
          ...this.diagnoses[index],
          status: newStatus,
          results: results || this.diagnoses[index].results,
          processedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : this.diagnoses[index].processedAt
        }

        if (this.currentDiagnosis?.id === diagnosisId) {
          this.currentDiagnosis = this.diagnoses[index]
        }

        // Notificar si se completó
        if (newStatus === 'COMPLETED') {
          const toast = useToast()
          toast.success('¡Prediagnóstico completado!')
        }
      }
    }
  }
}) 