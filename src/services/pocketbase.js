
import PocketBase from 'pocketbase'

const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL
)


pb.beforeSend = (url, options) => {
  if (url.includes('.ngrok-free.dev')) {
    options.headers = {
      ...options.headers,
      'ngrok-skip-browser-warning': 'true'
    };
  }

  return { url, options };
};


export async function obtenerPublicaciones() {
  const respuesta = await pb
    .collection('publicaciones')
    .getList(1, 30, {
      sort: '-created'
    })
    

  return respuesta.items.map((registro) => ({
    id: registro.id,
    nombre: registro.nombre,
    tipo: registro.tipo,
    categoria: registro.categoria,
    descripcion: registro.descripcion,
    fecha: registro.fecha?.slice(0, 10) || '',
    lugar: registro.lugar,
    autor: registro.autor,
    usuario: registro.usuario,
    imagen: registro.imagen
      ? pb.files.getURL(registro, registro.imagen)
      : ''
  }))
}


export function escucharCambiosPublicaciones(alCambiar) {
  return pb.collection('publicaciones').subscribe('*', () => {
    alCambiar();
  });
}

export async function registrarUsuario(nombre, email, password) {
  const correo = email.trim().toLowerCase();

  await pb.collection('usuarios').create({
    nombre: nombre.trim(),
    email: correo,
    password,
    passwordConfirm: password,
  });

  const sesion = await pb
    .collection('usuarios')
    .authWithPassword(correo, password);

  return sesion.record;
}

export async function iniciarSesion(email, password) {
  const sesion = await pb
    .collection('usuarios')
    .authWithPassword(
      email.trim().toLowerCase(),
      password
    );

  return sesion.record;
}

export function cerrarSesion() {
  pb.authStore.clear();
}

export function obtenerUsuarioActual() {
  if (!pb.authStore.isValid) return null;

  const usuario = pb.authStore.record;

  return usuario?.collectionName === 'usuarios'
    ? usuario
    : null;
}


export async function crearPublicacion(datosFormulario) {
  const usuario = obtenerUsuarioActual();

  if (!usuario) {
    throw new Error('Debes iniciar sesión para publicar.');
  }

  const datos = {
    nombre: datosFormulario.nombre.trim(),
    tipo: datosFormulario.tipo,
    categoria: datosFormulario.categoria,
    descripcion: datosFormulario.descripcion,
    fecha: `${datosFormulario.fecha} 12:00:00.000Z`,
    lugar: datosFormulario.lugar.trim(),
    autor: usuario.nombre || usuario.email,
    usuario: usuario.id,
  };

  // Convertir la imagen del formulario en un archivo real.
  if (datosFormulario.imagen) {
    const respuesta = await fetch(datosFormulario.imagen);
    const blob = await respuesta.blob();

    const extensiones = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };

    const extension = extensiones[blob.type];

    if (!extension) {
      throw new Error('Formato de imagen no compatible.');
    }

    datos.imagen = new File(
      [blob],
      `objeto-${Date.now()}.${extension}`,
      { type: blob.type }
    );
  }

  return await pb.collection('publicaciones').create(datos);
}


export async function eliminarPublicacion(id) {
  const usuario = obtenerUsuarioActual();

  if (!usuario) {
    throw new Error('Debes iniciar sesión para eliminar.');
  }

  if (!id) {
    throw new Error('No se encontró la publicación.');
  }

  await pb.collection('publicaciones').delete(id);
}
