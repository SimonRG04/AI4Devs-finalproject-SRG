import apiClient from './apiClient'

const diagnosisService = {
  // Crear nuevo prediagnóstico
  async createPreDiagnosis(diagnosisData) {
    try {
      const response = await apiClient.post('/diagnosis', diagnosisData)
      return response.data
    } catch (error) {
      console.error('Error creating pre-diagnosis:', error)
      throw error
    }
  },

  // Obtener diagnóstico específico por ID
  async getDiagnosis(id) {
    try {
      const response = await apiClient.get(`/diagnosis/${id}`)
      return response.data
    } catch (error) {
      console.error('Error getting diagnosis:', error)
      throw error
    }
  },

  // Obtener todos los diagnósticos del usuario actual
  async getUserDiagnoses() {
    try {
      const response = await apiClient.get('/diagnosis')
      return response.data
    } catch (error) {
      console.error('Error getting user diagnoses:', error)
      throw error
    }
  },

  // Obtener diagnósticos de una mascota específica
  async getPetDiagnoses(petId) {
    try {
      const response = await apiClient.get(`/diagnosis/pet/${petId}`)
      return response.data
    } catch (error) {
      console.error('Error getting pet diagnoses:', error)
      throw error
    }
  },

  // Verificar estado del servicio de IA (solo admin)
  async healthCheck() {
    try {
      const response = await apiClient.get('/diagnosis/health/check')
      return response.data
    } catch (error) {
      console.error('Error checking AI service health:', error)
      throw error
    }
  },

  // Formatear severidad para display
  formatSeverity(severity) {
    const severityMap = {
      'mild': 'Leve',
      'moderate': 'Moderado', 
      'severe': 'Severo'
    }
    return severityMap[severity] || severity
  },

  // Formatear nivel de urgencia
  formatUrgencyLevel(urgency) {
    const urgencyMap = {
      'LOW': { text: 'Baja', color: 'green' },
      'MEDIUM': { text: 'Media', color: 'yellow' },
      'HIGH': { text: 'Alta', color: 'orange' },
      'URGENT': { text: 'Urgente', color: 'red' }
    }
    return urgencyMap[urgency] || { text: urgency, color: 'gray' }
  },

  // Formatear estado del diagnóstico
  formatStatus(status) {
    const statusMap = {
      'PENDING': { text: 'Pendiente', color: 'gray' },
      'PROCESSING': { text: 'Procesando', color: 'blue' },
      'COMPLETED': { text: 'Completado', color: 'green' },
      'FAILED': { text: 'Fallido', color: 'red' }
    }
    return statusMap[status] || { text: status, color: 'gray' }
  },

  // Formatear nivel de confianza
  formatConfidence(confidence) {
    const percentage = Math.round(confidence * 100)
    let level = 'Bajo'
    let color = 'red'
    
    if (percentage >= 80) {
      level = 'Alto'
      color = 'green'
    } else if (percentage >= 60) {
      level = 'Medio'
      color = 'yellow'
    }
    
    return {
      percentage,
      level,
      color
    }
  },

  // Obtener color de severidad para condiciones
  getSeverityColor(severity) {
    const colorMap = {
      'LOW': 'green',
      'MEDIUM': 'yellow', 
      'HIGH': 'red'
    }
    return colorMap[severity] || 'gray'
  },

  // Validar datos de entrada para prediagnóstico
  validateDiagnosisData(data) {
    const errors = {}
    
    if (!data.petId || data.petId <= 0) {
      errors.petId = 'Debe seleccionar una mascota válida'
    }
    
    if (!data.symptoms || data.symptoms.trim().length < 10) {
      errors.symptoms = 'Los síntomas deben tener al menos 10 caracteres'
    }
    
    if (data.symptoms && data.symptoms.length > 1500) {
      errors.symptoms = 'Los síntomas no pueden exceder los 1500 caracteres'
    }
    
    if (data.duration && data.duration.length > 100) {
      errors.duration = 'La duración no puede exceder los 100 caracteres'
    }
    
    if (data.additionalInfo && data.additionalInfo.length > 500) {
      errors.additionalInfo = 'La información adicional no puede exceder los 500 caracteres'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Generar prompt sugerido basado en la especie
  generatePromptSuggestions(species) {
    const suggestions = {
      'DOG': [
        'Mi perro ha estado vomitando desde ayer',
        'No quiere comer y se ve decaído',
        'Está bebiendo mucha agua y orinando frecuentemente',
        'Tiene diarrea y dolor abdominal',
        'Se rasca mucho y tiene irritación en la piel'
      ],
      'CAT': [
        'Mi gato no ha usado la caja de arena',
        'Está ocultándose y no quiere jugar',
        'Tiene secreción en los ojos',
        'No ha comido en 24 horas',
        'Está respirando con dificultad'
      ],
      'BIRD': [
        'Mi ave no está cantando como antes',
        'Tiene las plumas erizadas',
        'No está comiendo sus semillas favoritas',
        'Está en el fondo de la jaula',
        'Tiene secreción nasal'
      ]
    }
    
    return suggestions[species] || [
      'Mi mascota no se comporta de manera normal',
      'Ha perdido el apetito recientemente',
      'Muestra signos de malestar',
      'Está más quieta de lo usual'
    ]
  }
}

export default diagnosisService 