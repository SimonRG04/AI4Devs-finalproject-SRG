import { nextTick } from 'vue'

/**
 * Composable para manejar refresh automático después de operaciones CRUD
 * 
 * @param {Object} options - Opciones de configuración
 * @param {Function[]} options.refreshFunctions - Array de funciones de refresh a ejecutar
 * @param {number} options.delay - Delay en milisegundos antes del refresh (default: 1000)
 * @param {boolean} options.immediate - Si ejecutar el refresh inmediatamente (default: false)
 * @param {Function} options.onError - Callback para manejar errores durante el refresh
 */
export function useAutoRefresh(options = {}) {
  const {
    refreshFunctions = [],
    delay = 1000,
    immediate = false,
    onError = (error) => console.warn('Error during auto-refresh:', error)
  } = options

  /**
   * Ejecuta el refresh automático
   * @param {Object} operationOptions - Opciones específicas para esta operación
   */
  const executeRefresh = async (operationOptions = {}) => {
    const {
      delay: operationDelay = delay,
      functions = refreshFunctions,
      immediate: operationImmediate = immediate
    } = operationOptions

    const refreshExecution = async () => {
      try {
        // Asegurar que el DOM se haya actualizado
        await nextTick()
        
        // Ejecutar todas las funciones de refresh en paralelo
        await Promise.allSettled(
          functions.map(async (refreshFn) => {
            if (typeof refreshFn === 'function') {
              return await refreshFn()
            }
          })
        )
      } catch (error) {
        onError(error)
      }
    }

    if (operationImmediate) {
      await refreshExecution()
    } else {
      setTimeout(refreshExecution, operationDelay)
    }
  }

  /**
   * Wrapper para operaciones de creación
   * @param {Function} createFunction - Función de creación
   * @param {Array} additionalRefreshFunctions - Funciones adicionales de refresh para esta operación
   */
  const withCreate = (createFunction, additionalRefreshFunctions = []) => {
    return async (...args) => {
      const result = await createFunction(...args)
      
      await executeRefresh({
        functions: [...refreshFunctions, ...additionalRefreshFunctions],
        delay: 1500 // Delay más largo para creaciones
      })
      
      return result
    }
  }

  /**
   * Wrapper para operaciones de actualización
   * @param {Function} updateFunction - Función de actualización
   * @param {Array} additionalRefreshFunctions - Funciones adicionales de refresh para esta operación
   */
  const withUpdate = (updateFunction, additionalRefreshFunctions = []) => {
    return async (...args) => {
      const result = await updateFunction(...args)
      
      await executeRefresh({
        functions: [...refreshFunctions, ...additionalRefreshFunctions],
        delay: 500 // Delay más corto para actualizaciones
      })
      
      return result
    }
  }

  /**
   * Wrapper para operaciones de eliminación
   * @param {Function} deleteFunction - Función de eliminación
   * @param {Array} additionalRefreshFunctions - Funciones adicionales de refresh para esta operación
   */
  const withDelete = (deleteFunction, additionalRefreshFunctions = []) => {
    return async (...args) => {
      const result = await deleteFunction(...args)
      
      await executeRefresh({
        functions: [...refreshFunctions, ...additionalRefreshFunctions],
        delay: 500 // Delay corto para eliminaciones
      })
      
      return result
    }
  }

  /**
   * Configurar refresh automático para múltiples operaciones de una vez
   * @param {Object} operations - Objeto con las operaciones { create, update, delete }
   * @param {Array} additionalRefreshFunctions - Funciones adicionales de refresh
   */
  const wrapOperations = (operations, additionalRefreshFunctions = []) => {
    const wrapped = {}
    
    if (operations.create) {
      wrapped.create = withCreate(operations.create, additionalRefreshFunctions)
    }
    
    if (operations.update) {
      wrapped.update = withUpdate(operations.update, additionalRefreshFunctions)
    }
    
    if (operations.delete) {
      wrapped.delete = withDelete(operations.delete, additionalRefreshFunctions)
    }
    
    return wrapped
  }

  /**
   * Refresh manual
   * @param {Array} specificFunctions - Funciones específicas a ejecutar (opcional)
   */
  const refresh = async (specificFunctions = null) => {
    await executeRefresh({
      functions: specificFunctions || refreshFunctions,
      immediate: true
    })
  }

  return {
    executeRefresh,
    withCreate,
    withUpdate,
    withDelete,
    wrapOperations,
    refresh
  }
}

/**
 * Versión predefinida para vistas de detalle que necesitan refrescar múltiples tipos de datos
 */
export function useDetailViewRefresh(refreshFunctions) {
  return useAutoRefresh({
    refreshFunctions,
    delay: 1000,
    onError: (error) => {
      console.warn('Error during detail view refresh:', error)
      // No mostrar toast de error para evitar spam al usuario
    }
  })
}

/**
 * Versión predefinida para listas que solo necesitan refrescar un tipo de datos
 */
export function useListViewRefresh(refreshFunction) {
  return useAutoRefresh({
    refreshFunctions: [refreshFunction],
    delay: 500,
    onError: (error) => {
      console.warn('Error during list view refresh:', error)
    }
  })
} 