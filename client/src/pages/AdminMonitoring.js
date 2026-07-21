import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminMonitoring.css';

function AdminMonitoring({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [newUsers, setNewUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dailyReport, setDailyReport] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000); // Refresh setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, newUsersRes, withdrawalsRes, notificationsRes, reportRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/statistics`, { headers }),
        axios.get(`${API_BASE}/monitoring/user-activity`, { headers }),
        axios.get(`${API_BASE}/monitoring/new-users-today`, { headers }),
        axios.get(`${API_BASE}/admin/withdrawals`, { headers }),
        axios.get(`${API_BASE}/monitoring/notifications`, { headers }),
        axios.get(`${API_BASE}/monitoring/daily-report`, { headers })
      ]);

      setStats(statsRes.data);
      setAllUsers(usersRes.data);
      setNewUsers(newUsersRes.data.users || []);
      setWithdrawals(withdrawalsRes.data);
      setNotifications(notificationsRes.data);
      setDailyReport(reportRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">⏳ Loading data...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">🔐 Admin Dashboard - Monitoring</h1>
            <p className="text-gray-600">Pantau semua aktivitas pengguna dan transaksi real-time</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              👥 Users ({allUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('new-users')}
              className={`px-6 py-2 rounded-lg font-semibold transition relative ${
                activeTab === 'new-users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🆕 New Users ({newUsers.length})
              {newUsers.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">{newUsers.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'withdrawals' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              💰 Withdrawals
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-2 rounded-lg font-semibold transition relative ${
                activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🔔 Notifications
              {notifications.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">{notifications.length}</span>}
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="card">
                  <div className="stat-label">👥 Total Users</div>
                  <div className="stat-value text-blue-600">{stats?.total_users || 0}</div>
                  <p className="text-sm text-gray-600 mt-2">Registered accounts</p>
                </div>
                <div className="card">
                  <div className="stat-label">🏪 Total Merchants</div>
                  <div className="stat-value text-green-600">{stats?.total_merchants || 0}</div>
                  <p className="text-sm text-gray-600 mt-2">Active merchants</p>
                </div>
                <div className="card">
                  <div className="stat-label">🆕 New Users Today</div>
                  <div className="stat-value text-purple-600">{stats?.new_users_today || 0}</div>
                  <p className="text-sm text-gray-600 mt-2">Registered today</p>
                </div>
                <div className="card">
                  <div className="stat-label">💳 Total Transactions</div>
                  <div className="stat-value text-orange-600">{stats?.total_transactions || 0}</div>
                  <p className="text-sm text-gray-600 mt-2">All time</p>
                </div>
                <div className="card">
                  <div className="stat-label">💰 Total Revenue</div>
                  <div className="stat-value text-red-600">Rp {stats?.total_revenue?.toLocaleString('id-ID') || 0}</div>
                  <p className="text-sm text-gray-600 mt-2">From successful payments</p>
                </div>
                <div className="card">
                  <div className="stat-label">⏳ Pending Withdrawals</div>
                  <div className="stat-value text-yellow-600">{stats?.pending_withdrawals || 0}</div>
                  <p className="text-sm text-gray-600 mt-2">Awaiting approval</p>
                </div>
              </div>

              {/* Daily Report */}
              {dailyReport && (
                <div className="card mb-8">
                  <h2 className="text-xl font-bold mb-4">📅 Daily Report - {new Date().toLocaleDateString('id-ID')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">New Users</p>
                      <p className="text-2xl font-bold text-blue-600">{dailyReport.new_users}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Transactions</p>
                      <p className="text-2xl font-bold text-green-600">{dailyReport.transactions_today}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Revenue</p>
                      <p className="text-2xl font-bold text-purple-600">Rp {dailyReport.revenue_today?.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Withdrawals</p>
                      <p className="text-2xl font-bold text-orange-600">{dailyReport.withdrawal_requests_today}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">👥 All Users ({allUsers.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">Username</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Transactions</th>
                      <th className="px-4 py-3 text-left">Volume</th>
                      <th className="px-4 py-3 text-left">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.slice(0, 50).map((u) => (
                      <tr key={u.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{u.username}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">{u.transaction_count}</td>
                        <td className="px-4 py-3">Rp {u.total_volume?.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3 text-xs">{new Date(u.registration_date).toLocaleDateString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* New Users Tab */}
          {activeTab === 'new-users' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">🆕 New Users Today ({newUsers.length})</h2>
              {newUsers.length === 0 ? (
                <p className="text-gray-600">No new users today</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left">Username</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Full Name</th>
                        <th className="px-4 py-3 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newUsers.map((u) => (
                        <tr key={u.id} className="border-t hover:bg-green-50">
                          <td className="px-4 py-3 font-semibold">{u.username}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3">{u.full_name}</td>
                          <td className="px-4 py-3 text-xs">{new Date(u.created_at).toLocaleTimeString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Withdrawals Tab */}
          {activeTab === 'withdrawals' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">💰 Withdrawal Requests</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">Username</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Bank</th>
                      <th className="px-4 py-3 text-left">Account</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{w.username}</td>
                        <td className="px-4 py-3 font-bold">Rp {w.amount?.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3">{w.bank_name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{w.account_number}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            w.status === 'completed' ? 'bg-green-100 text-green-800' :
                            w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {w.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">{new Date(w.created_at).toLocaleDateString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">🔔 Recent Notifications</h2>
              {notifications.length === 0 ? (
                <p className="text-gray-600">No recent notifications</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {n.type === 'new_user' ? '👤' : '💰'} {n.message}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{new Date(n.timestamp).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">🔐 DrPayment Admin</h1>
        <p className="text-sm text-gray-300">System Monitor</p>
      </div>

      <nav className="mb-8">
        <Link to="/admin-monitoring" className="nav-link active">
          📊 Dashboard
        </Link>
        <Link to="/dashboard" className="nav-link">
          🏠 Home
        </Link>
      </nav>

      <div className="border-t border-gray-400 pt-4">
        <div className="text-sm mb-4">
          <p className="text-gray-300">Admin Account:</p>
          <p className="font-semibold text-white">{user?.username}</p>
          <p className="text-xs text-gray-400">🔐 Administrator</p>
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

export default AdminMonitoring;
