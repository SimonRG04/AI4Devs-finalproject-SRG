// =================================
// Error Handler - VetAI Connect Frontend
// =================================

import { useToast } from 'vue-toastification'

/**
 * Tipos de errores de la aplicación
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
}

/**
 * Mapeo de códigos de estado HTTP a tipos de error
 */
const STATUS_TO_ERROR_TYPE = {
  400: ErrorTypes.VALIDATION,
  401: ErrorTypes.AUTHENTICATION,
  403: ErrorTypes.AUTHORIZATION,
  404: ErrorTypes.NOT_FOUND,
  422: ErrorTypes.VALIDATION,
  500: ErrorTypes.SERVER,
  502: ErrorTypes.NETWORK,
  503: ErrorTypes.NETWORK,
  504: ErrorTypes.NETWORK
}

/**
 * Mensajes de error user-friendly
 */
const ERROR_MESSAGES = {
  [ErrorTypes.NETWORK]: {
    title: 'Error de Conexión',
    message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
    action: 'Reintentar'
  },
  [ErrorTypes.VALIDATION]: {
    title: 'Datos Inválidos',
    message: 'Los datos ingresados no son válidos. Revisa la información.',
    action: 'Corregir'
  },
  [ErrorTypes.AUTHENTICATION]: {
    title: 'Sesión Expirada',
    message: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    action: 'Iniciar Sesión'
  },
  [ErrorTypes.AUTHORIZATION]: {
    title: 'Acceso Denegado',
    message: 'No tienes permisos para realizar esta acción.',
    action: 'Contactar Soporte'
  },
  [ErrorTypes.NOT_FOUND]: {
    title: 'Recurso No Encontrado',
    message: 'El elemento que buscas no existe o ha sido eliminado.',
    action: 'Volver'
  },
  [ErrorTypes.SERVER]: {
    title: 'Error del Servidor',
    message: 'Ocurrió un error en el servidor. Intenta nuevamente más tarde.',
    action: 'Reintentar'
  },
  [ErrorTypes.UNKNOWN]: {
    title: 'Error Inesperado',
    message: 'Ocurrió un error inesperado. Intenta nuevamente.',
    action: 'Reintentar'
  }
}

/**
 * Clase para manejar errores de la aplicación
 */
export class AppError extends Error {
  constructor(type, message, originalError = null, context = {}) {
    super(message)
    this.type = type
    this.originalError = originalError
    this.context = context
    this.timestamp = new Date().toISOString()
    this.name = 'AppError'
  }
}

/**
 * Handler principal de errores
 */
export class ErrorHandler {
  constructor() {
    this.toast = useToast()
    this.errorLog = []
  }

  /**
   * Procesa un error y determina su tipo
   */
  processError(error, context = {}) {
    let errorType = ErrorTypes.UNKNOWN
    let errorMessage = 'Error desconocido'
    let statusCode = null

    // Error de Axios/HTTP
    if (error.response) {
      statusCode = error.response.status
      errorType = STATUS_TO_ERROR_TYPE[statusCode] || ErrorTypes.SERVER
      errorMessage = error.response.data?.message || error.message
    }
    // Error de red
    else if (error.request) {
      errorType = ErrorTypes.NETWORK
      errorMessage = 'Error de conexión'
    }
    // Error de aplicación
    else if (error instanceof AppError) {
      errorType = error.type
      errorMessage = error.message
    }
    // Error JavaScript genérico
    else {
      errorType = ErrorTypes.UNKNOWN
      errorMessage = error.message || 'Error inesperado'
    }

    const appError = new AppError(errorType, errorMessage, error, {
      ...context,
      statusCode,
      url: error.config?.url,
      method: error.config?.method
    })

    this.logError(appError)
    return appError
  }

  /**
   * Muestra notificación de error al usuario
   */
  showError(error, options = {}) {
    const { showToast = true, customMessage = null } = options
    
    const processedError = this.processError(error)
    const errorConfig = ERROR_MESSAGES[processedError.type]

    if (showToast) {
      this.toast.error(customMessage || errorConfig.message, {
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true
      })
    }

    return {
      type: processedError.type,
      title: errorConfig.title,
      message: customMessage || errorConfig.message,
      action: errorConfig.action,
      originalError: processedError
    }
  }

  /**
   * Registra el error para debugging
   */
  logError(error) {
    // En desarrollo, mostrar en consola
    if (import.meta.env.DEV) {
      console.group('🚨 Error Handler')
      console.error('Type:', error.type)
      console.error('Message:', error.message)
      console.error('Context:', error.context)
      console.error('Original:', error.originalError)
      console.groupEnd()
    }

    // Mantener log limitado
    this.errorLog.unshift(error)
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(0, 100)
    }

    // En producción, enviar a servicio de monitoreo
    if (import.meta.env.PROD) {
      this.sendToMonitoringService(error)
    }
  }

  /**
   * Enviar errores a servicio de monitoreo (Sentry, etc.)
   */
  sendToMonitoringService(error) {
    // TODO: Integrar con Sentry o similar
    console.log('Enviando error a servicio de monitoreo:', error)
  }

  /**
   * Obtener estadísticas de errores
   */
  getErrorStats() {
    const stats = {}
    this.errorLog.forEach(error => {
      stats[error.type] = (stats[error.type] || 0) + 1
    })
    return stats
  }

  /**
   * Limpiar log de errores
   */
  clearErrorLog() {
    this.errorLog = []
  }
}

// Instancia global del manejador de errores
export const errorHandler = new ErrorHandler()

/**
 * Plugin de Vue para manejo global de errores
 */
export function installErrorHandler(app) {
  // Manejo de errores de Vue
  app.config.errorHandler = (error, vm, info) => {
    const appError = errorHandler.processError(error, {
      component: vm?.$options.name || 'Unknown',
      errorInfo: info
    })
    
    errorHandler.showError(appError, {
      customMessage: `Error en componente: ${appError.message}`
    })
  }

  // Manejo de errores no capturados
  window.addEventListener('unhandledrejection', (event) => {
    const appError = errorHandler.processError(event.reason, {
      type: 'unhandledrejection'
    })
    
    errorHandler.showError(appError)
    event.preventDefault()
  })

  // Hacer disponible globalmente
  app.config.globalProperties.$errorHandler = errorHandler
}

/**
 * Composable para usar el manejador de errores en componentes
 */
export function useErrorHandler() {
  return {
    showError: (error, options) => errorHandler.showError(error, options),
    processError: (error, context) => errorHandler.processError(error, context),
    createError: (type, message, context) => new AppError(type, message, null, context)
  }
} 