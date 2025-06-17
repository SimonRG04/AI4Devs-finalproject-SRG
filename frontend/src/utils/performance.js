// =================================
// Performance Utilities - VetAI Connect Frontend
// =================================

/**
 * Debounce function para optimizar búsquedas y API calls
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 */
export function debounce(func, wait) {
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
 * Throttle function para limitar ejecución de eventos
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 */
export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Lazy loading de componentes Vue
 * @param {Function} importFn - Función de importación
 */
export function lazyLoad(importFn) {
  return () => ({
    component: importFn(),
    loading: () => import('../components/common/LoadingSpinner.vue'),
    error: () => import('../components/common/ErrorComponent.vue'),
    delay: 200,
    timeout: 10000
  })
}

/**
 * Optimización de imágenes para carga rápida
 * @param {string} url - URL de la imagen
 * @param {Object} options - Opciones de optimización
 */
export function optimizeImageUrl(url, options = {}) {
  if (!url) return null
  
  const {
    width = 300,
    height = 300,
    quality = 80,
    format = 'webp'
  } = options
  
  // Si es una URL de Cloudinary, aplicar transformaciones
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0] + '/upload/'
    const imagePath = url.split('/upload/')[1]
    return `${baseUrl}w_${width},h_${height},q_${quality},f_${format}/${imagePath}`
  }
  
  return url
}

/**
 * Cache simple para API responses
 */
class SimpleCache {
  constructor(maxSize = 50, ttl = 5 * 60 * 1000) { // 5 minutos TTL
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }
  
  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }
  
  clear() {
    this.cache.clear()
  }
}

export const apiCache = new SimpleCache()

/**
 * Intersection Observer para lazy loading de componentes
 */
export function createIntersectionObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  }
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options })
}

/**
 * Preload de rutas críticas
 */
export function preloadRoute(routePath) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = routePath
  document.head.appendChild(link)
}

/**
 * Monitoreo de performance
 */
export class PerformanceMonitor {
  static measure(name, fn) {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    if (import.meta.env.DEV) {
      console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }
  
  static async measureAsync(name, fn) {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    if (import.meta.env.DEV) {
      console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }
} 