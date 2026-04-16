import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import jsPDF from 'jspdf';
import { FaDownload } from "react-icons/fa";

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadReport = () => {
  if (!report) return;

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Artefacts System Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Total Artefacts: ${report.summary.total}`, 20, 40);
  doc.text(`Verified: ${report.summary.verified}`, 20, 50);
  doc.text(`Pending: ${report.summary.pending}`, 20, 60);

  doc.text("Top Contributors:", 20, 80);

  let y = 90;
  report.topContributors.forEach((user: any, index: number) => {
    doc.text(
      `${index + 1}. ${user.name} - ${user._count.artefacts} contributions`,
      20,
      y
    );
    y += 10;
  });

  doc.save("report.pdf");
};

  const handleVerify = async (id: string) => {
    try {
      setVerifyingId(id);

      const token = localStorage.getItem('token');

      await axios.patch(`${API_BASE}/admin/verify/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchData(); // refresh stats + table
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setVerifyingId(null);
    }
  };

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(`${API_BASE}/admin/report`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReport(res.data);
    } catch (err) {
      console.error("Failed to fetch report", err);
    }
  };

  return (
    <div style={pageWrapper}>
      <Navbar />

      <div style={container}>
        <header style={headerStyle}>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Elder {user?.name || "Admin"}</p>
        </header>

        {loading ? (
          <p>Loading Dashboard...</p>
        ) : (
          <>
            {/* 📊 STATS */}
            <div style={statsGrid}>
              <div style={card}>
                <h3>Pending</h3>
                <p style={statNumber}>{data?.stats?.pending || 0}</p>
              </div>
              <div style={card}>
                <h3>Verified</h3>
                <p style={statNumber}>{data?.stats?.verified || 0}</p>
              </div>
              <div style={card}>
                <h3>Total Users</h3>
                <p style={statNumber}>{data?.stats?.users || 0}</p>
              </div>
            </div>

            {/* 📄 REPORT BUTTON */}
            <div style={{ marginBottom: "1.5rem" }}>
              <button style={primaryBtn} onClick={fetchReport}>
                Generate Report
              </button>
            </div>

            {/* 📋 TABLE */}
            <section style={tableSection}>
              <h2>Recent Submissions</h2>

              {data?.recentSubmissions?.length > 0 ? (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contributor</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.recentSubmissions.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.contributor?.name}</td>
                        <td>{item.verificationStatus}</td>
                        <td>
                          {item.verificationStatus === "PENDING" && (
                            <button
                              style={verifyBtn}
                              onClick={() => handleVerify(item.id)}
                              disabled={verifyingId === item.id}
                            >
                              {verifyingId === item.id ? "Verifying..." : "Verify"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No submissions found.</p>
              )}
            </section>

            {/* 📊 REPORT DISPLAY */}
            {report && (
              <section style={reportSection}>
               <button onClick={downloadReport} style={primaryBtn}>
  <FaDownload /> Download Report
</button>
                <h2>System Report</h2>

                <p><strong>Total Artefacts:</strong> {report.summary.total}</p>
                <p><strong>Verified:</strong> {report.summary.verified}</p>
                <p><strong>Pending:</strong> {report.summary.pending}</p>

                <h3>Top Contributors</h3>
                <ul>
                  {report.topContributors.map((u: any) => (
                    <li key={u.id}>
                      {u.name} — {u._count.artefacts} contributions
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const pageWrapper: React.CSSProperties = {
  backgroundColor: '#f5f1ed',
  minHeight: '100vh'
};

const container: React.CSSProperties = {
  padding: '2rem 4rem'
};

const headerStyle: React.CSSProperties = {
  marginBottom: '2.5rem'
};

const statsGrid: React.CSSProperties = {
  display: 'flex',
  gap: '2rem',
  marginBottom: '3rem'
};

const statNumber: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#c9a87c',
  margin: '10px 0 0'
};

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
  border: '1px solid #e0d9d1'
};

const reportSection: React.CSSProperties = {
  marginTop: '2rem',
  background: 'white',
  padding: '2rem',
  borderRadius: '12px',
  border: '1px solid #e0d9d1'
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse'
};

const primaryBtn: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: '#5a4a3a',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const verifyBtn: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#c9a87c',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};