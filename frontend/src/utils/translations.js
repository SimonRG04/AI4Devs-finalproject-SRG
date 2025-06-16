// Traducciones de enums del backend al español
export const translations = {
  // Estados de citas
  appointmentStatus: {
    'SCHEDULED': 'Programada',
    'CONFIRMED': 'Confirmada',
    'IN_PROGRESS': 'En Progreso',
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancelada',
    'MISSED': 'Perdida'
  },

  // Tipos de citas
  appointmentType: {
    'CONSULTATION': 'Consulta',
    'VACCINATION': 'Vacunación',
    'CHECKUP': 'Revisión',
    'SURGERY': 'Cirugía',
    'EMERGENCY': 'Emergencia',
    'FOLLOW_UP': 'Seguimiento',
    'GROOMING': 'Estética',
    'DENTAL': 'Dental',
    'OTHER': 'Otro'
  },

  // Prioridades de citas
  appointmentPriority: {
    'LOW': 'Baja',
    'NORMAL': 'Normal',
    'HIGH': 'Alta',
    'URGENT': 'Urgente'
  },

  // Géneros de mascotas
  petGender: {
    'MALE': 'Macho',
    'FEMALE': 'Hembra',
    'UNKNOWN': 'Desconocido'
  },

  // Especies de mascotas
  petSpecies: {
    'DOG': 'Perro',
    'CAT': 'Gato',
    'BIRD': 'Ave',
    'RABBIT': 'Conejo',
    'HAMSTER': 'Hámster',
    'GUINEA_PIG': 'Cobaya',
    'FERRET': 'Hurón',
    'REPTILE': 'Reptil',
    'FISH': 'Pez',
    'OTHER': 'Otro'
  },

  // Roles de usuario
  userRole: {
    'CLIENT': 'Cliente',
    'VET': 'Veterinario',
    'ADMIN': 'Administrador'
  },

  // Estados de diagnóstico IA
  diagnosisStatus: {
    'PENDING': 'Pendiente',
    'PROCESSING': 'Procesando',
    'COMPLETED': 'Completado',
    'FAILED': 'Fallido'
  },

  // Frecuencias de prescripción
  prescriptionFrequency: {
    'ONCE_DAILY': 'Una vez al día',
    'TWICE_DAILY': 'Dos veces al día',
    'THREE_TIMES_DAILY': 'Tres veces al día',
    'FOUR_TIMES_DAILY': 'Cuatro veces al día',
    'EVERY_8_HOURS': 'Cada 8 horas',
    'EVERY_12_HOURS': 'Cada 12 horas',
    'EVERY_6_HOURS': 'Cada 6 horas',
    'AS_NEEDED': 'Según necesidad',
    'WEEKLY': 'Semanal',
    'MONTHLY': 'Mensual'
  },

  // Estados de prescripción
  prescriptionStatus: {
    'ACTIVE': 'Activa',
    'COMPLETED': 'Completada',
    'DISCONTINUED': 'Descontinuada',
    'SUSPENDED': 'Suspendida'
  }
}

// Función para traducir un valor específico
export const translate = (category, value) => {
  if (!value) return value
  return translations[category]?.[value] || value
}

// Función para obtener todas las opciones de una categoría en español
export const getTranslatedOptions = (category) => {
  const categoryTranslations = translations[category]
  if (!categoryTranslations) return []
  
  return Object.entries(categoryTranslations).map(([key, value]) => ({
    value: key,
    label: value
  }))
}

// Función para obtener las clases CSS de badges según el tipo
export const getBadgeClass = (category, value) => {
  const badgeClasses = {
    appointmentStatus: {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'MISSED': 'bg-red-100 text-red-800'
    },
    appointmentPriority: {
      'LOW': 'bg-gray-100 text-gray-800',
      'NORMAL': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    },
    petGender: {
      'MALE': 'bg-blue-100 text-blue-800',
      'FEMALE': 'bg-pink-100 text-pink-800',
      'UNKNOWN': 'bg-gray-100 text-gray-800'
    },
    diagnosisStatus: {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800'
    },
    prescriptionStatus: {
      'ACTIVE': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-gray-100 text-gray-800',
      'DISCONTINUED': 'bg-red-100 text-red-800',
      'SUSPENDED': 'bg-yellow-100 text-yellow-800'
    }
  }

  return badgeClasses[category]?.[value] || 'bg-gray-100 text-gray-800'
}

// Función helper para formatear texto en español
export const formatText = {
  capitalize: (text) => {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  },
  
  pluralize: (count, singular, plural) => {
    return count === 1 ? singular : plural
  },
  
  gender: (count, masculine, feminine) => {
    return count === 1 ? masculine : feminine
  }
} 