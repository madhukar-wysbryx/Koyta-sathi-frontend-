import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { userApi } from '../../api/user.api';
import { useAuthStore } from '../../store/authStore';

interface ProfileSetupProps {
  onNext: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuthStore();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await userApi.updateProfile({ name, village });
      updateUser({ name, village });
      onNext();
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container-custom">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step 1 of 5</span>
            <span>Your Profile</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="w-1/5 bg-green-500 h-1 rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
          <p className="text-gray-500 mt-1">Let us know who you are</p>
        </div>

        {/* Form */}
        <div className="max-w-sm mx-auto space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Village (Optional)"
            placeholder="Enter your village name"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
          />
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-700">
              ✅ Phone Number: {user?.phoneNumber}
            </p>
          </div>
          <Button
            className="mt-2"
            onClick={handleSubmit}
            loading={loading}
            disabled={!name.trim()}
            fullWidth
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
};