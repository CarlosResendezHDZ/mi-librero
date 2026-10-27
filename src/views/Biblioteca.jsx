
import { Link } from 'react-router'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function Biblioteca() {
  return (
    <section>
      <h1 className="h4 mb-3">Mi biblioteca</h1>

      <EmptyState
        icono="bi-journal-bookmark"
        titulo="Aún no tienes libros"
      >
        <p className="small">
          Escanea o escribe el ISBN de un libro.
          En la semana 5 tu biblioteca se guardará
          en el dispositivo para verla sin internet.
        </p>

        <Link to="/agregar" className="btn btn-librero">
          Agregar libro
        </Link>
      </EmptyState>
    </section>
  )
}
