import { defineStore } from 'pinia'
import apiService from '../services/api.service'

export const useApiStore = defineStore('api', {
  state: () => ({
    connectionStatus: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async testConnection() {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.get('/test')
        this.connectionStatus = 'connected'
        return response
      } catch (error) {
        this.connectionStatus = 'error'
        this.error = error.message || 'Error desconocido'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 