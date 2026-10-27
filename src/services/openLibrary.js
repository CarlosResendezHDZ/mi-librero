
//
// CONTENIDO: los datos del libro llegan de internet,
// no del shell.
//
// Docs: https://openlibrary.org/dev/docs/api/books
//

const API = 'https://openlibrary.org/api/books'

const cache = new Map()

export async function buscarLibroPorIsbn(isbn) {
  if (cache.has(isbn)) return cache.get(isbn)

  const url = `${API}?bibkeys=ISBN:${isbn}&format=json&jscmd=data`

  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}`)
  }

  const datos = await respuesta.json()
  const libro = datos[`ISBN:${isbn}`]

  const resultado = libro
    ? {
        isbn,
        titulo: libro.title,
        autores: (libro.authors ?? []).map((a) => a.name),
        editorial: libro.publishers?.[0]?.name ?? 'Editorial desconocida',
        anio: libro.publish_date ?? '',
        portada: libro.cover?.medium ?? null,
        portadaGrande: libro.cover?.large ?? null,
        enlace: libro.url,
      }
    : null

  cache.set(isbn, resultado)

  return resultado
}
