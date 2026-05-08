import React from 'react';

interface BackButtonProps {
  onBack: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onBack }) => (
  <button
    onClick={onBack}
    className="flex items-center gap-1.5 text-gray-500 hover:text-green-700 transition-colors group mb-4"
  >
    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    <span className="text-sm font-medium">Back</span>
  </button>
);
