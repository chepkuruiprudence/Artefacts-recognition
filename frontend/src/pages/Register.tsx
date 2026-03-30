import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Check if passwords match
  const passwordsMatch = formData.password === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setLoading(true);
    setMsg({ text: '', type: '' });
    
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: "Check your email for a verification link!", type: 'success' });
      } else {
        setMsg({ text: data.message || "Registration failed.", type: 'error' });
      }
    } catch (error) {
      setMsg({ text: "Connection error. Please try again later.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div style={pageWrapper}>
      <Navbar />
      
      <div style={contentContainer}>
        <div style={formCard}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#2c2420', margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>Create Account</h2>
            <p style={{ color: '#8b6f47', fontSize: '0.9rem', margin: 0 }}>Join the Ūgwati wa Gĩkũyũ community</p>
          </div>

          {msg.text && (
            <div style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              backgroundColor: msg.type === 'success' ? '#e6f4ea' : '#fce8e6',
              color: msg.type === 'success' ? '#1e7e34' : '#d93025',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: '1rem',
              border: `1px solid ${msg.type === 'success' ? '#b7e1cd' : '#f5c2c7'}`
            }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={inputGroup}>
              <label style={labelStyle}>Full Name</label>
              <input 
                style={inputStyle} 
                placeholder="John Doe" 
                required 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Email Address</label>
              <input 
                style={inputStyle} 
                type="email" 
                placeholder="name@example.com" 
                required 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
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
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={eyeIconStyle}
                >
                  <EyeIcon />
                </span>
              </div>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                style={{ 
                  ...inputStyle, 
                  borderColor: showMatchError ? '#d93025' : '#d1c7bc',
                  backgroundColor: showMatchError ? '#fff8f7' : 'white'
                }}
                type="password"
                placeholder="••••••••"
                required
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {showMatchError && (
                <p style={{ color: '#d93025', fontSize: '0.75rem', marginTop: '4px', fontWeight: '500' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            <button 
              style={{ 
                ...btnStyle, 
                backgroundColor: (loading || !passwordsMatch) ? '#a09284' : '#5a4a3a',
                cursor: (loading || !passwordsMatch) ? 'not-allowed' : 'pointer'
              }} 
              type="submit" 
              disabled={loading || !passwordsMatch}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Already have an account?{' '}
                <span 
                  onClick={() => navigate('/login')} 
                  style={{ color: '#c9a87c', fontWeight: '600', cursor: 'pointer' }}
                >
                  Login
                </span>
              </p>
            </div>
          </form>
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
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 20px'
};

const formCard: React.CSSProperties = {
  background: 'white',
  padding: '2.5rem',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '450px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  border: '1px solid #e0d9d1'
};

const inputGroup: React.CSSProperties = {
  marginBottom: '1rem'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#5a4a3a',
  marginBottom: '0.4rem'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #d1c7bc',
  boxSizing: 'border-box',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.2s'
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
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
  marginTop: '10px',
  transition: 'background 0.3s ease'
};