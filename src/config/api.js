
/**
 * Configuración de la API de FindIt.
 * Backend: PocketBase
 */

const base = (
  import.meta.env.VITE_POCKETBASE_URL || ''
).replace(/\/+$/, '');

export const API = {
  base,

  lista: '/api/collections/publicaciones/records',

  detalle: (id) =>
    `/api/collections/publicaciones/records/${encodeURIComponent(id)}`,
};
