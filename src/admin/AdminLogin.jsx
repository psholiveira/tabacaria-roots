import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('Email ou senha incorretos. Verifique e tente novamente.');
      setLoading(false);
    }
    // Sucesso: onAuthStateChange em App.jsx detecta a sessão e redireciona
  };

  return (
    <div className="roots-app" style={{
      minHeight: '100dvh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <form onSubmit={login} style={{ width: '100%', maxWidth: 360 }}>
        <div className="rasta-stripe" style={{ marginBottom: 32, borderRadius: 6 }}/>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/assets/logo-roots-mark.png" alt="Roots" style={{ width: 48, height: 48, marginBottom: 14 }}/>
          <h1 className="display" style={{ fontSize: 18, letterSpacing: '0.12em', marginBottom: 8 }}>
            ROOTS · ADMIN
          </h1>
          <p style={{ fontSize: 12, color: 'var(--ink-mute)', lineHeight: 1.5 }}>
            Área restrita. Faça login com sua conta para acessar o painel.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(180,40,40,0.1)', border: '1px solid var(--rasta-red)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            fontSize: 13, color: 'var(--rasta-red)', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            className="r-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            disabled={loading}
          />
          <input
            className="r-input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: 6, padding: '13px', fontSize: 13, letterSpacing: '0.06em' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <a href="#" style={{ fontSize: 12, color: 'var(--ink-mute)', textDecoration: 'none' }}>
            ← Voltar à loja
          </a>
        </div>
      </form>
    </div>
  );
}
