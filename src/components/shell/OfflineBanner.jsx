
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js'

export default function OfflineBanner() {
  const enLinea = useOnlineStatus()

  if (enLinea) return null

  return (
    <div className="alert alert-warning rounded-0 mb-0 py-2 small text-center">
      Sin conexión. Puedes seguir navegando; las búsquedas en Open Library
      esperarán a que vuelva la red.
    </div>
  )
}
