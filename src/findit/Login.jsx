
import { useState } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import {
  registrarUsuario,
  iniciarSesion
} from '../services/pocketbase.js';

export default function Login({ onAuthenticated, user }) {
  const [modo, setModo] = useState('login');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const registro = modo === 'registro';

  async function enviar(e) {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const usuario = registro
        ? await registrarUsuario(nombre, correo, password)
        : await iniciarSesion(correo, password);

      onAuthenticated({
        id: usuario.id,
        name: usuario.nombre,
        email: usuario.email
      });
    } catch (err) {
      console.error('Error de autenticación:', err);

      setError(
        registro
          ? 'No se pudo crear la cuenta. Revisa los datos e intenta nuevamente.'
          : 'No se pudo iniciar sesión. Comprueba tu correo y contraseña.'
      );
    } finally {
      setCargando(false);
    }
  }

  function cambiarModo() {
    setModo(registro ? 'login' : 'registro');
    setError('');
    setPassword('');
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo-big">
          <Search size={42} />
        </div>

        <div className="brand">
          Find<span>It</span>
        </div>

        <h1>Lo perdido puede volver.</h1>

        <p>
          Conecta con tu comunidad para recuperar
          o devolver objetos.
        </p>

        <div className="login-art">
          <span>🔎</span>
          <span>🎒</span>
          <span>🔑</span>
        </div>

        <form onSubmit={enviar}>

          {registro && (
            <label>
              Tu nombre
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Escribe tu nombre"
                required
                minLength={2}
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Correo electrónico
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              autoComplete="email"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
              minLength={8}
              autoComplete={
                registro ? 'new-password' : 'current-password'
              }
            />
          </label>

          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}

          <button
            className="primary full"
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? 'Procesando...'
              : registro
                ? 'Crear cuenta'
                : 'Iniciar sesión'}
          </button>

        </form>

        <button
          type="button"
          className="secondary full"
          onClick={cambiarModo}
          disabled={cargando}
        >
          {registro
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </button>

        {user && (
          <Link
            to="/inicio"
            className="secondary full link-button"
          >
            Volver al inicio
          </Link>
        )}

      </div>
    </div>
  );
}
