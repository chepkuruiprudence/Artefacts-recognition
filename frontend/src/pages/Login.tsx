import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect based on role
        navigate(data.user.role === 'ADMIN' ? '/admin' : '/contribute');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <Navbar />
      
      <div style={contentContainer}>
        <div style={formCard}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#2c2420', margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>Welcome Back</h2>
            <p style={{ color: '#8b6f47', fontSize: '0.9rem', margin: 0 }}>
              Access the Ūgwati wa Gĩkũyũ archive
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={inputGroup}>
              <label style={labelStyle}>Email Address</label>
              <input 
                style={inputStyle} 
                type="email" 
                placeholder="name@example.com" 
                required 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            
            <div style={inputGroup}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  style={inputStyle} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  onChange={e => setPassword(e.target.value)} 
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={eyeIconStyle}
                >
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                   </svg>
                </span>
              </div>
            </div>

            <button 
              style={{
                ...btnStyle,
                backgroundColor: loading ? '#8b6f47' : '#5a4a3a',
                cursor: loading ? 'not-allowed' : 'pointer'
              }} 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color: '#c9a87c', fontWeight: '600', textDecoration: 'none' }}>
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---

const pageWrapper: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  backgroundColor: '#f5f1ed',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
};

const contentContainer: React.CSSProperties = {
  flex: 1, // Takes up remaining space after Navbar
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px'
};

const formCard: React.CSSProperties = {
  background: 'white',
  padding: '2.5rem',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  border: '1px solid #e0d9d1'
};

const inputGroup: React.CSSProperties = {
  marginBottom: '1.2rem'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#5a4a3a',
  marginBottom: '0.5rem'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '8px',
  border: '1px solid #d1c7bc',
  fontSize: '1rem',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const eyeIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  color: '#8b6f47',
  display: 'flex',
  alignItems: 'center'
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  marginTop: '1rem',
  transition: 'all 0.3s ease'
};