import React from 'react';
import { Button } from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user.api';

interface ReadyToTrackProps {
  onComplete: () => void;
}

export const ReadyToTrack: React.FC<ReadyToTrackProps> = ({ onComplete }) => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleComplete = async () => {
    setLoading(true);
    try {
      await userApi.completeOnboarding();
      onComplete();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container-custom text-center">
        <span className="text-6xl mb-4 block">✅</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to Track!</h2>
        
        <div className="bg-white rounded-xl p-6 mb-6 text-left">
          <p className="text-gray-700 leading-relaxed">
            Now that you have planned your advance for the season, learned a little 
            about budgeting and prioritizing, let's move to the tracking stage to 
            track your advances from the mukaddam for the season.
          </p>
        </div>

        <div className="bg-green-100 rounded-xl p-4 mb-8">
          <p className="text-green-800 font-medium">What you can do now:</p>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>✓ Track daily advances from mukaddam</li>
            <li>✓ Log repayments when you return money</li>
            <li>✓ See your remaining balance instantly</li>
            <li>✓ Get AI-powered budget advice</li>
          </ul>
        </div>

        <Button onClick={handleComplete} loading={loading} fullWidth size="lg">
          Go to Ledger →
        </Button>
      </div>
    </div>
  );
};