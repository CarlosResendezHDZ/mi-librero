
import EmptyState from '../components/ui/EmptyState.jsx'

export default function Resenas() {
  return (
    <section>
      <h1 className="h4 mb-3">Mis reseñas</h1>

      <EmptyState
        icono="bi-chat-square-text"
        titulo="Aún no hay reseñas"
      >
        <p className="small">
          Aquí verás tus reseñas y cuáles están
          pendientes de subir cuando vuelva
          la conexión.
        </p>
      </EmptyState>
    </section>
  )
}
