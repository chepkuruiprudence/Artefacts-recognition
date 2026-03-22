export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 4rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <a 
        href="/" 
        style={{
          fontSize: '1.3rem',
          fontWeight: '600',
          color: '#2c2420',
          textDecoration: 'none',
          letterSpacing: '0.3px',
          transition: 'color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#c9a87c'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#2c2420'}
      >
        Ūgwati wa Gĩkũyũ
      </a>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '3rem',
        margin: 0,
        padding: 0,
        alignItems: 'center'
      }}>
        <li>
          <a 
            href="/classify" 
            style={{
              color: '#5a4a3a',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              padding: '0.5rem 0',
              borderBottom: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#c9a87c';
              e.currentTarget.style.borderBottomColor = '#c9a87c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#5a4a3a';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
          >
            Classify
          </a>
        </li>
        <li>
          <a 
            href="/heritage" 
            style={{
              color: '#5a4a3a',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              padding: '0.5rem 0',
              borderBottom: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#c9a87c';
              e.currentTarget.style.borderBottomColor = '#c9a87c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#5a4a3a';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
          >
            Heritage
          </a>
        </li>
        <li>
          <a 
            href="/about" 
            style={{
              color: '#5a4a3a',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              padding: '0.5rem 0',
              borderBottom: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#c9a87c';
              e.currentTarget.style.borderBottomColor = '#c9a87c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#5a4a3a';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
          >
            About
          </a>
        </li>
<li>
  <a 
    href="/contact"
    style={{
      backgroundColor: '#c9a87c',
      color: '#ffffff',
      padding: '0.7rem 1.8rem',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#d4b890';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#c9a87c';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    Contact Us
  </a>
</li>
        </ul>
    </nav>
  );
}