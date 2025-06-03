import axios from 'axios'

// Configurar URL base según el entorno
const baseURL = import.meta.env.VITE_API_URL || 'https://backend-nestjs-production-4eba.up.railway.app/api'

// Crear instancia de axios
const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor para requests - agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log para debugging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }
    
    return config
  },
  (error) => {
    console.error('Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// Interceptor para responses - manejar errores y refresh de tokens
apiClient.interceptors.response.use(
  (response) => {
    // Log para debugging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Log para debugging
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data)
    }
    
    // Si es un error 401 y no es una petición de login/refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Intentar refresh si tenemos refresh token
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken && !originalRequest.url.includes('/auth/login') && !originalRequest.url.includes('/auth/register')) {
        try {
          // El endpoint de refresh requiere autenticización con el refresh token
          const response = await axios.post(`${baseURL}/auth/refresh`, {}, {
            headers: {
              'Authorization': `Bearer ${refreshToken}`,
              'Content-Type': 'application/json'
            }
          })
          
          const { accessToken, refreshToken: newRefreshToken } = response.data
          
          // Actualizar tokens en localStorage
          localStorage.setItem('accessToken', accessToken)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }
          
          // Actualizar header de la petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          
          // Reintentar petición original
          return apiClient(originalRequest)
        } catch (refreshError) {
          console.error('Error al renovar token:', refreshError)
          // Si falla el refresh, limpiar tokens y redirigir al login
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          
          // Redirigir al login solo si no estamos ya en una página de auth
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login'
          }
          
          return Promise.reject(refreshError)
        }
      } else {
        // Si no hay refresh token, limpiar todo y redirigir al login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login'
        }
      }
    }
    
    // Para otros errores, solo rechazar
    return Promise.reject(error)
  }
)

export default apiClient 