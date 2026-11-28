
import { useEffect, useState } from 'react';

export default function ImagenPublicacion({
  src,
  alt,
  fallback = null
}) {
  const [imagenURL, setImagenURL] = useState('');

  useEffect(() => {
    let cancelado = false;
    let urlTemporal = null;

    setImagenURL('');

    if (!src) return;

    // Las imágenes locales no necesitan encabezados.
    if (!src.includes('.ngrok-free.')) {
      setImagenURL(src);
      return;
    }

    async function cargarImagen() {
      try {
        const cache = 'caches' in window
          ? await caches.open('findit-imagenes-v1')
          : null;

        // Primero intentar recuperar la fotografía guardada.
        let respuesta = cache
          ? await cache.match(src)
          : null;

        if (!respuesta) {
          respuesta = await fetch(src, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          });

          if (!respuesta.ok) {
            throw new Error(`Imagen: ${respuesta.status}`);
          }

          // Guardar una copia para futuras consultas offline.
          if (cache) {
            try {
              await cache.put(src, respuesta.clone());
            } catch (error) {
              console.warn('No se pudo guardar la imagen:', error);
            }
          }
        }

        const blob = await respuesta.blob();

        if (!blob.type.startsWith('image/')) {
          throw new Error('El servidor no devolvió una imagen.');
        }

        urlTemporal = URL.createObjectURL(blob);

        if (!cancelado) {
          setImagenURL(urlTemporal);
        } else {
          URL.revokeObjectURL(urlTemporal);
        }
      } catch (error) {
        console.warn('FindIt: error al cargar fotografía:', error);
      }
    }

    void cargarImagen();

    return () => {
      cancelado = true;

      if (urlTemporal) {
        URL.revokeObjectURL(urlTemporal);
      }
    };
  }, [src]);

  return imagenURL
    ? <img src={imagenURL} alt={alt} />
    : fallback;
}
