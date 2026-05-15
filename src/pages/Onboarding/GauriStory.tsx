import React from 'react';
import { Button } from '../../components/UI/Button';
import { BackButton } from '../../components/UI/BackButton';

interface GauriStoryProps {
  onNext: () => void;
  onBack?: () => void;
}

export const GauriStory: React.FC<GauriStoryProps> = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-50 py-8">
      <div className="container-custom">
        <BackButton onBack={onBack ?? (() => {})} />

        {/* Module label */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Staying on Track</span>
            <span>1 of 2</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="w-1/2 bg-green-500 h-1 rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-4xl">👩</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Gauri's Story</h2>
          <p className="text-gray-500 text-sm">Learning Module – Staying on Track</p>
        </div>

        {/* Story card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <p className="text-gray-700 leading-relaxed italic">
            "Gauri made a budget with her family. At the market, a friend offered her beautiful cloth.
            Gauri was tempted but remembered her budget had no money for it. She was glad her savings
            were in the bank and not easy to reach. Later, her stove broke, and she used the
            'emergency fund' she had set aside to buy a new one."
          </p>
        </div>

        {/* Key lesson */}
        <div className="bg-green-50 rounded-xl p-5 mb-8">
          <h3 className="font-bold text-green-800 mb-2">💡 Key Lesson:</h3>
          <p className="text-green-700 text-sm leading-relaxed">
            Keep savings out of reach and set aside money for unexpected expenses.
          </p>
        </div>

        <Button onClick={onNext} fullWidth>
          Next Story →
        </Button>
      </div>
    </div>
  );
};
