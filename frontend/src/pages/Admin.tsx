import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={pageWrapper}>
      <Navbar />
      <div style={container}>
        <header style={headerStyle}>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Elder {user.name}</p>
        </header>

        {loading ? (
          <p>Loading Dashboard...</p>
        ) : (
          <>
            <div style={statsGrid}>
              <div style={card}>
                <h3>Pending</h3>
                <p style={statNumber}>{data?.stats.pending}</p>
              </div>
              <div style={card}>
                <h3>Verified</h3>
                <p style={statNumber}>{data?.stats.verified}</p>
              </div>
              <div style={card}>
                <h3>Total Users</h3>
                <p style={statNumber}>{data?.stats.users}</p>
              </div>
            </div>

            <section style={tableSection}>
              <h2>Recent Submissions</h2>
              {data?.recentSubmissions.length > 0 ? (
                <table>
                   {/* Map through data.recentSubmissions here */}
                </table>
              ) : (
                <p>No submissions found.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

const pageWrapper: React.CSSProperties = { backgroundColor: '#f5f1ed', minHeight: '100vh' };
const container: React.CSSProperties = { padding: '2rem 4rem' };
const headerStyle: React.CSSProperties = { marginBottom: '2.5rem' };
const statsGrid: React.CSSProperties = { display: 'flex', gap: '2rem', marginBottom: '3rem' };
const statNumber: React.CSSProperties = { fontSize: '2rem', fontWeight: 'bold', color: '#c9a87c', margin: '10px 0 0' };
const card: React.CSSProperties = {
  flex: 1,
  background: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid #e0d9d1'
};
const tableSection: React.CSSProperties = {
  background: 'white',
  padding: '2rem',
  borderRadius: '12px',
  minHeight: '300px',
  border: '1px solid #e0d9d1'
};