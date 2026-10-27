
import { Link } from 'react-router'

export default function BookCard({ libro }) {
  return (
    <div className="card shadow-sm">
      <div className="row g-0">
        <div className="col-4 bg-light text-center">
          {libro.portada
            ? <img
                src={libro.portada}
                alt={`Portada de ${libro.titulo}`}
                className="img-fluid rounded-start"
              />
            : <i className="bi bi-book fs-1 text-secondary"></i>}
        </div>

        <div className="col-8 card-body">
          <h3 className="h6 mb-1">{libro.titulo}</h3>

          <p className="small mb-1">
            {libro.autores.join(', ')}
          </p>

          <p className="small text-body-secondary mb-2">
            {libro.editorial} · {libro.anio}
          </p>

          <Link
            to={`/libro/${libro.isbn}`}
            className="btn btn-sm btn-outline-librero"
          >
            Ver ficha
          </Link>
        </div>
      </div>
    </div>
  )
}
