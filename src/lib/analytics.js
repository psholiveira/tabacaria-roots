// Carrega Plausible Analytics apenas se VITE_PLAUSIBLE_DOMAIN estiver definido
export function initAnalytics() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (!domain) return;

  const s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = domain;
  s.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(s);
}
