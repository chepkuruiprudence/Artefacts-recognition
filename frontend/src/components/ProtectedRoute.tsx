import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  const user = userData ? JSON.parse(userData) : null;

  // If no token or role isn't ADMIN, redirect to login
  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}