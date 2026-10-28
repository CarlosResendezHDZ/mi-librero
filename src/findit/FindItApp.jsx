import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useNavigate, useParams, useLocation, useSearchParams, Navigate } from 'react-router';

import { Search, House, PlusCircle, Star, UserRound, ArrowLeft, Camera, MapPin, CalendarDays, Settings, WifiOff, LogOut, Heart, Filter as FilterIcon, BookOpen, Trash2, Image as ImageIcon } from 'lucide-react';
import './findit.css';

const KEY = 'findit_items_v1';
const FAV = 'findit_favs_v1';
const ACCOUNT = 'findit_user_v1';

const demo = [
  {
    id: 'ejemplo-1',
    nombre: 'Mochila negra',
    tipo: 'Perdido',
    categoria: 'Accesorios',
    descripcion: 'Se perdió una mochila negra cerca de la biblioteca. Contiene cuadernos.',
    fecha: '2026-10-20',
    lugar: 'Biblioteca',
    autor: 'Comunidad',
    imagen: '',
  },
  {
    id: 'ejemplo-2',
    nombre: 'Llaves con llavero azul',
    tipo: 'Encontrado',
    categoria: 'Llaves',
    descripcion: 'Encontré unas llaves con un llavero azul.',
    fecha: '2026-10-21',
    lugar: 'Entrada principal',
    autor: 'Comunidad',
    imagen: '',
  },
  {
    id: 'ejemplo-3',
    nombre: 'Audífonos blancos',
    tipo: 'Perdido',
    categoria: 'Electrónica',
    descripcion: 'Busco audífonos inalámbricos blancos.',
    fecha: '2026-10-19',
    lugar: 'Cafetería',
    autor: 'Comunidad',
    imagen: '',
  },
];

function stored(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}

function App() {
  const [items, setItems] = useState(() => stored(KEY, demo));
  const [favs, setFavs] = useState(() => stored(FAV, []));
  const [user, setUser] = useState(() => stored(ACCOUNT, null));
  const [online, setOnline] = useState(navigator.onLine);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Todos');
  const [filters, setFilters] = useState({ categoria: '', lugar: '', fecha: '' });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(FAV, JSON.stringify(favs));
  }, [favs]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(ACCOUNT, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACCOUNT);
    }
  }, [user]);

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
    setFavs(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  };

  const login = name => {
    setUser({ name: name.trim() || 'Invitado' });
    navigate('/inicio');
  };

  const publish = entry => {
    const id = globalThis.crypto?.randomUUID?.() || String(Date.now());
    setItems(old => [{ ...entry, id, autor: user?.name || 'Invitado' }, ...old]);
    navigate('/mis-publicaciones');
  };

  const remove = id => {
    if (window.confirm('¿Eliminar esta publicación?')) {
      setItems(old => old.filter(i => i.id !== id));
      setFavs(old => old.filter(x => x !== id));
    }
  };

  return (
    <>
      <div className="app">
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
              <Login onLogin={login} user={user} />
            }
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
                <Items items={visible} favs={favs} toggleFav={toggleFav} />
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
                <Items items={visible} favs={favs} toggleFav={toggleFav} />
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
                {user ? <Publish onPublish={publish} /> : <RequireLogin />}
              </Frame>
            }
          />
          <Route
            path="/objeto/:id"
            element={
              <Frame title="Detalle del objeto" online={online} back>
                <Detail items={items} favs={favs} toggleFav={toggleFav} />
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
                <div className="profile">
                  <div className="avatar">
                    <UserRound size={40} />
                  </div>
                  <h2>
                    {user?.name || 'Invitado'}
                  </h2>
                  <p>
                    {user ? 'Sesión de demostración local' : 'Inicia sesión para publicar'}
                  </p>
                </div>
                <div className="profile-menu">
                  <Link to="/mis-publicaciones">
                    <BookOpen />
                    Mis publicaciones
                    <span>
                      ›
                    </span>
                  </Link>
                  <Link to="/mis-publicaciones?tab=favoritos">
                    <Heart />
                    Mis favoritos
                    <span>
                      ›
                    </span>
                  </Link>
                  <div>
                    <WifiOff />
                    Modo sin conexión
                    <span>
                      {online ? 'Con conexión' : 'Sin conexión'}
                    </span>
                  </div>
                  <div>
                    <Settings />
                    Configuración
                    <span>
                      Próximamente
                    </span>
                  </div>
                  {user ? <button onClick={() => { setUser(null); navigate('/login'); }}><LogOut /> Cerrar sesión <span>›</span></button> : <Link to="/login"><UserRound /> Iniciar sesión <span>›</span></Link>}
                </div>
              </Frame>
            }
          />
          <Route
            path="*"
            element={
              <Frame title="No encontrada" online={online}>
                <div className="empty">
                  <h2>
                    Página no encontrada
                  </h2>
                  <Link to="/inicio" className="primary">
                    Ir al inicio
                  </Link>
                </div>
              </Frame>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function Login({ onLogin, user }) {
  const [name, setName] = useState('');

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-big">
          <Search size={42} />
        </div>
        <div className="brand">
          Find
          <span>
            It
          </span>
        </div>
        <h1>
          Lo perdido puede volver.
        </h1>
        <p>
          Conecta con tu comunidad para recuperar o devolver objetos.
        </p>
        <div className="login-art">
          <span>
            🔎
          </span>
          <span>
            🎒
          </span>
          <span>
            🔑
          </span>
        </div>
        <form onSubmit={e => { e.preventDefault(); onLogin(name); }}>
          <label>
            Tu nombre
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Escribe tu nombre"
              required
              minLength={2}
            />
          </label>
          <button className="primary full">
            Comenzar
          </button>
        </form>
        {user && <Link to="/inicio" className="secondary full link-button">Volver al inicio</Link>}
        <p className="disclaimer">
          Acceso de demostración. Firebase Authentication se integrará en la siguiente etapa.
        </p>
      </div>
    </div>
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
        {children}
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

function Publish({ onPublish }) {
  const [form, setForm] = useState({ tipo: 'Perdido', nombre: '', categoria: '', descripcion: '', fecha: new Date().toISOString().slice(0, 10), lugar: '', imagen: '' });

  const [error, setError] = useState('');

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function photo(e) {
    const file = e.target.files?.[0];

    if (!file)
      return;

    if (file.size > 1200000) {
      setError('La imagen debe pesar menos de 1.2 MB en esta versión local.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => { set('imagen', reader.result); setError(''); };

    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();

    if (!form.nombre.trim() || !form.categoria.trim() || !form.lugar.trim()) {
      setError('Completa los campos obligatorios.');
      return;
    }

    try {
      onPublish(form);
    } catch {
      setError('No se pudo guardar. Prueba con una imagen más pequeña.');
    }
  }

  return (
    <form className="panel publish-form" onSubmit={submit}>
      <div className="type-picker">
        <button
          type="button"
          className={form.tipo === 'Perdido' ? 'active' : ''}
          onClick={() => set('tipo', 'Perdido')}
        >
          Perdidos
        </button>
        <button
          type="button"
          className={form.tipo === 'Encontrado' ? 'active' : ''}
          onClick={() => set('tipo', 'Encontrado')}
        >
          Encontrados
        </button>
      </div>
      <label className="photo-upload">
        <input type="file" accept="image/*" onChange={photo} />
        {form.imagen ? <img src={form.imagen} alt="Vista previa" /> : <><Camera size={30} /><span>Agregar foto (opcional)</span></>}
      </label>
      <label>
        Nombre del objeto *
        <input
          value={form.nombre}
          onChange={e => set('nombre', e.target.value)}
          required
          maxLength={90}
          placeholder="Ej. Mochila azul"
        />
      </label>
      <label>
        Categoría *
        <select
          value={form.categoria}
          onChange={e => set('categoria', e.target.value)}
          required
        >
          <option value="">
            Selecciona una categoría
          </option>
          {['Electrónica', 'Documentos', 'Llaves', 'Accesorios', 'Ropa', 'Mascotas', 'Otros'].map(x => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label>
        Descripción
        <textarea
          value={form.descripcion}
          onChange={e => set('descripcion', e.target.value)}
          rows={4}
          maxLength={700}
          placeholder="Describe el objeto y sus características"
        />
      </label>
      <label>
        Fecha *
        <input
          type="date"
          value={form.fecha}
          onChange={e => set('fecha', e.target.value)}
          required
        />
      </label>
      <label>
        Lugar *
        <input
          value={form.lugar}
          onChange={e => set('lugar', e.target.value)}
          required
          placeholder="¿Dónde se perdió o encontró?"
        />
      </label>
      {error && <p className="error-text">{error}</p>}
      <button className="primary full" type="submit">
        Publicar objeto
      </button>
      <p className="help">
        Esta versión guarda la publicación en este navegador, no en una base de datos compartida.
      </p>
    </form>
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

  const shown = tab === 'mias' ? items.filter(x => user && x.autor === user.name) : items.filter(x => favs.includes(x.id));

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
