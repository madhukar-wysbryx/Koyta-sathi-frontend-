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
          Your companion for a better season
        </p>

        {/* Research Notes Card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-4">📋 Important Notes</h3>

          {/* Research Study */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-yellow-800 mb-1">Research Study:</p>
            <p className="text-sm text-yellow-700 mb-2">
              We are inviting you to use this app over the next few months as part of a research
              initiative with SOPPECOM being led by Professor Eliana La Ferrara and Aditi Bhowmick
              at Harvard University. The purpose of the research is to develop and assess tools that
              can potentially improve the financial well-being of sugarcane cutters in Maharashtra.
            </p>
            <p className="text-sm text-yellow-700">
              Any information you provide in the app will only be available to the mentioned
              researchers for analysis purposes only. All data provided in the app will be deleted
              from app storage by the end of the agricultural cycle (i.e. April 2027).
            </p>
          </div>

          <div className="border-t border-yellow-200 my-3" />

          {/* Not Financial Advice */}
          <div>
            <p className="text-sm font-semibold text-yellow-800 mb-1">Not Financial Advice:</p>
            <p className="text-sm text-yellow-700">
              This tool is intended to help users track debt and plan finances. It does not provide
              professional financial advice or recommendations.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <Button onClick={onNext} fullWidth size="lg">
          Let's Begin →
        </Button>
      </div>
    </div>
  );
};