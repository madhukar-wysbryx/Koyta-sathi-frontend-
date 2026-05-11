import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { priorityApi } from '../../api/priority.api';
import { BackButton } from '../../components/UI/BackButton';

interface PrioritizingGameProps {
  onComplete: (categories: { name: string; isMustHave: boolean }[]) => void;
  onBack?: () => void;
}

const EXPERT_TIPS: Record<string, string> = {
  'Food':                   'Food is a daily need — always a Must Have.',
  'Medicine':               'Health emergencies cannot wait. Keep this as Must Have.',
  "Children's School Fees": 'Missing school fees can affect your children\'s future. Prioritise early.',
  'House Rent':             'Unpaid rent can cause serious problems. Usually a Must Have.',
  'New Clothes':            'New clothes can often wait until after the season.',
  'Mobile Recharge':        'Basic recharge for communication is usually essential.',
  'Holiday Trip':           'Trips are enjoyable but can be planned for after repayment.',
  'New Phone':              'A new phone can usually wait — consider if your current one works.',
  'House Repairs':          'Small repairs now can prevent bigger costs later.',
  'Farm Work':              'Farm work investment can directly affect your income.',
};

export const PrioritizingGame: React.FC<PrioritizingGameProps> = ({ onComplete, onBack }) => {
  const [stage, setStage] = useState<1 | 2>(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [items, setItems] = useState<{ name: string; isMustHave: boolean }[]>([]);
  const [saving, setSaving] = useState(false);

  // Stage 1: add categories
  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.length >= 10) return;
    setCategories(prev => [...prev, trimmed]);
    setNewCategory('');
  };

  const removeCategory = (idx: number) => {
    setCategories(prev => prev.filter((_, i) => i !== idx));
  };

  const proceedToStage2 = () => {
    setItems(categories.map(name => ({ name, isMustHave: true })));
    setStage(2);
  };

  // Stage 2: must-have / can-wait
  const toggleItem = (idx: number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, isMustHave: !item.isMustHave } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await priorityApi.savePrioritizingGame(items.map(item => ({
        itemName: item.name,
        isMustHave: item.isMustHave,
      })));
      onComplete(items);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const mustHaveCount = items.filter(i => i.isMustHave).length;

  // ── Stage 1 ──
  if (stage === 1) {
    return (
      <div className="min-h-screen bg-amber-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <BackButton onBack={onBack ?? (() => {})} />
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="w-4/5 bg-green-500 h-1 rounded-full" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Spending Categories</h2>
            <p className="text-gray-500 mt-1 text-sm">
              List up to 10 categories your household plans to spend advance on this season
            </p>
          </div>

          {/* Add input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
              placeholder="e.g. School fees, Food, Medicine"
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={categories.length >= 10}
            />
            <button
              onClick={addCategory}
              disabled={!newCategory.trim() || categories.length >= 10}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-4">{categories.length} / 10 categories added</p>

          {/* Category list */}
          <div className="space-y-2 mb-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-sm text-gray-800">{cat}</span>
                <button onClick={() => removeCategory(idx)} className="text-gray-400 hover:text-red-500 transition text-lg leading-none">×</button>
              </div>
            ))}
          </div>

          <Button
            onClick={proceedToStage2}
            disabled={categories.length === 0}
            fullWidth
          >
            Next: Categorise Each One →
          </Button>
        </div>
      </div>
    );
  }

  // ── Stage 2 ──
  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <BackButton onBack={() => setStage(1)} />
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="w-4/5 bg-green-500 h-1 rounded-full" />
          </div>
        </div>

        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Must Have or Can Wait?</h2>
          <p className="text-gray-500 mt-1 text-sm">Tap each item to categorise it</p>
        </div>

        {/* Counter */}
        <div className="flex gap-3 my-4">
          <div className="flex-1 bg-green-100 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{mustHaveCount}</p>
            <p className="text-xs text-green-600">Must Have</p>
          </div>
          <div className="flex-1 bg-yellow-100 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-700">{items.length - mustHaveCount}</p>
            <p className="text-xs text-yellow-600">Can Wait</p>
          </div>
        </div>

        {/* Items with expert tip */}
        <div className="space-y-3 mb-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                item.isMustHave ? 'border-green-400 bg-white' : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => toggleItem(idx)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${
                  item.isMustHave ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                }`}>
                  {item.isMustHave ? 'Must Have ✓' : 'Can Wait'}
                </span>
              </div>
              {/* Expert tip */}
              {EXPERT_TIPS[item.name] && (
                <p className="text-xs text-amber-700 mt-2 bg-amber-50 rounded px-2 py-1">
                  💡 {EXPERT_TIPS[item.name]}
                </p>
              )}
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
