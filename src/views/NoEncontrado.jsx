
import { Link } from 'react-router'
import EmptyState from '../components/ui/EmptyState.jsx'

// 404 DENTRO del shell:
// header y navegación siguen visibles
export default function NoEncontrado() {
  return (
    <EmptyState
      icono="bi-signpost-split"
      titulo="Esta página no existe"
    >
      <Link to="/" className="btn btn-librero">
        Ir a mi biblioteca
      </Link>
    </EmptyState>
  )
}
