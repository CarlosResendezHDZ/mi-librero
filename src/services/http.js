
/**
 * Servicio HTTP de FindIt.
 * Centraliza las consultas JSON a nuestra API.
 */

export class ErrorHttp extends Error {
  constructor(mensaje, status = 0) {
    super(mensaje);
    this.name = 'ErrorHttp';
    this.status = status;
  }
}

export async function getJSON(url, { signal } = {}) {
  let respuesta;

  const headers = {
    Accept: 'application/json',
  };

  // Permite consultar PocketBase mediante ngrok.
  if (url.includes('.ngrok-free.dev')) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }

  try {
    respuesta = await fetch(url, {
      signal,
      headers,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    throw new ErrorHttp(
      navigator.onLine
        ? 'No se pudo conectar con la API'
        : 'Sin conexión a internet'
    );
  }

  if (!respuesta.ok) {
    throw new ErrorHttp(
      `La API respondió con el error ${respuesta.status}`,
      respuesta.status
    );
  }

  try {
    return await respuesta.json();
  } catch {
    throw new ErrorHttp(
      'La API no devolvió un JSON válido',
      respuesta.status
    );
  }
}
