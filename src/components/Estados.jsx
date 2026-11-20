
/**
 * Estados reutilizables para consultas de FindIt.
 */

// Mientras esperamos la respuesta de la API.
export function Cargando() {
  return (
    <div role="status" aria-live="polite">
      <p>Cargando publicaciones...</p>
    </div>
  );
}

// Cuando la API devuelve un error.
export function ErrorCarga({ mensaje, onReintentar }) {
  return (
    <div role="alert">
      <p>{mensaje || 'No se pudieron cargar los datos.'}</p>

      <button type="button" onClick={onReintentar}>
        Reintentar
      </button>
    </div>
  );
}

// Cuando no existen resultados.
export function Vacio({
  texto = 'No hay publicaciones disponibles.',
}) {
  return (
    <div>
      <p>{texto}</p>
    </div>
  );
}
