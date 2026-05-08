import React, { useState, useEffect } from 'react';
import { geminiApi } from '../../api/gemini.api';

interface BudgetAdviceProps {
  spendingData: any;
}

export const BudgetAdvice: React.FC<BudgetAdviceProps> = ({ spendingData }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdvice();
  }, [spendingData]);

  const loadAdvice = async () => {
    try {
      const result = await geminiApi.getBudgetAdvice(spendingData);
      setAdvice(result);
    } catch (error) {
      setAdvice("Aap achha kar rahe ho. Kharch pe nazar rakho!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-2">🤖 Thinking...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
      <div className="flex items-start gap-2">
        <span className="text-xl">🤖</span>
        <div>
          <p className="text-sm font-medium text-purple-800">Gemini AI Suggestion</p>
          <p className="text-sm text-purple-700">{advice}</p>
        </div>
      </div>
    </div>
  );
};