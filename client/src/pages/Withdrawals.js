import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Withdrawals({ user, onLogout }) {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: 'Rendi Aryandi'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/withdrawals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdrawals(response.data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/withdrawals/request', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ amount: '', bankName: '', accountNumber: '', accountName: 'Rendi Aryandi' });
      setShowForm(false);
      fetchWithdrawals();
      alert('Withdrawal request submitted!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error submitting withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">💰 Withdrawals</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? 'Cancel' : 'Request Withdrawal'}
            </button>
          </div>

          {showForm && (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">New Withdrawal Request</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Amount (Rp)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input-field"
                      placeholder="Min. 100,000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bank Name</label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Select Bank</option>
                      <option value="BCA">BCA</option>
                      <option value="Mandiri">Mandiri</option>
                      <option value="BRI">BRI</option>
                      <option value="CIMB">CIMB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Account Number</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="input-field"
                      placeholder="2100099171"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Account Name</label>
                    <input
                      type="text"
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : withdrawals.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600">No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Bank</th>
                    <th className="px-6 py-3 text-left">Account</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold">Rp {w.amount?.toLocaleString('id-ID') || 0}</td>
                      <td className="px-6 py-3">{w.bank_name}</td>
                      <td className="px-6 py-3">{w.account_number}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          w.status === 'completed' ? 'bg-green-100 text-green-800' :
                          w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {w.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">{new Date(w.created_at).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Withdrawals;
