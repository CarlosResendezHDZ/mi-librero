
# Mi Librero

Mi Librero es una aplicación web desarrollada con React y Vite que permite buscar información de libros mediante su código ISBN.

El proyecto utiliza la API de Open Library para obtener datos como el título, autor, editorial y portada.

## Objetivo

Desarrollar un App Shell que mantenga una estructura de navegación estable, muestre estados de carga y permita detectar cuando el dispositivo pierde conexión a internet.

## Tecnologías utilizadas

- React
- Vite
- React Router
- Bootstrap y Bootstrap Icons
- Open Library API
- Firebase Hosting
- GitHub Actions

## Funcionalidades

- Navegación entre Biblioteca, Agregar y Reseñas.
- Búsqueda de libros mediante ISBN.
- Consulta de información y portadas.
- Indicador de conexión a internet.
- Aviso cuando no hay conexión.
- Animaciones de carga (skeletons).
- Pantallas de error y página 404.

## Tabla de definición del App Shell

| Área | Elemento | Componente | Sin conexión | Semana |
|---|---|---|---|---|
| Pre-shell | Encabezado y animación de carga | index.html | Necesita cargar la página; el caché sin conexión llegará después | 1 |
| Header | Nombre e indicador de red | AppHeader, NetworkBadge | Indica "Sin conexión" | 1 |
| Navegación | Biblioteca, Agregar y Reseñas | BottomNav | Las vistas ya cargadas pueden seguir funcionando | 1 |
| Contenido | Pantallas de la aplicación | AppLayout, Outlet, vistas | Las vistas no descargadas pueden fallar | 1 |
| Estados de carga | Animaciones de espera | ViewSkeleton, BookSkeleton | Se muestran durante las cargas | 1 |
| Errores y 404 | Mensajes de error | ViewErrorBoundary, NoEncontrado | Permite mostrar errores sin perder el shell | 1 |
| Feedback global | Aviso de conexión | OfflineBanner | Muestra una advertencia | 1 |
| Acción global | Instalación de la aplicación | InstallButton (pendiente) | Se implementará posteriormente | 2 |

## Wireframe del App Shell

El siguiente esquema representa la estructura principal de Mi Librero.

```text
+--------------------------------------+
|             MI LIBRERO               |
|                    [En línea]        |
+--------------------------------------+
|                                      |
|       Aviso de conexión              |
|       (cuando sea necesario)         |
|                                      |
+--------------------------------------+
|                                      |
|           CONTENIDO                  |
|                                      |
|       Mi biblioteca                  |
|                                      |
|       Aún no tienes libros           |
|                                      |
|         [Agregar libro]              |
|                                      |
|                                      |
+--------------------------------------+
|                                      |
|  Biblioteca    Agregar    Reseñas     |
|                                      |
+--------------------------------------+
```

El encabezado y la navegación inferior pertenecen al App Shell porque se mantienen en todas las pantallas.

El contenido central cambia dependiendo de la sección seleccionada.

## Pruebas realizadas

- Ejecución local con Vite.
- Revisión del código con ESLint.
- Compilación de producción.
- Prueba de navegación entre pantallas.
- Prueba HTTPS desde un celular.
- Publicación en Firebase Hosting.
- Ejecución correcta de GitHub Actions.

## Ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
npm run dev
```

Generar la versión de producción:

```bash
npm run build
```

## Enlaces

**Aplicación publicada:**
https://mi-librero-85180.web.app

**Repositorio de GitHub:**
https://github.com/CarlosResendezHDZ/mi-librero

## Próximas funcionalidades

En las siguientes etapas se implementarán funciones como el almacenamiento local de libros, reseñas, funcionamiento sin conexión mediante un service worker, instalación de la aplicación y escaneo de códigos de barras.
