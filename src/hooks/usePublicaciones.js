
import { useCallback } from 'react';
import { useConsulta } from './useConsulta';

import {
  listarPublicaciones,
  obtenerPublicacion,
} from '../repositories/publicacionesRepository';

// Controlador de la lista de publicaciones.
export function useListaPublicaciones(alConsultar) {
  const consultar = useCallback(
    async (signal) => {
      try {
        const datos = await listarPublicaciones({ signal });

        if (!signal.aborted) {
          alConsultar?.({ datos, error: null });
        }

        return datos;
      } catch (error) {
        if (!signal.aborted && error.name !== 'AbortError') {
          alConsultar?.({ datos: null, error });
        }

        throw error;
      }
    },
    [alConsultar]
  );

  return useConsulta('publicaciones', consultar);
}

// Controlador del detalle de una publicación.
export function usePublicacion(id) {
  const consultar = useCallback(
    (signal) => obtenerPublicacion(id, { signal }),
    [id]
  );

  return useConsulta(
    id ? `publicacion:${id}` : null,
    consultar
  );
}
