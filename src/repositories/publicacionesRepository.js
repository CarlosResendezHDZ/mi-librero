
import { API } from '../config/api';
import { getJSON, ErrorHttp } from '../services/http';

/**
 * Convierte un registro de PocketBase
 * al modelo utilizado por FindIt.
 */
export function aPublicacion(registro) {
  const imagen = registro.imagen && registro.collectionId
    ? `${API.base}/api/files/${encodeURIComponent(registro.collectionId)}/${encodeURIComponent(registro.id)}/${encodeURIComponent(registro.imagen)}`
    : '';

  return {
    id: registro.id,
    nombre: registro.nombre || 'Sin nombre',
    tipo: registro.tipo || '',
    categoria: registro.categoria || '',
    descripcion: registro.descripcion || '',
    fecha: registro.fecha?.slice(0, 10) || '',
    lugar: registro.lugar || '',
    autor: registro.autor || '',
    usuario: registro.usuario || '',
    imagen,
  };
}

/**
 * Consulta la lista de publicaciones.
 */
export async function listarPublicaciones({ signal } = {}) {
  const url = `${API.base}${API.lista}?page=1&perPage=30&sort=-created`;

  const respuesta = await getJSON(url, { signal });

  return (respuesta.items || []).map(aPublicacion);
}

/**
 * Consulta una publicación por su ID.
 */
export async function obtenerPublicacion(id, { signal } = {}) {
  if (!id) return null;

  try {
    const url = `${API.base}${API.detalle(id)}`;

    const registro = await getJSON(url, { signal });

    return aPublicacion(registro);
  } catch (error) {
    if (error instanceof ErrorHttp && error.status === 404) {
      return null;
    }

    throw error;
  }
}
