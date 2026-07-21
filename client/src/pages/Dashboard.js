import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Welcome, {user?.username}! 👋</h1>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card">
                <div className="stat-label">Total Transactions</div>
                <div className="stat-value text-blue-600">
                  Rp {stats?.total_transactions?.toLocaleString('id-ID') || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Transaction Count</div>
                <div className="stat-value text-green-600">
                  {stats?.transaction_count || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Commission</div>
                <div className="stat-value text-purple-600">
                  Rp {stats?.total_commission?.toLocaleString('id-ID') || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Current Balance</div>
                <div className="stat-value text-orange-600">
                  Rp {stats?.current_balance?.toLocaleString('id-ID') || 0}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">📊 Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Revenue:</span>
                  <span className="font-bold">Rp {stats?.total_transactions?.toLocaleString('id-ID') || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Commission Earned:</span>
                  <span className="font-bold">Rp {stats?.total_commission?.toLocaleString('id-ID') || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Transactions:</span>
                  <span className="font-bold">{stats?.transaction_count || 0}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">🎯 Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/transactions')}
                  className="w-full btn btn-primary"
                >
                  View Transactions
                </button>
                <button
                  onClick={() => navigate('/withdrawals')}
                  className="w-full btn btn-secondary"
                >
                  Request Withdrawal
                </button>
                <button
                  onClick={() => navigate('/kyc')}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Complete KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
