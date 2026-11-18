
import { Link } from 'react-router';
import {
  UserRound,
  BookOpen,
  Heart,
  WifiOff,
  Settings,
  LogOut
} from 'lucide-react';

export default function Perfil({ user, online, onLogout }) {
  return (
    <>
      <div className="profile">
        <div className="avatar">
          <UserRound size={40} />
        </div>

        <h2>{user?.name || 'Invitado'}</h2>

        <p>
          {user
            ? 'Sesión de demostración local'
            : 'Inicia sesión para publicar'}
        </p>
      </div>

      <div className="profile-menu">
        <Link to="/mis-publicaciones">
          <BookOpen />
          Mis publicaciones
          <span>›</span>
        </Link>

        <Link to="/mis-publicaciones?tab=favoritos">
          <Heart />
          Mis favoritos
          <span>›</span>
        </Link>

        <div>
          <WifiOff />
          Modo sin conexión
          <span>{online ? 'Con conexión' : 'Sin conexión'}</span>
        </div>

        <div>
          <Settings />
          Configuración
          <span>Próximamente</span>
        </div>

        {user ? (
          <button type="button" onClick={onLogout}>
            <LogOut />
            Cerrar sesión
            <span>›</span>
          </button>
        ) : (
          <Link to="/login">
            <UserRound />
            Iniciar sesión
            <span>›</span>
          </Link>
        )}
      </div>
    </>
  );
}
