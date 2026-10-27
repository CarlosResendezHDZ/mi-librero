
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { buscarLibroPorIsbn } from '../services/openLibrary.js'
import BookSkeleton from '../components/ui/BookSkeleton.jsx'

export default function Libro() {
  const { isbn } = useParams()

  // Guardamos para qué ISBN es el resultado
  const [res, setRes] = useState({ isbn: null })

  useEffect(() => {
    buscarLibroPorIsbn(isbn)
      .then((libro) => setRes({ isbn, libro }))
      .catch(() => setRes({ isbn, error: true }))
  }, [isbn])

  if (res.isbn !== isbn) return <BookSkeleton />

  if (res.error) {
    return <p className="alert alert-danger">Sin conexión.</p>
  }

  if (!res.libro) {
    return <p className="alert alert-warning">No encontrado.</p>
  }

  const {
    titulo,
    autores,
    editorial,
    anio,
    portadaGrande,
    enlace
  } = res.libro

  return (
    <article>
      <Link to="/agregar" className="btn btn-link px-0 mb-2">
        ← Volver
      </Link>

      <div className="row g-3">
        <div className="col-5 col-md-3">
          {portadaGrande && (
            <img
              src={portadaGrande}
              alt={titulo}
              className="img-fluid rounded shadow-sm"
            />
          )}
        </div>

        <div className="col-7 col-md-9">
          <h1 className="h5">{titulo}</h1>

          <p className="mb-1">{autores.join(', ')}</p>

          <p className="small text-body-secondary">
            {editorial} · {anio}
          </p>

          <a href={enlace} target="_blank" rel="noreferrer">
            Open Library
          </a>
        </div>
      </div>

      <p className="alert alert-secondary small mt-3">
        Estado, estrellas, reseña y compartir llegan
        en las semanas 5 y 6.
      </p>
    </article>
  )
}
