
import { NavLink } from 'react-router'

const secciones = [
  { to: '/', texto: 'Biblioteca', icono: 'bi-book' },
  { to: '/agregar', texto: 'Agregar', icono: 'bi-upc-scan' },
  { to: '/resenas', texto: 'Reseñas', icono: 'bi-chat-square-text' },
]

// Navegación principal inferior (patrón de app móvil)
export default function BottomNav() {
  return (
    <nav
      className="bottom-nav fixed-bottom bg-white border-top"
      aria-label="Principal"
    >
      <ul className="nav nav-fill">
        {secciones.map((s) => (
          <li className="nav-item" key={s.to}>
            <NavLink
              to={s.to}
              end={s.to === '/'}
              className="nav-link bottom-nav__link"
            >
              <i
                className={`bi ${s.icono} d-block fs-4`}
                aria-hidden="true"
              ></i>
              <span className="small">{s.texto}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
