
import { openDB } from 'idb';

/**
 * Base de datos local de FindIt.
 * Permite almacenar publicaciones en el navegador.
 */

export const dbLocal = openDB('findit-offline', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('publicaciones')) {
      db.createObjectStore('publicaciones', {
        keyPath: 'id',
      });
    }
  },
});
