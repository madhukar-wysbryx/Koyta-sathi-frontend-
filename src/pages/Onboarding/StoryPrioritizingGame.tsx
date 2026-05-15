import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { BackButton } from '../../components/UI/BackButton';
import { priorityApi } from '../../api/priority.api';

interface StoryPrioritizingGameProps {
  onComplete: (items: { name: string; isMustHave: boolean }[]) => void;
  onSkip: () => void;
  onBack?: () => void;
  savedItems?: { name: string; isMustHave: boolean }[];
}

const PRESET_ITEMS = [
  'Food & Groceries',
  'Medicine & Healthcare',
  "Children's School Fees",
  'House Rent',
  'Debt Repayment',
  'Emergency Fund',
  'New Clothes',
  'Mobile Recharge',
  'Holiday Trip',
  'New Phone',
  'House Repairs',
  'Farm Work',
];

export const StoryPrioritizingGame: React.FC<StoryPrioritizingGameProps> = ({ onComplete, onSkip, onBack, savedItems }) => {
  const [items, setItems] = useState<{ name: string; isMustHave: boolean }[]>(
    savedItems && savedItems.length > 0
      ? savedItems
      : PRESET_ITEMS.map(name => ({ name, isMustHave: true }))
  );
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    setSaving(true);
    try {
      await priorityApi.savePrioritizingGame(
        items.map(item => ({ itemName: item.name, isMustHave: item.isMustHave }))
      );
    } catch {
      // non-blocking
    } finally {
      setSaving(false);
      onComplete(items);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <BackButton onBack={onBack ?? (() => {})} />

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Choose Your Priorities</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Help Geeta Tai prioritize her expenses. Which of these are 'Must Have' right now, and which can 'Wait for Later'?
          </p>
        </div>

        {/* Item list */}
        <div className="space-y-2 mb-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3"
            >
              <p className="text-sm font-medium text-gray-800 mb-2">{item.name}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setItems(prev => prev.map((it, i) => i === idx ? { ...it, isMustHave: true } : it))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all border-2 ${
                    item.isMustHave
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600'
                  }`}
                >
                  ✓ Must Have
                </button>
                <button
                  onClick={() => setItems(prev => prev.map((it, i) => i === idx ? { ...it, isMustHave: false } : it))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all border-2 ${
                    !item.isMustHave
                      ? 'bg-orange-400 border-orange-400 text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500'
                  }`}
                >
                  ⏳ Can't Wait
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Expert Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-bold text-amber-800 mb-2">💡 Expert Tip:</p>
          <p className="text-sm text-amber-700 mb-2">Experts recommend prioritizing:</p>
          <ul className="space-y-1">
            {['Emergencies', 'Debt payments', 'Daily needs (Food)', 'Future goals'].map((tip, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={handleContinue} loading={saving} fullWidth>
          See My Results →
        </Button>

        <button
          onClick={onSkip}
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
