
import { API } from '../config/api';
import { getJSON, ErrorHttp } from '../services/http';

import { dbLocal } from '../db/local.js';


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

  let respuesta;

  try {
    // 1. Obtener las publicaciones desde PocketBase.
    respuesta = await getJSON(url, { signal });
  } catch (error) {
    if (signal?.aborted || error.name === 'AbortError') {
      throw error;
    }

    // 2. Si falla la API, buscar los datos en IndexedDB.
    const db = await dbLocal;
    const guardadas = await db.getAll('publicaciones');

    if (guardadas.length > 0) {
      console.info('FindIt: publicaciones recuperadas de IndexedDB');
      return guardadas;
    }

    throw error;
  }

  const publicaciones = (respuesta.items || []).map(aPublicacion);

  // 3. Guardar una copia actualizada en IndexedDB.
  try {
    const db = await dbLocal;
    const tx = db.transaction('publicaciones', 'readwrite');

    tx.store.clear();

    for (const publicacion of publicaciones) {
      tx.store.put(publicacion);
    }

    await tx.done;

    console.info(
      `FindIt: ${publicaciones.length} publicaciones guardadas en IndexedDB`
    );
  } catch (error) {
    console.warn('No se pudo actualizar IndexedDB:', error);
  }

  return publicaciones;
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
