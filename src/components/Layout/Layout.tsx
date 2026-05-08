import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/ledger',    label: 'Ledger',    icon: '📒' },
  { path: '/profile',  label: 'Profile',   icon: '👤' },
];

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, showBack = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-amber-50 flex">
      {/* ── Sidebar (desktop only) ── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-amber-100 fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-amber-100">
          <span className="text-2xl">🌾</span>
          <span className="text-lg font-bold text-green-700">Koyta-Sathi</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-amber-50 text-green-700'
                  : 'text-gray-600 hover:bg-amber-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-amber-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.phoneNumber}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-500 hover:text-red-700 px-1 py-1 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen bg-amber-50">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-amber-100 px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-green-700 transition-colors group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium hidden sm:inline">Back</span>
              </button>
            )}
            {showBack && <div className="w-px h-4 bg-gray-200" />}
            <h1 className="text-base md:text-lg font-semibold text-gray-800">
              {title || navItems.find(n => n.path === location.pathname)?.label || 'Koyta-Sathi'}
            </h1>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-20 md:pb-8 px-4 md:px-8 py-4 md:py-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 z-30 flex">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
              location.pathname === item.path
                ? 'text-green-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
