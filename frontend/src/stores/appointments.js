import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import appointmentService from '../services/appointmentService'
import { format, isToday, isFuture, isPast, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const useAppointmentsStore = defineStore('appointments', () => {
  // Estado
  const appointments = ref([])
  const availability = ref([])
  const currentAppointment = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const calendarDate = ref(new Date())
  const filters = ref({
    status: 'all',
    veterinarian: '',
    pet: '',
    dateRange: null
  })

  // Getters computados
  const upcomingAppointments = computed(() => {
    return appointments.value
      .filter(appointment => {
        const appointmentDate = parseISO(appointment.scheduledAt)
        return isFuture(appointmentDate) && appointment.status !== 'CANCELLED'
      })
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  })

  const todayAppointments = computed(() => {
    return appointments.value
      .filter(appointment => {
        const appointmentDate = parseISO(appointment.scheduledAt)
        return isToday(appointmentDate) && appointment.status !== 'CANCELLED'
      })
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  })

  const pastAppointments = computed(() => {
    return appointments.value
      .filter(appointment => {
        const appointmentDate = parseISO(appointment.scheduledAt)
        return isPast(appointmentDate)
      })
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
  })

  const filteredAppointments = computed(() => {
    let filtered = [...appointments.value]

    if (filters.value.status !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === filters.value.status)
    }

    if (filters.value.veterinarian) {
      filtered = filtered.filter(appointment => 
        appointment.veterinarian?.id === filters.value.veterinarian
      )
    }

    if (filters.value.pet) {
      filtered = filtered.filter(appointment => 
        appointment.pet?.id === filters.value.pet
      )
    }

    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      filtered = filtered.filter(appointment => {
        const appointmentDate = parseISO(appointment.scheduledAt)
        return appointmentDate >= start && appointmentDate <= end
      })
    }

    return filtered.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
  })

  const appointmentsByDate = computed(() => {
    const grouped = {}
    appointments.value.forEach(appointment => {
      const date = format(parseISO(appointment.scheduledAt), 'yyyy-MM-dd')
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(appointment)
    })
    return grouped
  })

  // Acciones
  const fetchAppointments = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await appointmentService.getAppointments(params)
      appointments.value = response.data || response
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar citas'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAppointment = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await appointmentService.getAppointment(id)
      currentAppointment.value = response.data || response
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAvailability = async (veterinarianId, date) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await appointmentService.getAvailability(veterinarianId, date)
      availability.value = response.data || response
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar disponibilidad'
      throw err
    } finally {
      loading.value = false
    }
  }

  const bookAppointment = async (appointmentData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await appointmentService.createAppointment(appointmentData)
      const newAppointment = response.data || response
      
      // Agregar la nueva cita a la lista
      appointments.value.push(newAppointment)
      
      return newAppointment
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al agendar cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAppointment = async (id, appointmentData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await appointmentService.updateAppointment(id, appointmentData)
      const updatedAppointment = response.data || response
      
      // Actualizar en la lista
      const index = appointments.value.findIndex(appointment => appointment.id === id)
      if (index !== -1) {
        appointments.value[index] = updatedAppointment
      }
      
      // Actualizar cita actual si es la misma
      if (currentAppointment.value?.id === id) {
        currentAppointment.value = updatedAppointment
      }
      
      return updatedAppointment
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelAppointment = async (id, reason = '') => {
    try {
      loading.value = true
      error.value = null
      
      const response = await appointmentService.cancelAppointment(id, reason)
      const cancelledAppointment = response.data || response
      
      // Actualizar en la lista
      const index = appointments.value.findIndex(appointment => appointment.id === id)
      if (index !== -1) {
        appointments.value[index] = cancelledAppointment
      }
      
      // Actualizar cita actual si es la misma
      if (currentAppointment.value?.id === id) {
        currentAppointment.value = cancelledAppointment
      }
      
      return cancelledAppointment
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cancelar cita'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentAppointment = (appointment) => {
    currentAppointment.value = appointment
  }

  const clearCurrentAppointment = () => {
    currentAppointment.value = null
  }

  const setCalendarDate = (date) => {
    calendarDate.value = date
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      status: 'all',
      veterinarian: '',
      pet: '',
      dateRange: null
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Utilidades para formateo
  const formatAppointmentDate = (dateString) => {
    return format(parseISO(dateString), 'PPpp', { locale: es })
  }

  const formatAppointmentTime = (dateString) => {
    return format(parseISO(dateString), 'HH:mm')
  }

  const getAppointmentStatus = (appointment) => {
    const statusMap = {
      'SCHEDULED': 'Programada',
      'CONFIRMED': 'Confirmada',
      'IN_PROGRESS': 'En progreso',
      'COMPLETED': 'Completada',
      'CANCELLED': 'Cancelada',
      'NO_SHOW': 'No asistió'
    }
    return statusMap[appointment.status] || appointment.status
  }

  return {
    // Estado
    appointments,
    availability,
    currentAppointment,
    loading,
    error,
    calendarDate,
    filters,
    
    // Getters
    upcomingAppointments,
    todayAppointments,
    pastAppointments,
    filteredAppointments,
    appointmentsByDate,
    
    // Acciones
    fetchAppointments,
    fetchAppointment,
    fetchAvailability,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    setCurrentAppointment,
    clearCurrentAppointment,
    setCalendarDate,
    setFilters,
    clearFilters,
    clearError,
    
    // Utilidades
    formatAppointmentDate,
    formatAppointmentTime,
    getAppointmentStatus
  }
}) 