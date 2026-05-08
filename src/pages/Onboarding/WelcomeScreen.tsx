import React from 'react';
import { Button } from '../../components/UI/Button';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container-custom py-12">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">🌾</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-green-800 mb-2">
          Koyta-Sathi
        </h1>
        <p className="text-center text-gray-600 mb-8">
          आपका साथी, आपकी तरक्की
        </p>

        {/* Research Notes Card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Important Notes</h3>
          <p className="text-sm text-yellow-700 mb-2">
            This is a research study by Harvard University & SOPPECOM to improve financial 
            well-being of sugarcane cutters in Maharashtra.
          </p>
          <p className="text-xs text-yellow-600">
            Your data will be deleted by April 2027
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-lg p-3 mb-8">
          <p className="text-xs text-gray-500 text-center">
            ⚠️ Not Financial Advice: This is a tool to help you track debt and plan.
          </p>
        </div>

        {/* Continue Button */}
        <Button onClick={onNext} fullWidth size="lg">
          Let's Begin →
        </Button>
      </div>
    </div>
  );
};