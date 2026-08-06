// hooks/useIdleLogout.js — desloga automaticamente após período de inatividade

import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

export function useIdleLogout(minutes = 20) {
  const timerRef = useRef(null);

  useEffect(() => {
    const timeoutMs = minutes * 60 * 1000;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        supabase.auth.signOut();
      }, timeoutMs);
    };

    ACTIVITY_EVENTS.forEach(ev => window.addEventListener(ev, reset, { passive: true }));
    reset();

    return () => {
      ACTIVITY_EVENTS.forEach(ev => window.removeEventListener(ev, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [minutes]);
}
