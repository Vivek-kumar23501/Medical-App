import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, MapPin, RefreshCw, TrendingUp } from 'lucide-react';
import { apiService } from '../services/api';
import { ALERT_LEVEL_COLORS } from '../utils/constants';
import StatsCard from './StatsCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const [statsData, outbreaksData] = await Promise.all([
        apiService.getStats(),
        apiService.getAllOutbreaks()
      ]);

      console.log('✅ Dashboard loaded successfully');

      setStats(statsData.data);
      setRecentAlerts(outbreaksData.data?.slice(0, 5) || []);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('❌ Dashboard error:', error);
      setError('Failed to load dashboard. Please ensure backend is running on port 8080.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="text-xl text-gray-600">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 text-center mb-3">Connection Error</h3>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Disease Outbreak Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time monitoring and analysis system</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center gap-2 font-semibold shadow-md"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <StatsCard
          title="Total Outbreaks"
          value={stats?.totalOutbreaks || 0}
          icon={Activity}
          color="text-blue-500"
          borderColor="border-blue-500"
        />

        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={AlertTriangle}
          color="text-red-500"
          borderColor="border-red-500"
        />

        <StatsCard
          title="Diseases Tracked"
          value={stats?.byDisease?.length || 0}
          icon={MapPin}
          color="text-green-500"
          borderColor="border-green-500"
        />

      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Alerts</h2>
          <span className="text-sm text-gray-500">
            {recentAlerts.length > 0 ? `Showing ${recentAlerts.length} most recent` : 'No alerts'}
          </span>
        </div>

        {recentAlerts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No Alerts Found</p>
            <p className="text-sm mb-4">Generate mock data or add records to see alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert, idx) => {
              const colors = ALERT_LEVEL_COLORS[alert.alertLevel] || ALERT_LEVEL_COLORS.NORMAL;

              let formattedDate = 'N/A';
              try {
                formattedDate = new Date(alert.reportDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
              } catch (e) {}

              return (
                <div
                  key={alert._id || idx}
                  className={`p-4 rounded-lg border-l-4 ${colors.light} ${colors.border} hover:shadow-md transition cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800">
                          {alert.district} - {alert.disease}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                          {alert.alertLevel}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Cases:</span>
                          <span className="font-bold text-gray-800">
                            {alert.casesCount !== undefined ? alert.casesCount : 'N/A'}
                          </span>
                        </span>

                        <span className="text-gray-400">•</span>

                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Disease & District Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Top Diseases */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top Diseases
          </h3>

          <div className="space-y-2">
            {stats?.byDisease?.slice(0, 3).map((disease, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3">
                <span className="font-medium text-gray-800">{disease._id}</span>
                <span className="font-bold text-blue-600">{disease.totalcases}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Districts */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Top Districts
          </h3>

          <div className="space-y-2">
            {stats?.byDistrict?.slice(0, 3).map((district, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3">
                <span className="font-medium text-gray-800">{district._id}</span>
                <span className="font-bold text-green-600">{district.totalCases}</span>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">No district data available</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
