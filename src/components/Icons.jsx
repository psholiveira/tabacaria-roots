// components/Icons.jsx — ícones SVG inline

export const Icon = {
  search: (p={}) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  bag: (p={}) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
    </svg>
  ),
  cart: (p={}) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>
      <path d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h7a2 2 0 0 0 2-1.5L20.5 8H6"/>
    </svg>
  ),
  arrow: (p={}) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
    </svg>
  ),
  back: (p={}) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>
    </svg>
  ),
  star: (p={}) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 6.9L12 17.8 5.7 21l1.2-6.9-5-4.9 7-1L12 2z"/>
    </svg>
  ),
  whatsapp: (p={}) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1.1 2.8 1.2 3 .2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.6.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4ZM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2Z"/>
    </svg>
  ),
  filter: (p={}) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/>
    </svg>
  ),
  trash: (p={}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/>
      <path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    </svg>
  ),
  plus: (p={}) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"  {...p}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  minus: (p={}) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
      <path d="M5 12h14"/>
    </svg>
  ),
  close: (p={}) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"  {...p}>
      <path d="M6 6l12 12M18 6 6 18"/>
    </svg>
  ),
  pin: (p={}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>
    </svg>
  ),
  clock: (p={}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  insta: (p={}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>
    </svg>
  ),
  phone: (p={}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L7.9 9.6a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5 13 13 0 0 0 2.5.6 2 2 0 0 1 1.7 2Z"/>
    </svg>
  ),
};
