import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.4s ease',
        background: scrolled
          ? 'rgba(15, 10, 5, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(196, 140, 60, 0.2)' : 'none',
      }}
    >
      {/* Logo / Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Kikuyu pattern icon */}
        <div style={{
          width: 44,
          height: 44,
          position: 'relative',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <polygon points="22,2 42,34 2,34" fill="none" stroke="#C48C3C" strokeWidth="1.5" />
            <polygon points="22,10 36,32 8,32" fill="rgba(196,140,60,0.15)" stroke="#C48C3C" strokeWidth="1" />
            <circle cx="22" cy="22" r="4" fill="#C48C3C" />
            <line x1="22" y1="2" x2="22" y2="42" stroke="rgba(196,140,60,0.3)" strokeWidth="0.5" />
            <line x1="2" y1="34" x2="42" y2="10" stroke="rgba(196,140,60,0.3)" strokeWidth="0.5" />
            <line x1="42" y1="34" x2="2" y2="10" stroke="rgba(196,140,60,0.3)" strokeWidth="0.5" />
          </svg>
        </div>
        <div>
          <div style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#E8D5A3',
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}>
            Ūgwati wa Gĩkũyũ
          </div>
          <div style={{
            fontFamily: '"EB Garamond", Georgia, serif',
            fontSize: '0.65rem',
            color: 'rgba(196,140,60,0.7)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>
            Artefact Intelligence
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {['Classify', 'Heritage', 'About'].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '0.95rem',
              color: 'rgba(232, 213, 163, 0.75)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C48C3C')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232, 213, 163, 0.75)')}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  )
}
