
import { NavLink } from 'react-router'

// Navegación principal de FindIt
const secciones = [
  {
    to: '/inicio',
    texto: 'Inicio',
    icono: 'bi-house-door'
  },
  {
    to: '/buscar',
    texto: 'Buscar',
    icono: 'bi-search'
  },
  {
    to: '/publicar',
    texto: 'Publicar',
    icono: 'bi-plus-circle'
  },
  {
    to: '/mis-publicaciones',
    texto: 'Guardados',
    icono: 'bi-star'
  },
  {
    to: '/perfil',
    texto: 'Perfil',
    icono: 'bi-person'
  }
]

export default function BottomNav() {
  return (
    <nav
      className="bottom-nav fixed-bottom bg-white border-top"
      aria-label="Navegación principal"
    >
      <ul className="nav nav-fill w-100">
        {secciones.map((s) => (
          <li className="nav-item" key={s.to}>
            <NavLink
              to={s.to}
              end
              className="nav-link bottom-nav__link"
            >
              <i
                className={`bi ${s.icono} d-block fs-4`}
                aria-hidden="true"
              ></i>

              <span className="small">
                {s.texto}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
