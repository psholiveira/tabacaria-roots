import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () => this.setState({ error: null }));
      }
      return (
        <div className="roots-app" style={{
          minHeight: '100dvh', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{ textAlign: 'center', maxWidth: 360 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 99,
              background: 'rgba(180,40,40,0.12)', border: '1px solid var(--rasta-red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 24, color: 'var(--rasta-red)',
            }}>!</div>
            <h2 className="display" style={{ fontSize: 20, marginBottom: 10, letterSpacing: '0.06em' }}>
              ALGO DEU ERRADO
            </h2>
            <p style={{ color: 'var(--ink-mute)', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
              {this.state.error.message || 'Erro inesperado. Tente recarregar a página.'}
            </p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
