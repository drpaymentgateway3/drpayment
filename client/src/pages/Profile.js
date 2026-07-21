import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Profile({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/merchants/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">👤 Profile</h1>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : profile ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Username</p>
                    <p className="font-semibold">{user?.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Role</p>
                    <p className="font-semibold capitalize">{user?.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">KYC Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      user?.kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                      user?.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user?.kycStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold mb-4">Business Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Business Name</p>
                    <p className="font-semibold">{profile?.business_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Business Type</p>
                    <p className="font-semibold">{profile?.business_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Website</p>
                    <p className="font-semibold">{profile?.website || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Account Status</p>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      {profile?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">API Credentials</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">API Key</p>
                    <code className="font-mono text-sm break-all">pk_live_****</code>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Transactions</p>
                    <p className="font-semibold">Rp {profile?.total_transactions?.toLocaleString('id-ID') || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Commission</p>
                    <p className="font-semibold">Rp {profile?.total_commission?.toLocaleString('id-ID') || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-600">No profile data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
