import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function KYC({ user, onLogout }) {
  const [formData, setFormData] = useState({
    idType: 'KTP',
    idNumber: '',
    idDocumentUrl: '',
    selfieUrl: '',
    addressProofUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/kyc/submit', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('KYC submitted successfully!');
      setFormData({
        idType: 'KTP',
        idNumber: '',
        idDocumentUrl: '',
        selfieUrl: '',
        addressProofUrl: ''
      });
    } catch (error) {
      alert(error.response?.data?.error || 'Error submitting KYC');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">✅ Know Your Customer (KYC)</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-bold mb-6">Complete Your KYC Verification</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">ID Type</label>
                    <select
                      value={formData.idType}
                      onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="KTP">KTP (National ID)</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">ID Number</label>
                    <input
                      type="text"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      className="input-field"
                      placeholder="Enter ID number"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">ID Document URL</label>
                    <input
                      type="url"
                      value={formData.idDocumentUrl}
                      onChange={(e) => setFormData({ ...formData, idDocumentUrl: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com/id.jpg"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Selfie with ID URL</label>
                    <input
                      type="url"
                      value={formData.selfieUrl}
                      onChange={(e) => setFormData({ ...formData, selfieUrl: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com/selfie.jpg"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Address Proof URL</label>
                    <input
                      type="url"
                      value={formData.addressProofUrl}
                      onChange={(e) => setFormData({ ...formData, addressProofUrl: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com/address.jpg"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit KYC'}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div className="card">
                <h3 className="font-bold mb-4">📋 Required Documents</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Valid ID Document</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Selfie with ID</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Address Proof</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KYC;
