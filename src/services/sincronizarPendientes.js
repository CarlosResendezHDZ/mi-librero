
import {
  obtenerPublicacionesPendientes,
  eliminarPublicacionPendiente
} from '../db/local.js';

import {
  obtenerUsuarioActual,
  crearPublicacion,
  buscarPublicacionRemota
} from './pocketbase.js';

let sincronizando = false;

export async function sincronizarPublicacionesPendientes() {
  if (sincronizando || !navigator.onLine) return;

  const usuario = obtenerUsuarioActual();

  if (!usuario) {
    console.warn('FindIt: se necesita una sesión de PocketBase.');
    return;
  }

  sincronizando = true;

  try {
    const pendientes = await obtenerPublicacionesPendientes();

    for (const pendiente of pendientes) {
      // Nunca publicar registros pertenecientes a otra cuenta.
      if (pendiente.usuario !== usuario.id) {
        console.warn('FindIt: pendiente de otra cuenta:', pendiente.id);
        continue;
      }

      // ID remoto fijo: 15 caracteres derivados del UUID local.
      const idRemoto = pendiente.id
        .replace(/^local-/, '')
        .replace(/-/g, '')
        .slice(0, 15)
        .toLowerCase();

      if (!/^[a-z0-9]{15}$/.test(idRemoto)) {
        console.warn('FindIt: ID local no válido:', pendiente.id);
        continue;
      }

      try {
        let remota = await buscarPublicacionRemota(idRemoto);

        if (!remota) {
          try {
            remota = await crearPublicacion({
              ...pendiente,
              idRemoto
            });
          } catch (errorCreacion) {
            // Verificar si el servidor guardó el registro,
            // aunque la respuesta se haya interrumpido.
            try {
              remota = await buscarPublicacionRemota(idRemoto);
            } catch {
              throw errorCreacion;
            }

            if (!remota) throw errorCreacion;
          }
        }

        // Confirmar identidad y registro antes de borrar.
        if (remota.id !== idRemoto ||
            remota.usuario !== usuario.id) {
          throw new Error('La publicación remota no coincide.');
        }

        await eliminarPublicacionPendiente(pendiente.id);

        window.dispatchEvent(new CustomEvent(
          'findit:publicacion-sincronizada',
          {
            detail: {
              localId: pendiente.id,
              remota
            }
          }
        ));

        console.log('FindIt: publicación sincronizada:', pendiente.nombre);

      } catch (error) {
        console.warn(
          'FindIt: publicación todavía pendiente:',
          pendiente.nombre,
          error
        );
      }
    }
  } finally {
    sincronizando = false;
  }
}

export function iniciarSincronizacionPendientes() {
  const ejecutar = () => {
    sincronizarPublicacionesPendientes().catch(console.error);
  };

  // Comprobar pendientes al iniciar.
  ejecutar();

  // Reintentar al volver Internet o regresar a la pestaña.
  window.addEventListener('online', ejecutar);
  window.addEventListener('focus', ejecutar);

  return () => {
    window.removeEventListener('online', ejecutar);
    window.removeEventListener('focus', ejecutar);
  };
}
