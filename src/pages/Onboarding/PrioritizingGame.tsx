import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { priorityApi } from '../../api/priority.api';

import { BackButton } from '../../components/UI/BackButton';

interface PrioritizingGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const itemsList = [
  { name: "Khana (Food)", default: "Must Have" },
  { name: "Dawaai (Medicine)", default: "Must Have" },
  { name: "Baccho ki Fees", default: "Must Have" },
  { name: "Ghar ka Rent", default: "Must Have" },
  { name: "Naye Kapde", default: "Wait for Later" },
  { name: "Mobile Recharge", default: "Must Have" },
  { name: "Chhutti Mein Ghumna", default: "Wait for Later" },
  { name: "Naya Phone", default: "Wait for Later" },
  { name: "Ghar Ki Mending", default: "Must Have" },
  { name: "Khet Ka Kaam", default: "Must Have" },
];

export const PrioritizingGame: React.FC<PrioritizingGameProps> = ({ onComplete, onBack }) => {
  const [items, setItems] = useState(itemsList.map(item => ({
    name: item.name,
    isMustHave: item.default === "Must Have"
  })));
  const [saving, setSaving] = useState(false);

  const toggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index].isMustHave = !newItems[index].isMustHave;
    setItems(newItems);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await priorityApi.savePrioritizingGame(items.map(item => ({
        itemName: item.name,
        isMustHave: item.isMustHave
      })));
      onComplete();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const mustHaveCount = items.filter(i => i.isMustHave).length;
  const waitLaterCount = items.filter(i => !i.isMustHave).length;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container-custom">
        <BackButton onBack={onBack} />
        {/* Progress */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="w-4/5 bg-green-500 h-1 rounded-full" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Prioritizing</h2>
          <p className="text-gray-500 mt-1">Help Geeta Tai prioritize her expenses</p>
        </div>

        {/* Stats */}
        <div className="flex justify-between gap-3 mb-6">
          <div className="flex-1 bg-green-100 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{mustHaveCount}</p>
            <p className="text-xs text-green-600">Must Have</p>
          </div>
          <div className="flex-1 bg-yellow-100 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-700">{waitLaterCount}</p>
            <p className="text-xs text-yellow-600">Wait for Later</p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2 mb-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                ${item.isMustHave ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
              onClick={() => toggleItem(idx)}
            >
              <span className="text-gray-800">{item.name}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                ${item.isMustHave ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                {item.isMustHave ? 'Must Have ✓' : 'Wait for Later'}
              </span>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} loading={saving} fullWidth>
          Continue to Priority Plan →
        </Button>
      </div>
    </div>
  );
};