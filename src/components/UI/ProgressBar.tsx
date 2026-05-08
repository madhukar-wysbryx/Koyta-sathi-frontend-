import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'green' | 'red' | 'yellow';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  showPercentage = true,
  color = 'green',
}) => {
  const colors = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(safePercentage)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`${colors[color]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
};