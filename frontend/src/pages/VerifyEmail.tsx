import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying your heritage access...');
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      try {
        // We manually call the BACKEND API here
        const API_BASE = import.meta.env.VITE_API_URL; // e.g., http://localhost:5000/api
        const res = await fetch(`${API_BASE}/auth/verify?token=${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus('Account verified! Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setStatus(data.message || 'Verification failed.');
        }
      } catch (err) {
        setStatus('Server error. Please try again later.');
      }
    };

    if (token) verify();
  }, [token, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'serif' }}>
      <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#5a4a3a' }}>Ūgwati wa Gĩkũyũ</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}