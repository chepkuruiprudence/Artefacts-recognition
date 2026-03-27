import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Listen for route changes
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Sync state with localStorage whenever the URL changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Icon Components
  const UserIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  return (
    <nav style={navBarStyle}>
      {/* Logo */}
      <a 
        href="/" 
        style={logoStyle}
        onMouseEnter={(e) => e.currentTarget.style.color = '#c9a87c'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#2c2420'}
      >
        Ūgwati wa Gĩkũyũ
      </a>

      {/* Navigation Links */}
      <ul style={ulStyle}>
        <li><a href="/classify" style={navLinkStyle}>Classify</a></li>
        <li><a href="/contribute" style={navLinkStyle}>Contribute</a></li>
        <li><a href="/heritage" style={navLinkStyle}>Heritage</a></li>
        <li><a href="/about" style={navLinkStyle}>About</a></li>
        
        <li>
          <a href="/contact" style={contactBtnStyle}>Contact Us</a>
        </li>

        {/* AUTH LOGIC: Strictly switch between Icons or Login Button */}
        {isLoggedIn ? (
          <div style={authWrapperStyle}>
            <a 
              href="/profile" 
              title="Profile"
              style={iconStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = '#c9a87c'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#5a4a3a'}
            >
              <UserIcon />
            </a>
            <button 
              onClick={handleLogout}
              title="Logout"
              style={logoutButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d9534f'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#5a4a3a'}
            >
              <LogoutIcon />
            </button>
          </div>
        ) : (
          <li>
            <a 
              href="/login" 
              style={loginLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#c9a87c';
                e.currentTarget.style.borderColor = '#c9a87c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#5a4a3a';
                e.currentTarget.style.borderColor = '#d1c7bc';
              }}
            >
              Login
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

// --- Styles ---

const navBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.2rem 4rem',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  position: 'sticky',
  top: 0,
  zIndex: 1000
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: '600',
  color: '#2c2420',
  textDecoration: 'none',
  transition: 'color 0.3s ease'
};

const ulStyle: React.CSSProperties = {
  display: 'flex',
  listStyle: 'none',
  gap: '2.5rem',
  margin: 0,
  padding: 0,
  alignItems: 'center'
};

const navLinkStyle: React.CSSProperties = {
  color: '#5a4a3a',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'all 0.3s ease'
};

const contactBtnStyle: React.CSSProperties = {
  backgroundColor: '#c9a87c',
  color: '#ffffff',
  padding: '0.6rem 1.4rem',
  fontSize: '0.9rem',
  fontWeight: '600',
  borderRadius: '8px',
  textDecoration: 'none'
};

const authWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  marginLeft: '0.5rem',
  borderLeft: '1px solid #eee',
  paddingLeft: '1.5rem'
};

const iconStyle: React.CSSProperties = {
  color: '#5a4a3a',
  display: 'flex',
  transition: 'color 0.3s'
};

const logoutButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#5a4a3a',
  display: 'flex',
  padding: 0,
  transition: 'color 0.3s'
};

const loginLinkStyle: React.CSSProperties = {
  color: '#5a4a3a',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: '700',
  padding: '0.5rem 1.2rem',
  borderRadius: '6px',
  border: '1px solid #d1c7bc',
  transition: 'all 0.3s ease'
};