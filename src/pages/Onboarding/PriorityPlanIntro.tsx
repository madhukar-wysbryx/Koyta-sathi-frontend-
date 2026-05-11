import React from 'react';
import { Button } from '../../components/UI/Button';

import { BackButton } from '../../components/UI/BackButton';

interface PriorityPlanIntroProps {
  onNext: () => void;
  onBack?: () => void;
}

export const PriorityPlanIntro: React.FC<PriorityPlanIntroProps> = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container-custom text-center">
        <div className="text-left"><BackButton onBack={onBack ?? (() => {})} /></div>
        <span className="text-6xl mb-4 block">🎯</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Priority Plan 2026</h2>
        <p className="text-gray-600 mb-6">
          Identify your absolute priority expenditures for the year ahead.
        </p>

        <div className="bg-white rounded-xl p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-2">Why Priority Plan?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Helps you focus on what's truly important</li>
            <li>✓ Prevents overspending on non-essentials</li>
            <li>✓ Makes repayment planning easier</li>
            <li>✓ Reduces stress about money</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-yellow-800">
            📌 Based on research from Harvard University, households that create 
            priority plans are 40% more likely to stay within their budget.
          </p>
        </div>

        <Button onClick={onNext} fullWidth size="lg">
          Create My Priority Plan →
        </Button>
      </div>
    </div>
  );
};