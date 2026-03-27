import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if passwords match
  const passwordsMatch = formData.password === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) setMsg("Check your email for a verification link!");
      else setMsg(data.message || "Registration failed.");
    } catch (error) {
      setMsg("Connection error.");
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
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={formStyle}>
        <h2 style={{ color: '#5a4a3a', textAlign: 'center' }}>Create Account</h2>
        {msg && <p style={{ color: msg.includes('Check') ? 'green' : 'red', textAlign: 'center' }}>{msg}</p>}

        <input style={inputStyle} placeholder="Full Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
        <input style={inputStyle} type="email" placeholder="Email Address" required onChange={e => setFormData({ ...formData, email: e.target.value })} />

        {/* Password Field with Eye */}
        <div style={{ position: 'relative' }}>
          <input
            style={inputStyle}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          <span 
            onClick={() => setShowPassword(!showPassword)} 
            style={{ position: 'absolute', right: '10px', top: '22px', cursor: 'pointer', color: '#8b6f47' }}
          >
            <EyeIcon />
          </span>
        </div>

        {/* Confirm Password Field */}
        <input
          style={{ ...inputStyle, borderColor: showMatchError ? '#ff4d4d' : '#d1c7bc' }}
          type="password"
          placeholder="Confirm Password"
          required
          onChange={e => setConfirmPassword(e.target.value)}
        />
        {showMatchError && <p style={{ color: '#ff4d4d', fontSize: '12px', margin: '-5px 0 10px' }}>Passwords do not match</p>}

        <button style={{ ...btnStyle, opacity: !passwordsMatch ? 0.6 : 1 }} type="submit" disabled={loading || !passwordsMatch}>
          {loading ? "Sending..." : "Register"}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#c9a87c', cursor: 'pointer' }}>Login</span>
        </p>
      </form>
    </div>
  );
}

// --- STYLES ---

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f1ed', // Light earth tone
  padding: '20px'
};

const formStyle: React.CSSProperties = {
  background: 'white',
  padding: '2.5rem',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e0d9d1'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  borderRadius: '6px',
  border: '1px solid #d1c7bc',
  boxSizing: 'border-box',
  fontSize: '16px'
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#5a4a3a', // Dark wood color
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '15px',
  transition: 'background 0.3s ease'
};