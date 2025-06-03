import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  APPOINTMENT_STATUS_LABELS, 
  APPOINTMENT_STATUS_COLORS,
  MEDICAL_RECORD_TYPE_LABELS 
} from '../config/constants'

/**
 * Formatear fecha para mostrar
 * @param {string|Date} date - Fecha a formatear
 * @param {string} formatStr - Formato de fecha
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, formatStr = 'PPpp') => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    
    return format(dateObj, formatStr, { locale: es })
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Formatear solo la hora
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Hora formateada
 */
export const formatTime = (date) => {
  return formatDate(date, 'HH:mm')
}

/**
 * Obtener etiqueta de estado de cita
 * @param {string} status - Estado de la cita
 * @returns {string} Etiqueta del estado
 */
export const getAppointmentStatusLabel = (status) => {
  return APPOINTMENT_STATUS_LABELS[status] || status
}

/**
 * Obtener color de estado de cita
 * @param {string} status - Estado de la cita
 * @returns {string} Color del estado
 */
export const getAppointmentStatusColor = (status) => {
  return APPOINTMENT_STATUS_COLORS[status] || 'gray'
}

/**
 * Obtener etiqueta de tipo de registro médico
 * @param {string} type - Tipo de registro
 * @returns {string} Etiqueta del tipo
 */
export const getMedicalRecordTypeLabel = (type) => {
  return MEDICAL_RECORD_TYPE_LABELS[type] || type
}

/**
 * Capitalizar primera letra
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Truncar texto
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Formatear número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return ''
  
  // Remover caracteres no numéricos excepto +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Si empieza con +57 (Colombia)
  if (cleaned.startsWith('+57')) {
    const number = cleaned.substring(3)
    if (number.length === 10) {
      return `+57 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
    }
  }
  
  return phone
}

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} Es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} Es válido
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
  return phoneRegex.test(phone?.replace(/\s/g, ''))
}

/**
 * Generar color aleatorio para avatar
 * @param {string} name - Nombre para generar color
 * @returns {string} Color en formato hex
 */
export const generateAvatarColor = (name) => {
  if (!name) return '#6B7280'
  
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#84CC16', '#22C55E', '#10B981', '#14B8A6',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Obtener iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales
 */
export const getInitials = (name) => {
  if (!name) return ''
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Formatear tamaño de archivo
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} Tamaño formateado
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Debounce function
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Copiar texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
} 