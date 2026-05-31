// components/FadeIn.jsx — fade + rise ao entrar no viewport (IntersectionObserver)

import { useRef, useState, useEffect } from 'react';

export function FadeIn({ children, delay = 0, y = 18, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.52s ease ${delay}ms, transform 0.52s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
