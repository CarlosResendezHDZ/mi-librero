
import { useState } from 'react'
import { useBuscarLibro } from '../hooks/useBuscarLibro.js'
import BookSkeleton from '../components/ui/BookSkeleton.jsx'
import BookCard from '../components/ui/BookCard.jsx'

const EJEMPLOS = ['9780140328721', '9780980200447']

export default function Agregar() {
  const [texto, setTexto] = useState('')
  const { estado, buscar } = useBuscarLibro()

  function alEnviar(e) {
    e.preventDefault()
    buscar(texto)
  }

  function probar(isbn) {
    setTexto(isbn)
    buscar(isbn)
  }

  return (
    <section>
      <h1 className="h4 mb-3">Agregar libro</h1>

      <button
        type="button"
        className="btn btn-outline-secondary w-100 mb-3"
        disabled
      >
        <i className="bi bi-camera me-2"></i>
        Escanear código de barras
        <span className="badge text-bg-secondary ms-1">
          Semana 6
        </span>
      </button>

      <form onSubmit={alEnviar} className="mb-2">
        <label htmlFor="isbn" className="form-label">
          O escribe el ISBN
        </label>

        <div className="input-group">
          <input
            id="isbn"
            className="form-control"
            inputMode="numeric"
            placeholder="978-0-14-032872-1"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          <button
            className="btn btn-librero"
            type="submit"
            disabled={estado.fase === 'cargando'}
            aria-label="Buscar"
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>

      <p className="small text-body-secondary">
        Prueba:
        {EJEMPLOS.map((isbn) => (
          <button
            key={isbn}
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => probar(isbn)}
          >
            {isbn}
          </button>
        ))}
      </p>

      <div aria-live="polite">
        {estado.fase === 'cargando' && <BookSkeleton />}

        {estado.fase === 'listo' && (
          <BookCard libro={estado.libro} />
        )}

        {estado.fase === 'error' && (
          <div className="alert alert-danger small">
            {estado.mensaje}
          </div>
        )}
      </div>
    </section>
  )
}
