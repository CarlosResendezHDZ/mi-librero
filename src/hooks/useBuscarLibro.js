
import { useState } from 'react'
import { limpiarIsbn, esIsbnValido } from '../utils/isbn.js'
import { buscarLibroPorIsbn } from '../services/openLibrary.js'

const error = (mensaje) => ({ fase: 'error', mensaje })

// Fases: inicio | cargando | listo | error
export function useBuscarLibro() {
  const [estado, setEstado] = useState({ fase: 'inicio' })

  async function buscar(valor) {
    const isbn = limpiarIsbn(valor)

    if (!esIsbnValido(isbn)) {
      return setEstado(error('ISBN no válido.'))
    }

    if (!navigator.onLine) {
      return setEstado(
        error('Sin conexión: la búsqueda necesita internet.')
      )
    }

    setEstado({ fase: 'cargando' })

    try {
      const libro = await buscarLibroPorIsbn(isbn)

      setEstado(
        libro
          ? { fase: 'listo', libro }
          : error(`No encontramos el ISBN ${isbn} en Open Library.`)
      )
    } catch {
      setEstado(error('No pudimos conectar con Open Library.'))
    }
  }

  return { estado, buscar }
}
