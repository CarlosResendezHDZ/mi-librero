
import { useSyncExternalStore } from 'react'

// Escucha los cambios de conexión del navegador
function suscribir(callback) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)

  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

// Devuelve si el dispositivo tiene conexión
export function useOnlineStatus() {
  return useSyncExternalStore(
    suscribir,
    () => navigator.onLine
  )
}
