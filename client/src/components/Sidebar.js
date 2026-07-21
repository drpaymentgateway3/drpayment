import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">💳 DrPayment</h1>
        <p className="text-sm text-gray-300">Payment Gateway</p>
      </div>

      <nav className="mb-8">
        {user?.role === 'admin' && (
          <>
            <Link to="/admin-monitoring" className={`nav-link ${isActive('/admin-monitoring')}`}>
              🔐 Admin Monitor
            </Link>
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
              ⚙️ Admin Panel
            </Link>
            <hr className="my-4 border-gray-400" />
          </>
        )}
        
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
          📊 Dashboard
        </Link>
        <Link to="/transactions" className={`nav-link ${isActive('/transactions')}`}>
          💳 Transactions
        </Link>
        <Link to="/withdrawals" className={`nav-link ${isActive('/withdrawals')}`}>
          💰 Withdrawals
        </Link>
        <Link to="/kyc" className={`nav-link ${isActive('/kyc')}`}>
          ✅ KYC
        </Link>
        <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
          👤 Profile
        </Link>
      </nav>

      <div className="border-t border-gray-400 pt-4">
        <div className="text-sm mb-4">
          <p className="text-gray-300">Logged in as:</p>
          <p className="font-semibold text-white">{user?.username}</p>
          <p className="text-xs text-gray-400 capitalize">🎯 {user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
