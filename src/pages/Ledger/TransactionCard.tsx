import React from 'react';
import { Card } from '../../components/UI/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface TransactionCardProps {
  transaction: {
    id: string;
    type: 'taken' | 'repaid';
    amount: number;
    purpose: string;
    date: string;
    remainingBalance: number;
    visualPercentage: number;
  };
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full
              ${transaction.type === 'taken' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {transaction.type === 'taken' ? 'Taken' : 'Repaid'}
            </span>
            <span className="text-xs text-gray-400">{formatDate(transaction.date)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{transaction.purpose}</p>
        </div>
        <p className={`font-bold ${transaction.type === 'taken' ? 'text-red-600' : 'text-green-600'}`}>
          {transaction.type === 'taken' ? '-' : '+'} {formatCurrency(transaction.amount)}
        </p>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Balance: {formatCurrency(transaction.remainingBalance)}</span>
          <span>{transaction.visualPercentage}% of plan</span>
        </div>
      </div>
    </Card>
  );
};