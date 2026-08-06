// admin/SecurityPanel.jsx — ativação/remoção de MFA (TOTP) via Supabase Auth

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

export function SecurityPanel({ onClose }) {
  const [factors, setFactors]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Estado do fluxo de ativação
  const [enrolling, setEnrolling] = useState(null); // { factorId, qrCode, secret }
  const [code, setCode]           = useState('');
  const [busy, setBusy]           = useState(false);

  const loadFactors = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase.auth.mfa.listFactors();
    if (err) setError(err.message);
    else setFactors(data.totp.filter(f => f.status === 'verified'));
    setLoading(false);
  }, []);

  useEffect(() => { loadFactors(); }, [loadFactors]);

  const startEnroll = async () => {
    setError(null);
    setBusy(true);
    const { data, error: err } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setEnrolling({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
  };

  const confirmEnroll = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({ factorId: enrolling.factorId });
    if (challengeErr) { setError(challengeErr.message); setBusy(false); return; }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId: enrolling.factorId,
      challengeId: challenge.id,
      code,
    });
    setBusy(false);
    if (verifyErr) { setError('Código inválido. Confira o app autenticador e tente novamente.'); return; }

    setEnrolling(null);
    setCode('');
    loadFactors();
  };

  const cancelEnroll = async () => {
    if (enrolling) await supabase.auth.mfa.unenroll({ factorId: enrolling.factorId });
    setEnrolling(null);
    setCode('');
    setError(null);
  };

  const removeFactor = async (factorId) => {
    if (!confirm('Desativar o MFA? Sua conta ficará protegida só por senha.')) return;
    setBusy(true);
    const { error: err } = await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);
    if (err) { setError(err.message); return; }
    loadFactors();
  };

  const hasMfa = factors && factors.length > 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div className="r-card" style={{ maxWidth: 420, width: '100%', padding: 24 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="display" style={{ fontSize: 15, letterSpacing: '0.06em' }}>SEGURANÇA DA CONTA</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(180,40,40,0.1)', border: '1px solid var(--rasta-red)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12.5, color: 'var(--rasta-red)',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>Carregando...</div>
        ) : enrolling ? (
          <form onSubmit={confirmEnroll}>
            <p style={{ fontSize: 12.5, color: 'var(--ink-dim)', lineHeight: 1.6, marginBottom: 12 }}>
              Escaneie o QR code com um app autenticador (Google Authenticator, Authy...) e digite o código de 6 dígitos gerado.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <img src={enrolling.qrCode} alt="QR code MFA" style={{ width: 180, height: 180, background: '#fff', borderRadius: 8, padding: 8 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', textAlign: 'center', marginBottom: 16, wordBreak: 'break-all' }}>
              Não consegue ler o QR? Chave manual: {enrolling.secret}
            </div>
            <input
              className="r-input" value={code} onChange={e => setCode(e.target.value)}
              placeholder="Código de 6 dígitos" inputMode="numeric" maxLength={6}
              autoFocus required style={{ textAlign: 'center', letterSpacing: '0.3em', marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={cancelEnroll} className="btn-ghost" style={{ flex: 1, fontSize: 12 }}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={busy || code.length < 6} style={{ flex: 1, fontSize: 12 }}>
                {busy ? 'Verificando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        ) : hasMfa ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 13, color: 'var(--rasta-green)' }}>
              <span style={{ fontSize: 16 }}>✓</span> MFA ativo nesta conta
            </div>
            {factors.map(f => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--line)' }}>
                <span style={{ fontSize: 12.5 }}>{f.friendly_name || 'Autenticador TOTP'}</span>
                <button onClick={() => removeFactor(f.id)} disabled={busy} className="btn-ghost" style={{ fontSize: 11, color: 'var(--rasta-red)' }}>
                  Desativar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-dim)', lineHeight: 1.6, marginBottom: 16 }}>
              Sua conta ainda não tem autenticação em duas etapas (MFA). Ativar reduz muito o risco de acesso indevido caso sua senha vaze.
            </p>
            <button onClick={startEnroll} disabled={busy} className="btn-primary" style={{ width: '100%', fontSize: 12, padding: '11px' }}>
              {busy ? 'Gerando...' : 'Ativar MFA'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
