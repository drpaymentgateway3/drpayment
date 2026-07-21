import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Transactions({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">📊 Transactions</h1>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Transaction ID</th>
                    <th className="px-6 py-3 text-left">Order ID</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-right">Commission</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-mono">{tx.transaction_id?.substring(0, 20)}...</td>
                      <td className="px-6 py-3">{tx.order_id}</td>
                      <td className="px-6 py-3 text-right font-semibold">Rp {tx.amount?.toLocaleString('id-ID') || 0}</td>
                      <td className="px-6 py-3 text-right">Rp {tx.commission?.toLocaleString('id-ID') || 0}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          tx.payment_status === 'success' ? 'bg-green-100 text-green-800' :
                          tx.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.payment_status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
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

export default Transactions;
