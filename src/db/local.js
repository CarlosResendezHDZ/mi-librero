
import { openDB } from 'idb';



export const dbLocal = openDB('findit-offline', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('publicaciones')) {
      db.createObjectStore('publicaciones', {
        keyPath: 'id',
      });
    }
  },
});
