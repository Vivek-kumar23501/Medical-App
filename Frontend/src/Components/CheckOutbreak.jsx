// ==================== 6. src/components/CheckOutbreak.jsx ====================
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { DISTRICTS, DISEASES, ALERT_LEVEL_COLORS } from '../utils/constants';

const CheckOutbreak = () => {
  const [district, setDistrict] = useState('');
  const [disease, setDisease] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkOutbreak = async () => {
    if (!district || !disease) {
      alert('Please select both district and disease');
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.checkOutbreak(district, disease);
      setResult(data);
    } catch (error) {
      console.error('Error checking outbreak:', error);
    }
    setLoading(false);
  };

  const getAlertColor = (level) => {
    return ALERT_LEVEL_COLORS[level]?.bg || ALERT_LEVEL_COLORS.NORMAL.bg;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Check Outbreak Status</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select District
            </label>
            <select 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose District</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Disease
            </label>
            <select 
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose Disease</option>
              {DISEASES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={checkOutbreak}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold"
        >
          {loading ? 'Checking...' : 'Check Outbreak Status'}
        </button>
      </div>

      {result && result.status === 'success' && result.data && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className={`${getAlertColor(result.data.alertLevel)} text-white rounded-lg p-6 mb-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{result.data.alertLevel} ALERT</h3>
                <p className="text-lg">{district} - {disease}</p>
              </div>
              <AlertTriangle className="w-16 h-16" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Current Cases</p>
              <p className="text-2xl font-bold text-gray-800">{result.data.currentCases}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Average Cases</p>
              <p className="text-2xl font-bold text-gray-800">{result.data.averageCases}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Outbreak Status</p>
              <p className="text-2xl font-bold text-gray-800">
                {result.data.isOutbreak ? 'YES' : 'NO'}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="whitespace-pre-line text-gray-800">{result.data.alertMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutbreak;
