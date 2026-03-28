import React from 'react';
import Navbar from "../components/Navbar";

export default function Admin() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={pageWrapper}>
      <Navbar />
      <div style={container}>
        <header style={headerStyle}>
          <h1 style={{ color: '#2c2420' }}>Admin Dashboard</h1>
          <p style={{ color: '#8b6f47' }}>Welcome back, Elder {user.name}</p>
        </header>

        <div style={statsGrid}>
          <div style={card}>
            <h3>Pending Classifications</h3>
            <p style={statNumber}>12</p>
          </div>
          <div style={card}>
            <h3>New Contributions</h3>
            <p style={statNumber}>45</p>
          </div>
          <div style={card}>
            <h3>Verified Records</h3>
            <p style={statNumber}>1,204</p>
          </div>
        </div>

        <section style={tableSection}>
          <h2 style={{ color: '#5a4a3a' }}>Recent Submissions</h2>
          <div style={placeholderTable}>
            <p style={{ color: '#999' }}>Loading contribution logs...</p>
          </div>
        </section>
      </div>
    </div>
  );
}

// --- STYLES ---
const pageWrapper = { backgroundColor: '#f5f1ed', minHeight: '100vh' };
const container = { padding: '2rem 4rem' };
const headerStyle = { marginBottom: '2.5rem' };
const statsGrid = { display: 'flex', gap: '2rem', marginBottom: '3rem' };
const statNumber = { fontSize: '2rem', fontWeight: 'bold', color: '#c9a87c', margin: '10px 0 0' };

const card = {
  flex: 1,
  background: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid #e0d9d1'
};

const tableSection = {
  background: 'white',
  padding: '2rem',
  borderRadius: '12px',
  minHeight: '300px',
  border: '1px solid #e0d9d1'
};

const placeholderTable = {
  border: '2px dashed #d1c7bc',
  borderRadius: '8px',
  height: '200px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '1rem'
};