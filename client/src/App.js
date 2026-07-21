import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Withdrawals from './pages/Withdrawals';
import KYC from './pages/KYC';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AdminMonitoring from './pages/AdminMonitoring';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">🚀 DrPayment Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/transactions" element={user ? <Transactions user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/withdrawals" element={user ? <Withdrawals user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/kyc" element={user ? <KYC user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/admin-monitoring" element={user?.role === 'admin' ? <AdminMonitoring user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin-monitoring' : '/dashboard'} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
