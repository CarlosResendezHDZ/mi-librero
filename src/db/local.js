
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
