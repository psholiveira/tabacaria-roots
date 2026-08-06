import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

// ─── Lockout local contra tentativas repetidas ─────────────────────────────
// Proteção só de UX/fricção: roda no navegador, não substitui rate limiting
// no servidor. Bloqueia por e-mail depois de várias falhas seguidas.
const LOCKOUT_KEY   = 'roots_admin_login_guard';
const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 60 * 1000;

function readGuard(email) {
  try {
    const all = JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}');
    return all[email] || { attempts: 0, lockedUntil: 0 };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function writeGuard(email, guard) {
  try {
    const all = JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}');
    all[email] = guard;
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(all));
  } catch { /* localStorage indisponível: ignora */ }
}

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  // Etapa de MFA (só aparece se a conta tiver TOTP ativado)
  const [mfaFactorId, setMfaFactorId]   = useState(null);
  const [mfaChallenge, setMfaChallenge] = useState(null);
  const [mfaCode, setMfaCode]           = useState('');

  useEffect(() => {
    if (!lockedUntil) return;
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= lockedUntil) setLockedUntil(0);
    }, 1000);
    return () => clearInterval(t);
  }, [lockedUntil]);

  const secondsLeft = lockedUntil ? Math.max(0, Math.ceil((lockedUntil - now) / 1000)) : 0;
  const isLocked = secondsLeft > 0;

  const login = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const guard = readGuard(normalizedEmail);

    if (guard.lockedUntil > Date.now()) {
      setLockedUntil(guard.lockedUntil);
      setError('Muitas tentativas. Aguarde para tentar novamente.');
      return;
    }

    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      const attempts = guard.attempts + 1;
      const locked = attempts >= MAX_ATTEMPTS;
      const nextGuard = {
        attempts,
        lockedUntil: locked ? Date.now() + LOCKOUT_MS : 0,
      };
      writeGuard(normalizedEmail, nextGuard);
      if (locked) setLockedUntil(nextGuard.lockedUntil);
      setError('Email ou senha incorretos. Verifique e tente novamente.');
      setLoading(false);
      return;
    }

    // Login de senha ok. Verifica se a conta exige um segundo fator (MFA).
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== aal.nextLevel) {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const factor = factors?.totp?.[0];
      if (factor) {
        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
        if (challengeError) {
          setError('Erro ao iniciar verificação MFA. Tente novamente.');
          setLoading(false);
          return;
        }
        setMfaFactorId(factor.id);
        setMfaChallenge(challenge.id);
        setLoading(false);
        return;
      }
    }

    // Sem MFA pendente: limpa tentativas e deixa onAuthStateChange redirecionar
    writeGuard(normalizedEmail, { attempts: 0, lockedUntil: 0 });
  };

  const verifyMfa = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: mfaChallenge,
      code: mfaCode,
    });
    if (verifyError) {
      setError('Código inválido. Confira o app autenticador e tente novamente.');
      setLoading(false);
      return;
    }
    // Sucesso: onAuthStateChange em App.jsx detecta a sessão (aal2) e redireciona
  };

  if (mfaFactorId) {
    return (
      <div className="roots-app" style={{
        minHeight: '100dvh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <form onSubmit={verifyMfa} style={{ width: '100%', maxWidth: 360 }}>
          <div className="rasta-stripe" style={{ marginBottom: 32, borderRadius: 6 }}/>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 className="display" style={{ fontSize: 18, letterSpacing: '0.12em', marginBottom: 8 }}>
              VERIFICAÇÃO EM DUAS ETAPAS
            </h1>
            <p style={{ fontSize: 12, color: 'var(--ink-mute)', lineHeight: 1.5 }}>
              Digite o código de 6 dígitos do seu app autenticador.
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
          <input
            className="r-input" value={mfaCode} onChange={e => setMfaCode(e.target.value)}
            placeholder="Código de 6 dígitos" inputMode="numeric" maxLength={6}
            autoFocus required disabled={loading}
            style={{ textAlign: 'center', letterSpacing: '0.3em', marginBottom: 12 }}
          />
          <button
            type="submit" className="btn-primary" disabled={loading || mfaCode.length < 6}
            style={{ width: '100%', padding: '13px', fontSize: 13, letterSpacing: '0.06em' }}
          >
            {loading ? 'Verificando...' : 'Confirmar'}
          </button>
        </form>
      </div>
    );
  }

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

        {(error || isLocked) && (
          <div style={{
            background: 'rgba(180,40,40,0.1)', border: '1px solid var(--rasta-red)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            fontSize: 13, color: 'var(--rasta-red)', lineHeight: 1.5,
          }}>
            {isLocked ? `Muitas tentativas. Tente novamente em ${secondsLeft}s.` : error}
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
            disabled={loading || isLocked}
          />
          <input
            className="r-input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading || isLocked}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || isLocked}
            style={{ marginTop: 6, padding: '13px', fontSize: 13, letterSpacing: '0.06em' }}
          >
            {loading ? 'Entrando...' : isLocked ? `Aguarde ${secondsLeft}s` : 'Entrar'}
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
