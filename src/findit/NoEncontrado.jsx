
import { Link } from 'react-router';

export default function NoEncontrado() {
  return (
    <div className="empty">
      <h2>Página no encontrada</h2>

      <Link to="/inicio" className="primary">
        Ir al inicio
      </Link>
    </div>
  );
}
