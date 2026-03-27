import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setNewName(parsedUser.name);
    } else {
      navigate('/login'); // Redirect if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });

      const data = await res.json();

      if (res.ok) {
        // Update local storage and state
        const updatedUser = { ...user!, name: newName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Update failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Server error', type: 'error' });
    }
  };

  if (!user) return <div style={containerStyle}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={avatarStyle}>{user.name.charAt(0).toUpperCase()}</div>
          <h2 style={{ color: '#5a4a3a', margin: '10px 0' }}>User Profile</h2>
          <span style={roleBadgeStyle}>{user.role}</span>
        </div>

        {message.text && (
          <p style={{ 
            color: message.type === 'success' ? 'green' : 'red', 
            textAlign: 'center',
            fontSize: '0.9rem' 
          }}>
            {message.text}
          </p>
        )}

        <div style={infoContainerStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email Address</label>
            <p style={dataStyle}>{user.email}</p>
          </div>

          <form onSubmit={handleUpdate}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Full Name</label>
              {isEditing ? (
                <input 
                  style={inputStyle} 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                />
              ) : (
                <p style={dataStyle}>{user.name}</p>
              )}
            </div>

            <div style={buttonGroupStyle}>
              {isEditing ? (
                <>
                  <button type="submit" style={saveBtnStyle}>Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} style={cancelBtnStyle}>Cancel</button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} style={editBtnStyle}>Edit Profile</button>
              )}
            </div>
          </form>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

        <button onClick={handleLogout} style={logoutBtnStyle}>
          Logout
        </button>
      </div>
    </div>
  );
}

// --- STYLES ---

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '40px 20px',
  minHeight: '80vh',
  backgroundColor: '#f5f1ed'
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  width: '100%',
  maxWidth: '500px',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  border: '1px solid #e0d9d1'
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '30px'
};

const avatarStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  backgroundColor: '#c9a87c',
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 auto'
};

const roleBadgeStyle: React.CSSProperties = {
  backgroundColor: '#f5f1ed',
  color: '#8b6f47',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  textTransform: 'uppercase'
};

const infoContainerStyle: React.CSSProperties = {
  marginTop: '20px'
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '20px'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  color: '#999',
  marginBottom: '5px',
  textTransform: 'uppercase'
};

const dataStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#333',
  margin: 0,
  fontWeight: '500'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #c9a87c',
  fontSize: '1rem'
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  marginTop: '10px'
};

const editBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#c9a87c',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const saveBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#5a4a3a',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#eee',
  color: '#666',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const logoutBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  backgroundColor: 'transparent',
  color: '#d9534f',
  border: '1px solid #d9534f',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s'
};