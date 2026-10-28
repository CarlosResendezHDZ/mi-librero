
import { Link } from 'react-router'
import NetworkBadge from './NetworkBadge.jsx'

export default function AppHeader() {
  return (
    <header className="navbar navbar-dark bg-librero sticky-top">
      <div className="container">
        <Link
          to="/inicio"
          className="navbar-brand fw-bold d-flex align-items-center"
        >
          <i
            className="bi bi-search me-2"
            aria-hidden="true"
          ></i>

          Find<span className="text-info">It</span>
        </Link>

        <NetworkBadge />
      </div>
    </header>
  )
}
