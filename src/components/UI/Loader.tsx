import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  );
};