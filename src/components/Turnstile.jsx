// components/Turnstile.jsx — widget Cloudflare Turnstile (anti-bot no login admin)

import { useEffect, useRef } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

let scriptPromise = null;
function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve(window.turnstile);
      s.onerror = () => reject(new Error('Falha ao carregar o Turnstile'));
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

// Renderiza o widget e devolve o token via onToken. Passe `resetKey` com um
// valor novo (ex: contador) sempre que quiser forçar o widget a gerar outro token.
export function Turnstile({ onToken, resetKey }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;
    let cancelled = false;

    loadTurnstileScript()
      .then(turnstile => {
        if (cancelled || !containerRef.current || widgetId.current !== null) return;
        widgetId.current = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onToken(token),
          'expired-callback': () => onToken(null),
          'error-callback': () => onToken(null),
        });
      })
      .catch(() => onToken(null));

    return () => {
      cancelled = true;
      if (widgetId.current !== null && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (resetKey === undefined) return;
    if (widgetId.current !== null && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      onToken(null);
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }} />;
}
