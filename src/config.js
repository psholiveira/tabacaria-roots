// config.js — constantes e configurações centralizadas

export const BREAKPOINT_MOBILE = 768;
export const WHATSAPP_COLOR = '#25D366';

// Horários por dia da semana (0=Dom, 1=Seg...6=Sab), em minutos desde meia-noite
// null = fechado o dia todo
const HOURS_BY_DAY = [
  null,                                    // Dom — fechado
  { open: 9 * 60, close: 18 * 60 + 30 }, // Seg
  { open: 9 * 60, close: 18 * 60 + 30 }, // Ter
  { open: 9 * 60, close: 18 * 60 + 30 }, // Qua
  { open: 9 * 60, close: 18 * 60 + 30 }, // Qui
  { open: 9 * 60, close: 18 * 60 + 30 }, // Sex
  { open: 9 * 60, close: 16 * 60 },       // Sab
];

export function isStoreOpen() {
  const now = new Date();
  const h = HOURS_BY_DAY[now.getDay()];
  if (!h) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= h.open && mins < h.close;
}

export function getCloseTimeLabel() {
  const now = new Date();
  const h = HOURS_BY_DAY[now.getDay()];
  if (!h) return null;
  const hh = Math.floor(h.close / 60);
  const mm = h.close % 60;
  return mm === 0 ? `${hh}h` : `${hh}h${String(mm).padStart(2, '0')}`;
}
