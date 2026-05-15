import React from 'react';
import { Button } from '../../components/UI/Button';
import { BackButton } from '../../components/UI/BackButton';

interface JagdishStoryProps {
  onNext: () => void;
  onBack?: () => void;
}

export const JagdishStory: React.FC<JagdishStoryProps> = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-50 py-8">
      <div className="container-custom">
        <BackButton onBack={onBack ?? (() => {})} />

        {/* Module label */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Staying on Track</span>
            <span>2 of 2</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="w-full bg-green-500 h-1 rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-4xl">👨🌾</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Jagdish's Story</h2>
          <p className="text-gray-500 text-sm">Learning Module – Staying on Track</p>
        </div>

        {/* Story card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <p className="text-gray-700 leading-relaxed italic">
            "During the festival season, Jagdish planned for extra expenses. He tracked his spending
            weekly. When he realized he spent too much on gifts, he looked at his budget and decided
            to spend less on a new shirt he wanted, to make up for the overspending."
          </p>
        </div>

        {/* Key lesson */}
        <div className="bg-green-50 rounded-xl p-5 mb-8">
          <h3 className="font-bold text-green-800 mb-2">💡 Key Lesson:</h3>
          <p className="text-green-700 text-sm leading-relaxed">
            Track spending regularly. If you overspend on one thing, spend less on another.
          </p>
        </div>

        <Button onClick={onNext} fullWidth>
          Continue to Prioritizing →
        </Button>
      </div>
    </div>
  );
};
