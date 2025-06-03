// Configuración de la aplicación
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'VetAI Connect',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
}

// Estados de citas
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
}

// Etiquetas de estados de citas en español
export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Programada',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmada',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'En progreso',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada',
  [APPOINTMENT_STATUS.NO_SHOW]: 'No asistió'
}

// Colores para estados de citas
export const APPOINTMENT_STATUS_COLORS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'blue',
  [APPOINTMENT_STATUS.CONFIRMED]: 'green',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'yellow',
  [APPOINTMENT_STATUS.COMPLETED]: 'green',
  [APPOINTMENT_STATUS.CANCELLED]: 'red',
  [APPOINTMENT_STATUS.NO_SHOW]: 'gray'
}

// Tipos de registros médicos
export const MEDICAL_RECORD_TYPES = {
  CONSULTATION: 'CONSULTATION',
  VACCINATION: 'VACCINATION',
  SURGERY: 'SURGERY',
  EMERGENCY: 'EMERGENCY',
  CHECKUP: 'CHECKUP',
  TREATMENT: 'TREATMENT'
}

// Etiquetas de tipos de registros médicos
export const MEDICAL_RECORD_TYPE_LABELS = {
  [MEDICAL_RECORD_TYPES.CONSULTATION]: 'Consulta',
  [MEDICAL_RECORD_TYPES.VACCINATION]: 'Vacunación',
  [MEDICAL_RECORD_TYPES.SURGERY]: 'Cirugía',
  [MEDICAL_RECORD_TYPES.EMERGENCY]: 'Emergencia',
  [MEDICAL_RECORD_TYPES.CHECKUP]: 'Chequeo',
  [MEDICAL_RECORD_TYPES.TREATMENT]: 'Tratamiento'
}

// Roles de usuario
export const USER_ROLES = {
  CLIENT: 'CLIENT',
  VET: 'VET',
  ADMIN: 'ADMIN'
}

// Especies de mascotas comunes
export const PET_SPECIES = [
  'Perro',
  'Gato',
  'Ave',
  'Conejo',
  'Hámster',
  'Pez',
  'Reptil',
  'Otro'
]

// Configuración de paginación
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50]
}

// Configuración de fechas
export const DATE_CONFIG = {
  format: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
  locale: 'es'
}

// Configuración de validación
export const VALIDATION_CONFIG = {
  minPasswordLength: 6,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
  phoneRegex: /^(\+\d{1,3}[- ]?)?\d{10}$/
} 