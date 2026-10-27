
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js'

// Indicador de red que aparece en todas las pantallas
export default function NetworkBadge() {
  const enLinea = useOnlineStatus()
  const color = enLinea ? 'text-bg-success' : 'text-bg-warning'
  const icono = enLinea ? 'bi-wifi' : 'bi-wifi-off'

  return (
    <span className={`badge rounded-pill ${color}`} role="status">
      <i className={`bi ${icono} me-1`} aria-hidden="true"></i>
      {enLinea ? 'En línea' : 'Sin conexión'}
    </span>
  )
}
