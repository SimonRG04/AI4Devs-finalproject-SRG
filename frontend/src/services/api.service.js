import axios from 'axios'

// Crear instancia de axios con la configuración básica
const apiClient = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://backend-nestjs-production-4eba.up.railway.app/api'
    : '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 segundos
})

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Gestionar errores de conexión
    if (!error.response) {
      console.error('Error de conexión:', error.message)
      return Promise.reject(new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.'))
    }
    
    // Manejar errores HTTP
    const { status, data } = error.response
    
    // Devolver un mensaje de error más amigable basado en el código de estado
    let errorMessage = data?.message || 'Ha ocurrido un error inesperado'
    
    if (status === 404) {
      errorMessage = 'El recurso solicitado no fue encontrado'
    } else if (status === 500) {
      errorMessage = 'Error interno del servidor'
    } else if (status === 401) {
      errorMessage = 'No estás autorizado para realizar esta acción'
    } else if (status === 403) {
      errorMessage = 'No tienes permisos para acceder a este recurso'
    }
    
    return Promise.reject(new Error(errorMessage))
  }
)

// Métodos simplificados para interactuar con la API
export default {
  // GET request
  get(url, params = {}) {
    return apiClient.get(url, { params })
  },
  
  // POST request
  post(url, data = {}) {
    return apiClient.post(url, data)
  },
  
  // PUT request
  put(url, data = {}) {
    return apiClient.put(url, data)
  },
  
  // DELETE request
  delete(url) {
    return apiClient.delete(url)
  }
} 