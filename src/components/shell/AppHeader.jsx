
import { Link } from 'react-router'
import NetworkBadge from './NetworkBadge.jsx'

export default function AppHeader() {
  return (
    <header className="navbar navbar-dark bg-librero sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          <i
            className="bi bi-book-half me-2"
            aria-hidden="true"
          ></i>
          Mi Librero
        </Link>

        <NetworkBadge />
      </div>
    </header>
  )
}
