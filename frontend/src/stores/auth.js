import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  const loading = ref(false)
  const error = ref(null)

  // Getters computados
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isClient = computed(() => userRole.value === 'CLIENT')
  const isVet = computed(() => userRole.value === 'VET')
  const isAdmin = computed(() => userRole.value === 'ADMIN')
  const userName = computed(() => {
    if (!user.value) return ''
    return user.value.fullName || `${user.value.firstName} ${user.value.lastName}`
  })

  // Acciones
  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authService.login(credentials)
      
      // Guardar tokens y usuario
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      user.value = response.user
      
      // Persistir en localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authService.register(userData)
      
      // El backend ya devuelve los tokens después del registro
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      user.value = response.user
      
      // Persistir en localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al registrar usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      // Intentar logout en el servidor (si el token es válido)
      if (accessToken.value) {
        await authService.logout()
      }
    } catch (err) {
      // Incluso si falla, limpiar estado local
      console.warn('Error al hacer logout en servidor:', err)
    } finally {
      // Limpiar estado local
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      error.value = null
      
      // Limpiar localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  const refreshTokens = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }
      
      // Temporalmente establecer el refresh token como access token para la petición
      accessToken.value = refreshToken.value
      localStorage.setItem('accessToken', refreshToken.value)
      
      const response = await authService.refresh()
      
      accessToken.value = response.accessToken
      if (response.refreshToken) {
        refreshToken.value = response.refreshToken
      }
      
      localStorage.setItem('accessToken', response.accessToken)
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }
      
      return response
    } catch (err) {
      console.error('Error en refreshTokens:', err)
      // Si falla el refresh, hacer logout
      await logout()
      throw err
    }
  }

  const loadUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      
      if (storedUser && storedAccessToken) {
        user.value = JSON.parse(storedUser)
        accessToken.value = storedAccessToken
        refreshToken.value = storedRefreshToken
      }
    } catch (err) {
      console.error('Error loading user from storage:', err)
      // Si hay error, limpiar todo
      logout()
    }
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      error.value = null
      
      const updatedUser = await authService.updateProfile(profileData)
      
      // Actualizar usuario en store
      user.value = { ...user.value, ...updatedUser }
      
      // Actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return updatedUser
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Inicializar desde localStorage al cargar el store
  loadUserFromStorage()

  return {
    // Estado
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userRole,
    isClient,
    isVet,
    isAdmin,
    userName,
    
    // Acciones
    login,
    register,
    logout,
    refreshTokens,
    loadUserFromStorage,
    updateProfile,
    clearError
  }
}) 