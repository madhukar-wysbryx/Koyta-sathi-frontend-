import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { validatePhoneNumber, validateName } from '../../utils/validators';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupVillage, setSignupVillage] = useState('');

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    setError('');
    if (!validatePhoneNumber(loginPhone)) { setError('Enter a valid 10-digit phone number'); return; }
    if (!loginPassword) { setError('Password is required'); return; }
    setLoading(true);
    try {
      const data = await authApi.login(loginPhone, loginPassword);
      setAuth(data.token, data.user);
      navigate(data.user.hasCompletedOnboarding ? '/dashboard' : '/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const handleSignup = async () => {
    setError('');
    if (!validateName(signupName)) { setError('Name must be at least 2 characters'); return; }
    if (!validatePhoneNumber(signupPhone)) { setError('Enter a valid 10-digit phone number'); return; }
    if (signupPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!signupVillage.trim()) { setError('Village is required'); return; }
    setLoading(true);
    try {
      const data = await authApi.signup({ phoneNumber: signupPhone, password: signupPassword, name: signupName, village: signupVillage });
      setAuth(data.token, data.user);
      navigate('/onboarding');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Signup failed. Try again.');
    } finally { setLoading(false); }
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition';

  return (
    <div className="min-h-screen bg-amber-50 flex">
      {/* Left panel — hero (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-700 flex-col p-12">
        {/* Top-left brand */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-bold text-white">Koyta-Sathi</span>
        </div>

        {/* Image */}
        <div className="flex justify-center mb-10">
          <img src="/logo.png" alt="Koyta-Sathi" className="w-64 h-64 object-contain drop-shadow-lg" />
        </div>

        {/* Tagline */}
        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Track your advances.<br />Stay on budget.
          </h2>
          <p className="text-green-200 text-base">
            A simple tool for sugarcane workers to manage advances and plan for the season ahead.
          </p>
          <p className="text-green-300 text-sm mt-4">Harvard Research Initiative · SOPPECOM</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/logo.png" alt="Koyta-Sathi" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-green-700">Koyta-Sathi</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {isLogin ? 'Sign in to your account' : 'Get started with Koyta-Sathi'}
          </p>

          {/* Tab toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >Login</button>
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >Sign Up</button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" placeholder="10-digit number" className={inputClass} value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} maxLength={10} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" placeholder="Your password" className={inputClass} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
              </div>
              <button onClick={handleLogin} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 mt-2">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" placeholder="Your name" className={inputClass} value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                  <input type="text" placeholder="Your village" className={inputClass} value={signupVillage} onChange={(e) => setSignupVillage(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" placeholder="10-digit number" className={inputClass} value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} maxLength={10} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" placeholder="Min 6 characters" className={inputClass} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              </div>
              <button onClick={handleSignup} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 mt-2">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
