import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { Loader } from '../../components/UI/Loader';
import { ledgerApi } from '../../api/ledger.api';
import { priorityApi } from '../../api/priority.api';
import { useAuthStore } from '../../store/authStore';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const cameFromOnboarding = !!localStorage.getItem('onboarding-last-step');

  useEffect(() => { loadData(); }, []);

  const handleDownloadPdf = async () => {
    setPdfDownloading(true);
    try { await priorityApi.downloadBudgetPdf(); }
    catch (e) { console.error('PDF download failed:', e); }
    finally { setPdfDownloading(false); }
  };

  const loadData = async () => {
    try {
      const [ledgerStats, priorityPlan] = await Promise.all([
        ledgerApi.getStats(),
        priorityApi.getCurrentPlan(),
      ]);
      setStats(ledgerStats);
      setPlan(priorityPlan);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToOnboarding = () => {
    navigate('/onboarding');
  };

  if (loading) return <Layout title="Dashboard" showBack onBack={cameFromOnboarding ? handleBackToOnboarding : undefined}><Loader /></Layout>;

  const usagePct = stats?.totalBorrowed > 0
    ? Math.min((stats.currentRemaining / stats.totalBorrowed) * 100, 100)
    : 0;

  return (
    <Layout title="Dashboard" showBack onBack={cameFromOnboarding ? handleBackToOnboarding : undefined}>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-5 md:p-6 text-white mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Welcome, {user?.name || 'Koyta'}! 🌾</h2>
        <p className="text-green-100 text-sm">Track your advances and stay on budget this season.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Borrowed', value: stats?.totalBorrowed, color: 'text-gray-800' },
          { label: 'Total Repaid',   value: stats?.totalRepaid,   color: 'text-green-600' },
          { label: 'Remaining',      value: stats?.currentRemaining, color: 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>₹{(value || 0).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Progress + plan row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Advance usage */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Advance Usage</h3>
          <ProgressBar
            percentage={usagePct}
            label="Used vs Borrowed"
            color={usagePct > 70 ? 'red' : 'green'}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>₹0</span>
            <span>₹{(stats?.totalBorrowed || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Priority plan */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Priority Plan</h3>
            <div className="flex items-center gap-2">
              {plan && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>}
              {plan && (
                <button
                  onClick={handleDownloadPdf}
                  disabled={pdfDownloading}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg transition disabled:opacity-60 flex items-center gap-1"
                >
                  {pdfDownloading ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : '⬇️'}
                  PDF
                </button>
              )}
            </div>
          </div>
          {plan ? (
            <div className="space-y-2">
              {plan.items?.slice(0, 4).map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.itemName}</span>
                  <span className="font-medium text-gray-800">₹{Number(item.estimatedAmount).toLocaleString()}</span>
                </div>
              ))}
              {plan.items?.length > 4 && (
                <p className="text-xs text-gray-400">+{plan.items.length - 4} more items</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No active priority plan. Complete onboarding to set one up.</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'View Ledger',   icon: '📒', path: '/ledger',  bg: 'bg-green-50 hover:bg-green-100 text-green-800' },
          { label: 'My Profile',    icon: '👤', path: '/profile', bg: 'bg-blue-50 hover:bg-blue-100 text-blue-800' },
          { label: 'Add Entry',     icon: '➕', path: '/ledger',  bg: 'bg-orange-50 hover:bg-orange-100 text-orange-800' },
          { label: 'Season History',icon: '📅', path: '/profile', bg: 'bg-purple-50 hover:bg-purple-100 text-purple-800' },
        ].map(({ label, icon, path, bg }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`${bg} rounded-xl p-4 text-center transition`}
          >
            <span className="text-2xl block mb-1">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </Layout>
  );
};
