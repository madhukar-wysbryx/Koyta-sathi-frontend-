import React from 'react';
import { Button } from '../../components/UI/Button';
import { BackButton } from '../../components/UI/BackButton';

interface PersonalizedInfoProps {
  plannedAdvance: number;
  totalArrears: number;
  onNext: (revisedAdvance: number) => void;
  onRevise: () => void;
  onBack: () => void;
}

const DAILY_WAGE = 500;

export const PersonalizedInfo: React.FC<PersonalizedInfoProps> = ({
  plannedAdvance, totalArrears, onNext, onRevise, onBack,
}) => {
  const combinedTotal   = plannedAdvance + totalArrears;
  const daysForAdvance  = Math.ceil(plannedAdvance / DAILY_WAGE);
  const daysForArrears  = Math.ceil(totalArrears / DAILY_WAGE);
  const daysForCombined = Math.ceil(combinedTotal / DAILY_WAGE);

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <BackButton onBack={onBack} />

        <div className="text-center mb-6">
          <span className="text-4xl">📊</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Advance Plan 2026</h2>
          <p className="text-gray-500 text-sm mt-1">What is your planned advance amount as a koyta for this season?</p>
        </div>

        {/* Breakdown card */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 mb-4 space-y-3">

          {/* Planned advance row */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Planned advance (this season)</p>
            <p className="text-base font-bold text-gray-800">₹{plannedAdvance.toLocaleString()}</p>
          </div>

          {/* Arrears rows — only shown if any arrears exist */}
          {totalArrears > 0 && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Arrears remaining (last 2 seasons)</p>
                <p className="text-base font-bold text-red-600">₹{totalArrears.toLocaleString()}</p>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700">Total amount to repay</p>
                <p className="text-xl font-bold text-gray-900">₹{combinedTotal.toLocaleString()}</p>
              </div>
            </>
          )}

          {/* Repayment estimate */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mt-2">
            {totalArrears > 0 ? (
              <>
                <p className="text-sm text-amber-800 font-medium mb-3">
                  ⚠️ To repay your total of ₹{combinedTotal.toLocaleString()}, you would need to work approximately:
                </p>
                <div className="space-y-2 text-sm text-amber-700">
                  <div className="flex justify-between">
                    <span>Advance (₹{plannedAdvance.toLocaleString()})</span>
                    <span className="font-semibold">{daysForAdvance} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arrears (₹{totalArrears.toLocaleString()})</span>
                    <span className="font-semibold">{daysForArrears} days</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200 pt-2 font-bold text-amber-900">
                    <span>Total</span>
                    <span className="text-2xl">{daysForCombined} days</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ To repay ₹{plannedAdvance.toLocaleString()}, you would need to work approximately
                </p>
                <p className="text-4xl font-bold text-amber-700 my-2 text-center">{daysForAdvance} days</p>
              </>
            )}
            {/* <p className="text-xs text-amber-600 text-center mt-2">
              Based on ~₹{DAILY_WAGE}/day harvesting rate
            </p> */}
            <div className="mt-3 pt-3 border-t border-amber-200">
              <p className="text-xs text-amber-700 font-semibold">
                📌 IMPORTANT: This is a broad estimate only. Actual repayment will depend on days worked, wage rates, and other factors this season.
              </p>
            </div>
          </div>
        </div>

        {/* Revise plan */}
        <div className="bg-white rounded-xl p-5 border border-green-200 mb-6">
          <p className="text-sm font-semibold text-green-800 mb-1">Would you like to revise your plan?</p>
          <p className="text-xs text-gray-500 mb-4">
            You can take only what you need for priority expenses now, and request more later.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onRevise}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-green-500 text-green-700 bg-white hover:bg-green-50 transition"
            >
              Yes
            </button>
            <button
              onClick={() => onNext(plannedAdvance)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition"
            >
              No, Keep It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
