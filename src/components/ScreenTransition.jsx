// components/ScreenTransition.jsx — entrada animada a cada troca de tela.
// Monte com key={screen}: avançar na ordem das abas desliza da direita, voltar da esquerda.
// A animação é CSS (.enter-screen em styles.css): só escrevemos o índice de cada
// seção pra cascata — nenhuma leitura de layout no meio da troca.

import { useLayoutEffect, useRef } from 'react';

export function ScreenTransition({ dir = 1, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll(':scope > * > section, :scope > * > div > section')
      .forEach((sec, i) => sec.style.setProperty('--i', i));
  }, []);

  return <div ref={ref} className="enter-screen" style={{ '--enter-x': `${36 * dir}px` }}>{children}</div>;
}
