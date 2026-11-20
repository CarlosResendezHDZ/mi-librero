
import { useEffect, useState } from 'react';

/**
 * Hook genérico para consultar datos de una API.
 * Controla carga, errores, datos y reintentos.
 */
export function useConsulta(clave, consultar) {
  const [intento, setIntento] = useState(0);

  const id = `${clave}#${intento}`;

  const [resultado, setResultado] = useState({});

  useEffect(() => {
    if (!clave) return;

    const controlador = new AbortController();

    consultar(controlador.signal)
      .then((datos) => {
        setResultado({ id, datos });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setResultado({ id, error });
        }
      });

    return () => controlador.abort();
  }, [clave, id, consultar]);

  const listo = resultado.id === id;

  return {
    datos: listo ? resultado.datos : undefined,
    error: listo ? resultado.error : undefined,
    cargando: Boolean(clave) && !listo,
    reintentar: () => setIntento((n) => n + 1),
  };
}
