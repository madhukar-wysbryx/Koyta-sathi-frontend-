import React, { useState, useEffect } from 'react';
import { Button } from '../../components/UI/Button';
import { priorityApi } from '../../api/priority.api';

import { BackButton } from '../../components/UI/BackButton';

interface PriorityPlanItemsProps {
  onComplete: () => void;
  onBack?: () => void;
  priorityAdvance?: number;
  preselectedCategories?: { name: string; isMustHave: boolean }[];
}

interface PriorityItem {
  id: number;
  name: string;
  defaultAmount: number;
  description: string;
  selected: boolean;
  amount: number;
}

export const PriorityPlanItems: React.FC<PriorityPlanItemsProps> = ({ onComplete, onBack, priorityAdvance, preselectedCategories }) => {
  const [items, setItems] = useState<PriorityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await priorityApi.getAvailableItems();
      const apiItems = data.map((item: any) => {
        const preselected = preselectedCategories?.find(c => c.name === item.name);
        return {
          ...item,
          selected: preselected ? preselected.isMustHave : false,
          amount: item.defaultAmount,
        };
      });
      // Also add any custom categories from the prioritization game not in the API list
      const customItems = (preselectedCategories || [])
        .filter(c => !data.find((d: any) => d.name === c.name))
        .map((c, i) => ({
          id: 1000 + i,
          name: c.name,
          defaultAmount: 0,
          description: 'Custom category',
          selected: c.isMustHave,
          amount: 0,
        }));
      setItems([...apiItems, ...customItems]);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const updateAmount = (id: number, amount: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, amount } : item
    ));
  };

  const handleSave = async () => {
    const selectedItems = items
      .filter(i => i.selected)
      .map(i => ({ itemName: i.name, estimatedAmount: i.amount }));
    
    if (selectedItems.length === 0) return;
    
    setSaving(true);
    try {
      await priorityApi.createPlan('2026', selectedItems, priorityAdvance);
      onComplete();
    } catch (error) {
      console.error('Failed to save plan:', error);
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = items.reduce((sum, i) => i.selected ? sum + i.amount : sum, 0);
  const selectedCount = items.filter(i => i.selected).length;


  if (loading) return <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-green-500 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-amber-50 border-b border-amber-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <BackButton onBack={onBack ?? (() => {})} />
          <h2 className="text-xl font-bold text-gray-800">Choose Your Priorities</h2>
          <p className="text-sm text-gray-500 mt-0.5">Select items and set your estimated budget — <span className="text-red-500 font-medium">required to continue</span></p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* Priority advance context */}
        {priorityAdvance && priorityAdvance > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <p className="text-sm text-amber-800">
              🎯 Your priority advance limit: <strong>₹{priorityAdvance.toLocaleString()}</strong>. Select items that fit within this amount.
            </p>
          </div>
        )}

        {/* Items list */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                item.selected
                  ? 'border-green-500 bg-white shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.selected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {item.selected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Name + description */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${
                    item.selected ? 'text-green-800' : 'text-gray-800'
                  }`}>{item.name}</p>
                  <p className="text-xs text-gray-400 truncate">{item.description}</p>
                </div>

                {/* Amount input */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0"
                >
                  <div className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
                    item.selected ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <span className={`px-2 text-sm font-medium ${
                      item.selected ? 'text-green-600' : 'text-gray-400'
                    }`}>₹</span>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateAmount(item.id, parseFloat(e.target.value) || 0)}
                      className="w-20 py-1.5 pr-2 text-sm text-right bg-transparent focus:outline-none text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="bg-green-700 rounded-xl p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-green-200 text-xs">Selected</p>
            <p className="text-white font-bold text-lg">{selectedCount} items</p>
          </div>
          <div className="w-px h-8 bg-green-500" />
          <div className="text-right">
            <p className="text-green-200 text-xs">Total Budget</p>
            <p className="text-white font-bold text-lg">₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          loading={saving}
          disabled={selectedCount === 0}
          fullWidth
          size="lg"
        >
          {selectedCount === 0 ? 'Select at least one item to continue' : 'Save & Continue →'}
        </Button>
      </div>
    </div>
  );
};