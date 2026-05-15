import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { BackButton } from '../../components/UI/BackButton';
import { priorityApi } from '../../api/priority.api';

interface PriorityPlanItemsProps {
  onComplete: () => void;
  onBack?: () => void;
  priorityAdvance?: number;
  savedItems?: UserItem[];
  onItemsChange?: (items: UserItem[]) => void;
}

interface UserItem {
  id: number;
  category: string;
  amount: number;
  isMustHave: boolean | null; // null = not yet chosen
}

export type { UserItem };

export const PriorityPlanItems: React.FC<PriorityPlanItemsProps> = ({ onComplete, onBack, priorityAdvance, savedItems, onItemsChange }) => {
  const [items, setItems]             = useState<UserItem[]>(savedItems ?? []);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount]     = useState('');
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const [shaking, setShaking]         = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const isOverLimit = (total: number) =>
    !!(priorityAdvance && priorityAdvance > 0 && total > priorityAdvance);

  const addItem = () => {
    const category = newCategory.trim();
    const amount   = parseFloat(newAmount);
    if (items.length >= 10) { setError('You can add a maximum of 10 items.'); return; }
    if (!category) { setError('Please enter a category name.'); return; }
    if (!newAmount || isNaN(amount) || amount <= 0) { setError('Please enter a valid amount.'); return; }
    const newTotal = items.filter(i => i.isMustHave === true).reduce((sum, i) => sum + i.amount, 0) + amount;
    if (isOverLimit(newTotal)) { triggerShake(); setError(''); return; }
    setError('');
    const next = [...items, { id: Date.now(), category, amount, isMustHave: null as null }];
    setItems(next);
    onItemsChange?.(next);
    setNewCategory('');
    setNewAmount('');
  };

  const removeItem = (id: number) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    onItemsChange?.(next);
  };

  const updateCategory = (id: number, value: string) => {
    const next = items.map(i => i.id === id ? { ...i, category: value } : i);
    setItems(next);
    onItemsChange?.(next);
  };

  const updateAmount = (id: number, value: string) => {
    const amount = parseFloat(value);
    const next = items.map(i => i.id === id ? { ...i, amount: isNaN(amount) ? 0 : amount } : i);
    const newTotal = next.filter(i => i.isMustHave === true).reduce((sum, i) => sum + i.amount, 0);
    if (isOverLimit(newTotal)) triggerShake();
    setItems(next);
    onItemsChange?.(next);
  };

  const setCategory = (id: number, isMustHave: boolean) => {
    const next = items.map(i => i.id === id ? { ...i, isMustHave } : i);
    const newTotal = next.filter(i => i.isMustHave === true).reduce((sum, i) => sum + i.amount, 0);
    if (isOverLimit(newTotal)) triggerShake();
    setItems(next);
    onItemsChange?.(next);
  };

  const allCategorised = items.length > 0 && items.every(i => i.isMustHave !== null);

  const handleSave = async () => {
    if (items.length === 0) { setError('Add at least one item to continue.'); return; }
    if (!allCategorised) { setError('Please categorise every item as Must Have or Can\'t Wait.'); return; }
    if (isOverLimit(mustHaveTotal)) { triggerShake(); return; }
    setError('');
    setSaving(true);
    try {
      const mustHaveItems = items
        .filter(i => i.isMustHave === true)
        .map(i => ({ itemName: i.category, estimatedAmount: i.amount }));
      // If all items are Can't Wait, still save with empty list but allow proceeding
      await priorityApi.createPlan('2026', mustHaveItems.length > 0 ? mustHaveItems : [], priorityAdvance);
      onComplete();
    } catch (err) {
      console.error('Failed to save plan:', err);
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Only Must Have items count toward the total
  const mustHaveTotal = items.filter(i => i.isMustHave === true).reduce((sum, i) => sum + i.amount, 0);
  const mustHaveCount = items.filter(i => i.isMustHave === true).length;
  const cantWaitCount = items.filter(i => i.isMustHave === false).length;

  const inputClass = 'px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-amber-50 border-b border-amber-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <BackButton onBack={onBack ?? (() => {})} />
          <h2 className="text-xl font-bold text-gray-800">Priority Plan 2026</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Identify your absolute priority expenditures for the year ahead —{' '}
            <span className="text-red-500 font-medium">required to continue</span>
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* Priority advance context */}
        {priorityAdvance && priorityAdvance > 0 && (
          <div className={`border rounded-xl p-3 mb-4 transition-colors ${
            isOverLimit(mustHaveTotal)
              ? 'bg-red-50 border-red-400'
              : 'bg-amber-50 border-amber-200'
          } ${shaking ? 'animate-shake' : ''}`}>
            <p className={`text-sm font-medium ${
              isOverLimit(mustHaveTotal) ? 'text-red-700' : 'text-amber-800'
            }`}>
              {isOverLimit(mustHaveTotal) ? '⚠️' : '🎯'} Your priority advance limit:{' '}
              <strong>₹{priorityAdvance.toLocaleString()}</strong>.
              {isOverLimit(mustHaveTotal) && (
                <span className="block mt-1 text-xs text-red-600 font-semibold">
                  Must Have total (₹{mustHaveTotal.toLocaleString()}) exceeds your limit. Please reduce your Must Have items.
                </span>
              )}
            </p>
          </div>
        )}

        {/* Add new item row */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Priority Item (MAX - 10)
            <span className="ml-2 text-xs font-normal text-gray-400">({items.length} / 10)</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Category (e.g. School Fees)"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              className={`flex-1 ${inputClass}`}
              disabled={items.length >= 10}
            />
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-green-500 shrink-0 sm:w-36">
              <span className="px-2 text-sm font-medium text-gray-500">₹</span>
              <input
                type="number"
                placeholder="Amount"
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                className="flex-1 py-2 pr-2 text-sm bg-transparent focus:outline-none text-gray-800 w-full"
                min={0}
                disabled={items.length >= 10}
              />
            </div>
            <button
              onClick={addItem}
              disabled={items.length >= 10}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Add
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm">No items added yet. Add your first priority above.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border-2 p-3 shadow-sm transition-colors ${
                  item.isMustHave === true  ? 'border-green-400' :
                  item.isMustHave === false ? 'border-orange-300' :
                  'border-gray-200'
                }`}
              >
                {/* Top row: index + category + amount + remove */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${
                    item.isMustHave === true  ? 'bg-green-500' :
                    item.isMustHave === false ? 'bg-orange-400' :
                    'bg-gray-400'
                  }`}>
                    {idx + 1}
                  </span>

                  <input
                    type="text"
                    value={item.category}
                    onChange={e => updateCategory(item.id, e.target.value)}
                    className="flex-1 text-sm font-medium text-gray-800 bg-transparent border-b border-transparent focus:border-green-400 focus:outline-none py-0.5 min-w-0"
                  />

                  <div className={`shrink-0 flex items-center border rounded-lg overflow-hidden w-28 ${
                    item.isMustHave === true  ? 'border-green-300 bg-green-50' :
                    item.isMustHave === false ? 'border-orange-200 bg-orange-50' :
                    'border-gray-200 bg-gray-50'
                  }`}>
                    <span className={`px-1.5 text-xs font-medium ${
                      item.isMustHave === true  ? 'text-green-600' :
                      item.isMustHave === false ? 'text-orange-500' :
                      'text-gray-400'
                    }`}>₹</span>
                    <input
                      type="number"
                      value={item.amount || ''}
                      onChange={e => updateAmount(item.id, e.target.value)}
                      className="w-full py-1.5 pr-2 text-sm text-right bg-transparent focus:outline-none text-gray-800"
                      min={0}
                    />
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Category buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setCategory(item.id, true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                      item.isMustHave === true
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600'
                    }`}
                  >
                    ✓ Must Have
                  </button>
                  <button
                    onClick={() => setCategory(item.id, false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                      item.isMustHave === false
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
        )}

        {/* Summary bar — only shown once items exist */}
        {items.length > 0 && (
          <div className="bg-green-700 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-green-200 text-xs">Must Have</p>
                <p className="text-white font-bold text-lg">{mustHaveCount} item{mustHaveCount !== 1 ? 's' : ''}</p>
              </div>
              <div className="w-px h-8 bg-green-500" />
              <div>
                <p className="text-green-200 text-xs">Can't Wait</p>
                <p className="text-white font-bold text-lg">{cantWaitCount} item{cantWaitCount !== 1 ? 's' : ''}</p>
              </div>
              <div className="w-px h-8 bg-green-500" />
              <div className="text-right">
                <p className="text-green-200 text-xs">Must Have Total</p>
                <p className="text-white font-bold text-lg">₹{mustHaveTotal.toLocaleString()}</p>
              </div>
            </div>
            {items.some(i => i.isMustHave === null) && (
              <p className="text-green-300 text-xs text-center mt-1">
                ⚠️ {items.filter(i => i.isMustHave === null).length} item{items.filter(i => i.isMustHave === null).length !== 1 ? 's' : ''} not yet categorised
              </p>
            )}
          </div>
        )}

        <Button
          onClick={handleSave}
          loading={saving}
          disabled={items.length === 0}
          fullWidth
          size="lg"
        >
          {items.length === 0
            ? 'Add at least one item to continue'
            : !allCategorised
            ? 'Categorise all items to continue'
            : 'Save & Continue →'}
        </Button>
      </div>
    </div>
  );
};
