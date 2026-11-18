import { lazy, Suspense, useEffect, useMemo, useState } from 'react';import { Routes, Route, Link, useNavigate, useParams, useLocation, useSearchParams, Navigate } from 'react-router';

import { Search, House, PlusCircle, Star, UserRound, ArrowLeft, MapPin, CalendarDays, Filter as FilterIcon, Trash2, Image as ImageIcon } from 'lucide-react';import './findit.css';
import ViewErrorBoundary from './ViewErrorBoundary.jsx';
import LoginPocketBase from './Login.jsx';
import {
  obtenerUsuarioActual,
  cerrarSesion
} from '../services/pocketbase.js';
import {
  obtenerPublicaciones,
  escucharCambiosPublicaciones,
  crearPublicacion,
  eliminarPublicacion
} from '../services/pocketbase.js';


const NoEncontrado = lazy(() => import('./NoEncontrado.jsx'));
const Perfil = lazy(() => import('./Perfil.jsx'));
const Publicar = lazy(() => import('./Publicar.jsx'));
const KEY = 'findit_publicaciones_remotas_v2';
const FAV = 'findit_favs_v1';



function stored(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}

function App() {
  const [items, setItems] = useState(() => stored(KEY, []));
  const [favs, setFavs] = useState(() => stored(FAV, []));
const [user, setUser] = useState(() => {
  const actual = obtenerUsuarioActual();

  return actual
    ? {
        id: actual.id,
        name: actual.nombre || actual.email,
        email: actual.email
      }
    : null;
});  const [online, setOnline] = useState(navigator.onLine);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Todos');
  const [filters, setFilters] = useState({ categoria: '', lugar: '', fecha: '' });
  const [cargandoPublicaciones, setCargandoPublicaciones] = useState(true);
  const [avisoAPI, setAvisoAPI] = useState('');
  const [notificacion, setNotificacion] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  if (!notificacion) return;

  const temporizador = setTimeout(() => {
    setNotificacion('');
  }, 3500);

  return () => clearTimeout(temporizador);
}, [notificacion]);
  

useEffect(() => {
  let activo = true;

  obtenerPublicaciones()
    .then((remotas) => {
      if (!activo) return;
      setItems(
        remotas.map((item) => ({
          ...item,
          origen: 'pocketbase',
        }))
      );

      setAvisoAPI('');

    })
    .catch((error) => {
      console.error('Error al consultar PocketBase:', error);

      if (activo) {
        setAvisoAPI(
          'No se pudo conectar con PocketBase. Se muestran los datos guardados.'
        );
      }
    })   
    .finally(() => {
      if (activo) {
        setCargandoPublicaciones(false);
      }
    });

  return () => {
    activo = false;
  };
}, []);


useEffect(() => {
  let activo = true;
  let cancelarSuscripcion;

  const actualizarPublicaciones = async () => {
    try {
      const remotas = await obtenerPublicaciones();

      if (!activo) return;

      setItems(
        remotas.map((item) => ({
          ...item,
          origen: 'pocketbase',
        }))
      );

      setAvisoAPI('');
    } catch (error) {
      if (activo) {
        console.warn(
          'No se pudieron actualizar las publicaciones:',
          error
        );
      }
    }
  };

  escucharCambiosPublicaciones(actualizarPublicaciones)
    .then((cancelar) => {
      if (activo) {
        cancelarSuscripcion = cancelar;
      } else {
        void cancelar();
      }
    })
    .catch((error) => {
      if (activo) {
        console.warn('Realtime no disponible:', error);
      }
    });

  const alRecuperarInternet = () => {
    void actualizarPublicaciones();
  };

  const alVolverALaPestana = () => {
    if (document.visibilityState === 'visible') {
      void actualizarPublicaciones();
    }
  };

  window.addEventListener('online', alRecuperarInternet);
  document.addEventListener('visibilitychange', alVolverALaPestana);

  // Respaldo si PocketBase se reinicia sin perder internet.
  const intervalo = window.setInterval(() => {
    if (navigator.onLine && document.visibilityState === 'visible') {
      void actualizarPublicaciones();
    }
  }, 30000);

  return () => {
    activo = false;

    window.removeEventListener('online', alRecuperarInternet);
    document.removeEventListener('visibilitychange', alVolverALaPestana);

    window.clearInterval(intervalo);

    if (cancelarSuscripcion) {
      void cancelarSuscripcion();
    }
  };
}, []);



  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(FAV, JSON.stringify(favs));
  }, [favs]);


  useEffect(() => {
    const yes = () => setOnline(true);
    const no = () => setOnline(false);

    window.addEventListener('online', yes);
    window.addEventListener('offline', no);

    return () => {
      window.removeEventListener('online', yes);
      window.removeEventListener('offline', no);
    };
  }, []);

  const visible = useMemo(
    () => items.filter(i =>
      (type === 'Todos' || i.tipo === type) &&
      (!search || [i.nombre, i.descripcion, i.lugar, i.categoria]
        .join(' ').toLowerCase().includes(search.toLowerCase())) &&
      (!filters.categoria || i.categoria.toLowerCase().includes(filters.categoria.toLowerCase())) &&
      (!filters.lugar || i.lugar.toLowerCase().includes(filters.lugar.toLowerCase())) &&
      (!filters.fecha || i.fecha === filters.fecha)
    ),
    [items, type, search, filters]
  );

  
  const toggleFav = id => {
    const guardado = favs.includes(id);

    setFavs(old =>
      old.includes(id)
        ? old.filter(x => x !== id)
        : [...old, id]
    );

    setNotificacion(
      guardado
        ? 'Publicación eliminada de favoritos.'
        : 'Publicación guardada en favoritos.'
    );
  };


  const login = usuario => {
    setUser(usuario);
    navigate('/inicio');
  };



const publish = async entry => {
  const nueva = await crearPublicacion(entry);

  const publicacion = {
    id: nueva.id,
    nombre: nueva.nombre,
    tipo: nueva.tipo,
    categoria: nueva.categoria,
    descripcion: nueva.descripcion,
    fecha: nueva.fecha?.slice(0, 10) || '',
    lugar: nueva.lugar,
    autor: nueva.autor,
    usuario: nueva.usuario,
    imagen: entry.imagen || '',
    origen: 'pocketbase'
  };

  setItems(actuales => [
    publicacion,
    ...actuales.filter(item => item.id !== publicacion.id)
  ]);

  setNotificacion('¡Publicación guardada en PocketBase!');
  navigate('/mis-publicaciones');
};





const remove = async id => {
  try {
    await eliminarPublicacion(id);

    setItems(actuales =>
      actuales.filter(item => item.id !== id)
    );

    setNotificacion(
      '¡Publicación eliminada correctamente!'
    );
  } catch (error) {
    console.error('Error al eliminar:', error);

    setNotificacion(
      'No se pudo eliminar la publicación. Inténtalo nuevamente.'
    );
  }
};



  return (
    <>
      <div className="app">
        
      {notificacion && (
        <div className="findit-toast" role="status">
          <span>✓ {notificacion}</span>

          <button
            type="button"
            onClick={() => setNotificacion('')}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      )}

        {avisoAPI && (
          <div className="api-alert" role="alert">
            <span>{avisoAPI}</span>

            <button
              type="button"
              onClick={() => setAvisoAPI('')}
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={user ? '/inicio' : '/login'} replace />
            }
          />
          <Route
            path="/login"
            element={
<LoginPocketBase
  onAuthenticated={login}
  user={user}
/>            }
          />
          <Route
            path="/inicio"
            element={
              <Frame title="Inicio" online={online}>
                <div className="welcome">
                  <div>
                    <span className="eyebrow">
                      COMUNIDAD FINDIT
                    </span>
                    <h1>
                      Encuentra lo que importa.
                    </h1>
                    <p>
                      Publica y descubre objetos perdidos o encontrados.
                    </p>
                  </div>
                  <span className="welcome-icon">
                    ✦
                  </span>
                </div>
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  onSubmit={() => navigate('/buscar')}
                />
                <div className="chips">
                  {['Todos', 'Perdido', 'Encontrado'].map(t => <button key={t} className={type === t ? 'chip active' : 'chip'} onClick={() => setType(t)}>{t === 'Perdido' ? 'Perdidos' : t === 'Encontrado' ? 'Encontrados' : t}</button>)}
                  <Link className="chip filter-link" to="/filtros">
                    <FilterIcon size={15} />
                    Filtros
                  </Link>
                </div>
                <SectionTitle
                  title="Publicaciones recientes"
                  subtitle={`${visible.length} resultados`}
                />
                
                  {cargandoPublicaciones ? (
                    <ItemsSkeleton />
                  ) : (
                    <Items
                      items={visible}
                      favs={favs}
                      toggleFav={toggleFav}
                    />
                  )}

              </Frame>
            }
          />
          <Route
            path="/buscar"
            element={
              <Frame title="Buscar" online={online} back>
                <SearchBar value={search} onChange={setSearch} autoFocus />
                <div className="chips">
                  {['Todos', 'Perdido', 'Encontrado'].map(t => <button key={t} className={type === t ? 'chip active' : 'chip'} onClick={() => setType(t)}>{t === 'Perdido' ? 'Perdidos' : t === 'Encontrado' ? 'Encontrados' : t}</button>)}
                  <Link to="/filtros" className="chip filter-link">
                    <FilterIcon size={15} />
                    Filtros
                  </Link>
                </div>
                <SectionTitle
                  title="Resultados de búsqueda"
                  subtitle={`${visible.length} encontrados`}
                />

{cargandoPublicaciones ? (
  <ItemsSkeleton />
) : (
  <Items
    items={visible}
    favs={favs}
    toggleFav={toggleFav}
  />
)}
              </Frame>
            }
          />
          <Route
            path="/filtros"
            element={
              <Frame title="Filtros" online={online} back>
                <div className="panel">
                  <h2>
                    Tipo de objetos
                  </h2>
                  <div className="radio-list">
                    {['Todos', 'Perdido', 'Encontrado'].map(t => <label key={t}><input type="radio" name="tipo" checked={type === t} onChange={() => setType(t)} />{t === 'Perdido' ? 'Perdidos' : t === 'Encontrado' ? 'Encontrados' : t}</label>)}
                  </div>
                  <label>
                    Categoría
                    <input
                      placeholder="Ej. Electrónica"
                      value={filters.categoria}
                      onChange={e => setFilters({ ...filters, categoria: e.target.value })}
                    />
                  </label>
                  <label>
                    Fecha
                    <input
                      type="date"
                      value={filters.fecha}
                      onChange={e => setFilters({ ...filters, fecha: e.target.value })}
                    />
                  </label>
                  <label>
                    Lugar
                    <input
                      placeholder="Ej. Biblioteca"
                      value={filters.lugar}
                      onChange={e => setFilters({ ...filters, lugar: e.target.value })}
                    />
                  </label>
                  <button className="primary full" onClick={() => navigate('/buscar')}>
                    Aplicar filtros
                  </button>
                  <button
                    className="secondary full"
                    onClick={() => { setType('Todos'); setFilters({ categoria: '', fecha: '', lugar: '' }); setSearch(''); }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              </Frame>
            }
          />
          
          <Route
            path="/publicar"
            element={
              <Frame title="Publicar objeto" online={online} back>
                {user ? (
                  <Suspense
                    fallback={
                      <div
                        className="panel publish-form"
                        role="status"
                        aria-label="Cargando formulario"
                        aria-busy="true"
                      >
                        <div className="skeleton-image skeleton-effect" />
                        <div className="skeleton-line skeleton-medium skeleton-effect" />
                        <div className="skeleton-line skeleton-large skeleton-effect" />
                        <div className="skeleton-line skeleton-medium skeleton-effect" />
                        <div className="skeleton-line skeleton-large skeleton-effect" />
                      </div>
                    }
                  >
          <Publicar onPublish={publish} />
        </Suspense>
      ) : (
        <RequireLogin />
      )}
    </Frame>
  }
/>

<Route
  path="/objeto/:id"
  element={
    <Frame title="Detalle del objeto" online={online} back>
      <Detail
        items={items}
        favs={favs}
        toggleFav={toggleFav}
      />
    </Frame>
  }
/>

<Route
  path="/mis-publicaciones"
  element={
    <Frame title="Mis publicaciones" online={online} back>
      <MyPosts
        items={items}
        user={user}
        favs={favs}
        toggleFav={toggleFav}
        remove={remove}
      />
    </Frame>
  }
/>

          
          <Route
            path="/perfil"
            element={
              <Frame title="Perfil" online={online} back>
                <Suspense
                  fallback={
                    <div
                      className="panel"
                      role="status"
                      aria-label="Cargando perfil"
                    >
                      <div className="skeleton-line skeleton-large skeleton-effect" />
                      <div className="skeleton-line skeleton-medium skeleton-effect" />
                      <div className="skeleton-line skeleton-small skeleton-effect" />
                    </div>
                  }
                >
                  <Perfil
                    user={user}
                    online={online}
                    onLogout={() => {
                      cerrarSesion();
                      setUser(null);
                      navigate('/login');
                    }}
                  />
                </Suspense>
              </Frame>
            }
          />

          
          <Route
            path="*"
            element={
              <Frame title="No encontrada" online={online}>
                <Suspense
                  fallback={
                    <div className="empty" role="status">
                      Cargando pantalla...
                    </div>
                  }
                >
                  <NoEncontrado />
                </Suspense>
              </Frame>
            }
          />

        </Routes>
      </div>
    </>
  );
}


function Frame({ title, children, online, back = false }) {
  const navigate = useNavigate();

  const loc = useLocation();

  return (
    <>
      <header className="topbar">
        <div className="top-inner">
          <div className="heading">
            {back ? <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Volver"><ArrowLeft /></button> : <Search className="brand-icon" />}
            <Link to="/inicio" className="small-brand">
              Find
              <span>
                It
              </span>
            </Link>
          </div>
          <strong className="page-title">
            {title}
          </strong>
          <div className={online ? 'status' : 'status offline'}>
            {online ? '● En línea' : '● Sin conexión'}
          </div>
        </div>
      </header>
      {!online && <div className="offline-banner">Sin conexión. Puedes consultar los datos guardados en este navegador.</div>}
      <main className="content">
        <ViewErrorBoundary key={loc.pathname}>
          {children}
        </ViewErrorBoundary>
      </main>
      <nav className="bottom-nav" aria-label="Navegación principal">
        {[['/inicio', House, 'Inicio'], ['/buscar', Search, 'Buscar'], ['/publicar', PlusCircle, 'Publicar'], ['/mis-publicaciones', Star, 'Guardados'], ['/perfil', UserRound, 'Perfil']].map(([path, Icon, label]) => <Link key={path} to={path} className={(loc.pathname === path ? 'selected' : '')}><Icon size={22} /><span>{label}</span></Link>)}
      </nav>
    </>
  );
}

function SearchBar({ value, onChange, onSubmit, autoFocus = false }) {
  return (
    <form className="searchbar" onSubmit={e => { e.preventDefault(); onSubmit?.(); }}>
      <Search size={21} />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar objetos, lugares, categorías..."
        aria-label="Buscar objetos"
      />
      <button type="submit">
        Buscar
      </button>
    </form>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h2>
        {title}
      </h2>
      <span>
        {subtitle}
      </span>
    </div>
  );
}


function ItemsSkeleton() {
  return (
    <div
      className="item-grid"
      role="status"
      aria-label="Cargando publicaciones"
      aria-busy="true"
    >
      {[1, 2, 3].map((n) => (
        <article
          className="item-card skeleton-card"
          key={n}
          aria-hidden="true"
        >
          <div className="skeleton-image skeleton-effect" />

          <div className="item-info">
            <div className="skeleton-line skeleton-small skeleton-effect" />
            <div className="skeleton-line skeleton-large skeleton-effect" />
            <div className="skeleton-line skeleton-medium skeleton-effect" />
            <div className="skeleton-line skeleton-small skeleton-effect" />
          </div>
        </article>
      ))}
    </div>
  );
}


function Items({ items, favs, toggleFav }) {

  


  return items.length ? <div className="item-grid">{items.map(item => <ItemCard key={item.id} item={item} liked={favs.includes(item.id)} toggleFav={toggleFav} />)}</div> : <div className="empty"><Search size={35} /><h3>No encontramos publicaciones</h3><p>Prueba otros términos o cambia los filtros.</p></div>;
}

function ItemCard({ item, liked, toggleFav }) {
  return (
    <article className="item-card">
      <Link to={`/objeto/${item.id}`} className="thumb">
        {item.imagen ? <img src={item.imagen} alt={item.nombre} /> : <ImageIcon size={45} />}
      </Link>
      <div className="item-info">
        <div className="item-top">
          <span className={'tag ' + (item.tipo === 'Perdido' ? 'lost' : 'found')}>
            {item.tipo}
          </span>
          <button
            className={'heart ' + (liked ? 'liked' : '')}
            onClick={() => toggleFav(item.id)}
            aria-label="Agregar o quitar de favoritos"
          >
            <Star size={20} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <Link to={`/objeto/${item.id}`} className="item-title">
          {item.nombre}
        </Link>
        <p>
          <MapPin size={14} />
          {item.lugar}
        </p>
        <p>
          <CalendarDays size={14} />
          {item.fecha}
        </p>
      </div>
    </article>
  );
}



function Detail({ items, favs, toggleFav }) {
  const { id } = useParams();

  const i = items.find(x => x.id === id);

  if (!i)
    return (
      <div className="empty">
        No encontramos ese objeto.
      </div>
    );

  return (
    <article className="detail">
      <div className="detail-photo">
        {i.imagen ? <img src={i.imagen} alt={i.nombre} /> : <ImageIcon size={75} />}
      </div>
      <div className="detail-head">
        <div>
          <span className={'tag ' + (i.tipo === 'Perdido' ? 'lost' : 'found')}>
            {i.tipo}
          </span>
          <h1>
            {i.nombre}
          </h1>
        </div>
        <button
          className={'heart ' + (favs.includes(i.id) ? 'liked' : '')}
          onClick={() => toggleFav(i.id)}
          aria-label="Favorito"
        >
          <Star size={26} fill={favs.includes(i.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="detail-meta">
        <MapPin size={18} />
        {i.lugar}
      </p>
      <p className="detail-meta">
        <CalendarDays size={18} />
        {i.fecha}
      </p>
      <div className="panel">
        <h2>
          Descripción
        </h2>
        <p>
          {i.descripcion || 'Sin descripción adicional.'}
        </p>
        <div className="detail-tags">
          <span>
            {i.categoria}
          </span>
          <span>
            {i.tipo}
          </span>
        </div>
        <hr />
        <h3>
          Publicado por
        </h3>
        <div className="author">
          <UserRound />
          {i.autor}
        </div>
      </div>
    </article>
  );
}

function MyPosts({ items, user, favs, toggleFav, remove }) {
const [searchParams, setSearchParams] = useSearchParams()

const tab = searchParams.get('tab') === 'favoritos'
  ? 'favoritos'
  : 'mias'

const setTab = (nuevoTab) => {
  setSearchParams(
    nuevoTab === 'favoritos' ? { tab: 'favoritos' } : {}
  )
}

  const shown = tab === 'mias' ? items.filter(x => user && x.usuario === user.id) : items.filter(x => favs.includes(x.id));

  return (
    <>
      <div className="tabs">
        <button className={tab === 'mias' ? 'active' : ''} onClick={() => setTab('mias')}>
          Mis publicaciones
        </button>
        <button
          className={tab === 'favoritos' ? 'active' : ''}
          onClick={() => setTab('favoritos')}
        >
          Favoritos
        </button>
      </div>
      {shown.length ? <div className="item-grid">{shown.map(i => <div key={i.id}><ItemCard item={i} liked={favs.includes(i.id)} toggleFav={toggleFav} />{tab === 'mias' && <button className="delete" onClick={() => remove(i.id)}><Trash2 size={15} /> Eliminar</button>}</div>)}</div> : <div className="empty"><Star size={34} /><h3>{tab === 'mias' ? 'Aún no tienes publicaciones' : 'Aún no tienes favoritos'}</h3><p>{tab === 'mias' ? 'Publica tu primer objeto para verlo aquí.' : 'Marca con una estrella los objetos que quieras guardar.'}</p><Link to={tab === 'mias' ? '/publicar' : '/inicio'} className="primary link-button">{tab === 'mias' ? 'Publicar objeto' : 'Explorar objetos'}</Link></div>}
    </>
  );
}

function RequireLogin() {
  return (
    <div className="empty">
      <UserRound size={34} />
      <h3>
        Inicia sesión para continuar en FindIt
      </h3>
      <Link className="primary link-button" to="/login">
        Ir a login
      </Link>
    </div>
  );
}

export default App;
