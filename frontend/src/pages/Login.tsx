import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/contribute');
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={{ color: '#5a4a3a', textAlign: 'center' }}>Welcome Back</h2>
        <input style={inputStyle} type="email" placeholder="Email" required onChange={e => setEmail(e.target.value)} />
        
        <div style={{ position: 'relative' }}>
          <input 
            style={inputStyle} 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            required 
            onChange={e => setPassword(e.target.value)} 
          />
          <span 
            onClick={() => setShowPassword(!showPassword)} 
            style={{ position: 'absolute', right: '10px', top: '22px', cursor: 'pointer', color: '#8b6f47' }}
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
             </svg>
          </span>
        </div>

        <button style={btnStyle} type="submit">Login</button>
      </form>
    </div>
  );
}

const containerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f1ed' };
const formStyle: React.CSSProperties = { background: 'white', padding: '2rem', borderRadius: '12px', width: '350px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#5a4a3a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };