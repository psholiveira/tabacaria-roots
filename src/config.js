// config.js — constantes e configurações centralizadas

export const BREAKPOINT_MOBILE = 768;
export const WHATSAPP_COLOR = '#25D366';

// Horários por dia da semana (0=Dom, 1=Seg...6=Sab), em minutos desde meia-noite
const HOURS_BY_DAY = [
  { open: 14 * 60, close: 22 * 60 }, // Dom
  { open: 10 * 60, close: 22 * 60 }, // Seg
  { open: 10 * 60, close: 22 * 60 }, // Ter
  { open: 10 * 60, close: 22 * 60 }, // Qua
  { open: 10 * 60, close: 22 * 60 }, // Qui
  { open: 10 * 60, close: 24 * 60 }, // Sex
  { open: 10 * 60, close: 24 * 60 }, // Sab
];

export function isStoreOpen() {
  const now = new Date();
  const { open, close } = HOURS_BY_DAY[now.getDay()];
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= open && mins < close;
}
