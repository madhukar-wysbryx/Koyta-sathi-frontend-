import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user.api';
import { priorityApi } from '../../api/priority.api';

interface ReadyToTrackProps {
  onComplete: () => void;
  onBack?: () => void;
}

export const ReadyToTrack: React.FC<ReadyToTrackProps> = ({ onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await priorityApi.downloadBudgetPdf();
      setDownloaded(true);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await userApi.completeOnboarding();
      // Store last step so Dashboard back button can return here
      localStorage.setItem('onboarding-last-step', '10');
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
      <div className="max-w-md mx-auto px-4">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors mb-6 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        )}

        <div className="text-center">
        <span className="text-6xl mb-4 block">✅</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to Track!</h2>

        <div className="bg-white rounded-xl p-6 mb-4 text-left">
          <p className="text-gray-700 leading-relaxed">
            Now that you have planned your advance for the season, learned a little
            about budgeting and prioritizing, let's move to the tracking stage to
            track your advances from the mukaddam for the season.
          </p>
        </div>

        {/* PDF download section */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4 text-left">
          <p className="text-green-800 font-semibold mb-1">📄 Your Budget Plan is Ready</p>
          <p className="text-sm text-green-700 mb-4">
            Download your personalised budget plan PDF. Keep a printout with you as a
            loose guide to manage your advance over the season.
          </p>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating PDF...
              </>
            ) : downloaded ? (
              '✅ Downloaded — Download Again'
            ) : (
              '⬇️ Download Budget Plan PDF'
            )}
          </button>
          {downloaded && (
            <p className="text-xs text-green-600 mt-2 text-center">
              PDF saved to your downloads folder.
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 mb-6 text-left">
          <p className="text-green-800 font-medium mb-2">What you can do now:</p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✓ Track daily advances from mukaddam</li>
            <li>✓ Log repayments when you return money</li>
            <li>✓ See your remaining balance instantly</li>
            <li>✓ Get AI-powered budget advice</li>
          </ul>
        </div>

        <Button onClick={handleComplete} loading={loading} fullWidth size="lg">
          Go to Dashboard →
        </Button>
        </div>
      </div>
    </div>
  );
};
