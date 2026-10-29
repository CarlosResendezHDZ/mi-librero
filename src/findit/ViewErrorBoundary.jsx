
import { Component } from 'react';

export default class ViewErrorBoundary extends Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error en una pantalla de FindIt:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty" role="alert">
          <h2>Ocurrió un problema</h2>

          <p>
            No pudimos mostrar esta pantalla.
            Intenta cargarla nuevamente.
          </p>

          <button
            type="button"
            className="primary"
            onClick={() => this.setState({ hasError: false })}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
