import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

function AdminPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">🔒 Admin Panel</h1>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'transactions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card">
                <div className="stat-label">Total Users</div>
                <div className="stat-value text-blue-600">1,234</div>
              </div>
              <div className="card">
                <div className="stat-label">Total Transactions</div>
                <div className="stat-value text-green-600">5,678</div>
              </div>
              <div className="card">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value text-purple-600">Rp 2.5B</div>
              </div>
              <div className="card">
                <div className="stat-label">Pending Withdrawals</div>
                <div className="stat-value text-orange-600">45</div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">User Management</h2>
              <p className="text-gray-600">User management interface would be displayed here</p>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Transaction Management</h2>
              <p className="text-gray-600">Transaction management interface would be displayed here</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">System Settings</h2>
              <p className="text-gray-600">Settings interface would be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
