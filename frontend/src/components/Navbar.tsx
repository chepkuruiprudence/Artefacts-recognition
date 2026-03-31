import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu and sync auth on route change
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setIsMenuOpen(false); 
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  );

  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  );

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <a href="/" className="logo">Ūgwati wa Gĩkũyũ</a>

        {/* Hamburger Toggle */}
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="/classify">Classify</a></li>
          <li><a href="/contribute">Contribute</a></li>
          <li><a href="/heritage">Heritage</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact" className="contact-btn">Contact Us</a></li>

          {isLoggedIn ? (
            <div className="auth-section">
              <a href="/profile" className="icon-link" title="Profile"><UserIcon /><span>Profile</span></a>
              <button onClick={handleLogout} className="icon-link" title="Logout"><LogoutIcon /><span>Logout</span></button>
            </div>
          ) : (
            <li><a href="/login" className="login-link">Login</a></li>
          )}
        </ul>
      </div>

      <style>{`
        .navbar {
          background: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 0.8rem 1.5rem;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        .logo {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c2420;
          text-decoration: none;
        }
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #5a4a3a;
        }
        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
          align-items: center;
          margin: 0;
        }
        .nav-links a {
          text-decoration: none;
          color: #5a4a3a;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .contact-btn {
          background: #c9a87c;
          color: #fff !important;
          padding: 0.5rem 1rem;
          border-radius: 6px;
        }
        .auth-section {
          display: flex;
          gap: 1rem;
          border-left: 1px solid #eee;
          padding-left: 1rem;
        }
        .icon-link {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          color: #5a4a3a;
        }
        .icon-link span { display: none; } /* Hide text on desktop */

        /* MOBILE STYLES */
        @media (max-width: 768px) {
          .menu-toggle { display: block; }
          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: #fff;
            flex-direction: column;
            gap: 0;
            display: none; /* Hidden by default */
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .nav-links.active { display: flex; }
          .nav-links li {
            width: 100%;
            border-bottom: 1px solid #f9f9f9;
          }
          .nav-links a {
            display: block;
            padding: 1.2rem;
            width: 100%;
          }
          .auth-section {
            width: 100%;
            border-left: none;
            padding: 1.2rem;
            flex-direction: row;
            justify-content: space-around;
            background: #fafafa;
          }
          .icon-link span { display: inline; font-size: 0.9rem; }
          .contact-btn { border-radius: 0; text-align: center; }
        }
      `}</style>
    </nav>
  );
}