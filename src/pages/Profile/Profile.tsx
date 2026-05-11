import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Input } from '../../components/UI/Input';
import { Button } from '../../components/UI/Button';
import { Loader } from '../../components/UI/Loader';
import { userApi } from '../../api/user.api';
import { useAuthStore } from '../../store/authStore';

export const Profile: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [village, setVillage]     = useState('');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setVillage(data.village || '');
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) return;
    setSaving(true);
    try {
      await userApi.updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), village });
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      updateUser({ firstName: firstName.trim(), lastName: lastName.trim(), name: fullName, village });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <Layout title="Profile" showBack><Loader /></Layout>;

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <Layout title="Profile" showBack>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: avatar card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl font-bold text-green-700 mx-auto mb-3">
              {firstName ? firstName[0].toUpperCase() : '?'}
            </div>
            <p className="font-semibold text-gray-800 text-lg">{fullName || '—'}</p>
            <p className="text-sm text-gray-400 mt-0.5">{user?.phoneNumber}</p>
            {village && <p className="text-sm text-gray-500 mt-1">📍 {village}</p>}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Onboarding: {user?.hasCompletedOnboarding ? '✅ Complete' : '⏳ Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: edit form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-6">Edit Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <Input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-10 text-sm px-3 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-10 text-sm px-3 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div className="space-y-1 mb-6 max-w-sm">
              <label className="block text-sm font-medium text-gray-700">Village</label>
              <Input
                placeholder="Your village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="h-10 text-sm px-3 rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg mb-4 max-w-sm">
                ✅ Profile saved successfully
              </div>
            )}
            <Button onClick={handleSave} loading={saving}>Save Changes</Button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-1">Account</h3>
            <p className="text-sm text-gray-400 mb-4">Manage your account settings</p>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition"
            >
              Sign out of Koyta-Sathi
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
