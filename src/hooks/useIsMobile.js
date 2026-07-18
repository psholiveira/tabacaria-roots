// hooks/useIsMobile.js — detecta viewport mobile por largura de tela

import { useState, useEffect } from 'react';
import { BREAKPOINT_MOBILE } from '../config.js';

export function useIsMobile(breakpoint = BREAKPOINT_MOBILE) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}
