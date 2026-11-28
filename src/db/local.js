
import { openDB } from 'idb';

export const dbLocal = openDB('findit-offline', 2, {
  upgrade(db) {
    // Publicaciones descargadas desde PocketBase
    if (!db.objectStoreNames.contains('publicaciones')) {
      db.createObjectStore('publicaciones', {
        keyPath: 'id',
      });
    }

    // Publicaciones creadas sin Internet
    if (!db.objectStoreNames.contains('publicacionesPendientes')) {
      db.createObjectStore('publicacionesPendientes', {
        keyPath: 'id',
      });
    }
  },
});



/**
 * Guarda una publicación creada sin conexión.
 */
export async function guardarPublicacionPendiente(datos) {
  const db = await dbLocal;

  const publicacion = {
    ...datos,
    id: `local-${crypto.randomUUID()}`,
    estadoSync: 'pendiente',
    creadoEn: new Date().toISOString()
  };

  await db.put('publicacionesPendientes', publicacion);

  console.log('FindIt: publicación guardada en IndexedDB');

  return publicacion;
}

/**
 * Recupera las publicaciones que esperan sincronización.
 */
export async function obtenerPublicacionesPendientes() {
  const db = await dbLocal;
  return await db.getAll('publicacionesPendientes');
}

/**
 * Elimina un pendiente después de confirmar
 * que se guardó correctamente en PocketBase.
 */
export async function eliminarPublicacionPendiente(id) {
  const db = await dbLocal;
  await db.delete('publicacionesPendientes', id);
}

