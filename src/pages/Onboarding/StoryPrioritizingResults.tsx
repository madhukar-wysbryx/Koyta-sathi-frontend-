import React from 'react';
import { Button } from '../../components/UI/Button';
import { BackButton } from '../../components/UI/BackButton';

interface StoryPrioritizingResultsProps {
  items: { name: string; isMustHave: boolean }[];
  skipped: boolean;
  onNext: () => void;
  onBack?: () => void;
}

export const StoryPrioritizingResults: React.FC<StoryPrioritizingResultsProps> = ({
  items,
  skipped,
  onNext,
  onBack,
}) => {
  const mustHave = items.filter(i => i.isMustHave);
  const cantWait  = items.filter(i => !i.isMustHave);

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <BackButton onBack={onBack ?? (() => {})} />

        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">{skipped ? '📋' : '✅'}</span>
          <h2 className="text-2xl font-bold text-gray-800">
            {skipped ? 'Activity Skipped' : 'Your Priorities'}
          </h2>
          {skipped && (
            <p className="text-gray-500 text-sm mt-1">You can revisit this in your profile anytime.</p>
          )}
        </div>

        {!skipped && (
          <>
            {/* Must Have */}
            {mustHave.length > 0 && (
              <div className="mb-4">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  Must Have
                  <span className="ml-auto text-xs font-normal text-gray-400">{mustHave.length} item{mustHave.length !== 1 ? 's' : ''}</span>
                </h3>
                <div className="space-y-2">
                  {mustHave.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white border border-green-200 rounded-lg px-4 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span className="text-sm text-gray-800">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Can't Wait */}
            {cantWait.length > 0 && (
              <div className="mb-6">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                  <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
                  Can't Wait
                  <span className="ml-auto text-xs font-normal text-gray-400">{cantWait.length} item{cantWait.length !== 1 ? 's' : ''}</span>
                </h3>
                <div className="space-y-2">
                  {cantWait.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white border border-orange-200 rounded-lg px-4 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                      <span className="text-sm text-gray-800">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Button onClick={onNext} fullWidth className={skipped ? 'mt-2' : ''}>
          Continue →
        </Button>
      </div>
    </div>
  );
};
