
import PocketBase from 'pocketbase'

const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL
)

export async function obtenerPublicaciones() {
  const respuesta = await pb
    .collection('publicaciones')
    .getList(1, 30, {
      sort: '-created'
    })

  return respuesta.items.map((registro) => ({
    id: registro.id,
    nombre: registro.nombre,
    tipo: registro.tipo,
    categoria: registro.categoria,
    descripcion: registro.descripcion,
    fecha: registro.fecha?.slice(0, 10) || '',
    lugar: registro.lugar,
    autor: registro.autor,
    imagen: registro.imagen
      ? pb.files.getURL(registro, registro.imagen)
      : ''
  }))
}
