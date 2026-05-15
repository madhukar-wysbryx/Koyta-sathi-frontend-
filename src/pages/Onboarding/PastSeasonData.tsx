import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { pastSeasonApi } from '../../api/past-season.api';
import { BackButton } from '../../components/UI/BackButton';

interface PastSeasonDataProps {
  onNext: (plannedAdvance: number, totalArrears: number) => void;
  onBack?: () => void;
  seasons: SeasonEntry[];
  setSeasons: React.Dispatch<React.SetStateAction<SeasonEntry[]>>;
  plannedAdvance: string;
  setPlannedAdvance: React.Dispatch<React.SetStateAction<string>>;
}

interface SeasonEntry {
  year: string;
  advanceTaken: string;
  daysWorked: string;
  arrearsAmount: string;
  advancePending: string;
}

const SEASONS: { year: string; label: string }[] = [
  { year: '2025', label: '2025 Season' },
  { year: '2024', label: '2024 Season' },
];

const makeEntry = (year: string): SeasonEntry => ({
  year,
  advanceTaken: '',
  daysWorked: '',
  arrearsAmount: '',
  advancePending: '',
});

export type { SeasonEntry };
export { SEASONS, makeEntry };

const isPositiveNumber = (v: string) => v.trim() !== '' && !isNaN(parseFloat(v)) && parseFloat(v) >= 0;
const isPositiveInt    = (v: string) => v.trim() !== '' && !isNaN(parseInt(v))   && parseInt(v)   >= 0;

export const PastSeasonData: React.FC<PastSeasonDataProps> = ({
  onNext, onBack, seasons, setSeasons, plannedAdvance, setPlannedAdvance,
}) => {
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const update = (idx: number, field: keyof SeasonEntry, value: string) => {
    setSeasons(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  // Validation helpers
  const seasonErrors = (s: SeasonEntry) => ({
    advanceTaken:  !isPositiveNumber(s.advanceTaken),
    daysWorked:    !isPositiveInt(s.daysWorked),
    arrearsAmount: !isPositiveNumber(s.arrearsAmount),
    advancePending: !isPositiveNumber(s.advancePending),
  });

  const allValid =
    seasons.every(s => {
      const e = seasonErrors(s);
      return !e.advanceTaken && !e.daysWorked && !e.arrearsAmount && !e.advancePending;
    }) && isPositiveNumber(plannedAdvance);

  const handleSubmit = async () => {
    setTouched(true);
    if (!allValid) return;
    setLoading(true);
    try {
      await Promise.all(seasons.map(s => pastSeasonApi.addPastSeason({
        seasonYear:           s.year,
        advanceTaken:         parseFloat(s.advanceTaken),
        daysWorked:           parseInt(s.daysWorked),
        arrearsAmount:        parseFloat(s.arrearsAmount),
        advancePendingAtStart: parseFloat(s.advancePending),
      })));
      const totalArrears = seasons.reduce((sum, s) => sum + parseFloat(s.arrearsAmount), 0);
      onNext(parseFloat(plannedAdvance), totalArrears);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (invalid: boolean) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
      touched && invalid ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <BackButton onBack={onBack ?? (() => {})} />

        <div className="text-center mb-6">
          <span className="text-4xl">📅</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Past Season Recall</h2>
          <p className="text-gray-500 text-sm mt-1">Together, recall your last two seasons</p>
        </div>

        {seasons.map((s, idx) => {
          const err = seasonErrors(s);
          return (
            <div key={s.year} className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
              <p className="text-sm font-semibold text-green-700 mb-3">
                Season {idx + 1} — {SEASONS[idx].label}
              </p>
              <div className="space-y-3">

                {/* Advance Taken */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Advance Taken (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" placeholder="e.g. 50000" min={0}
                    value={s.advanceTaken}
                    onChange={e => update(idx, 'advanceTaken', e.target.value)}
                    className={fieldClass(err.advanceTaken)}
                  />
                  {touched && err.advanceTaken && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>

                {/* Days Worked */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Days Worked <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" placeholder="e.g. 120" min={0}
                    value={s.daysWorked}
                    onChange={e => update(idx, 'daysWorked', e.target.value)}
                    className={fieldClass(err.daysWorked)}
                  />
                  {touched && err.daysWorked && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>

                {/* Arrears Remaining */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Arrears Remaining (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" placeholder="e.g. 10000" min={0}
                    value={s.arrearsAmount}
                    onChange={e => update(idx, 'arrearsAmount', e.target.value)}
                    className={fieldClass(err.arrearsAmount)}
                  />
                  {touched && err.arrearsAmount && (
                    <p className="text-xs text-red-500 mt-1">Required — enter 0 if none</p>
                  )}
                </div>

                {/* Advance Pending at Start */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Advance Pending at Start (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" placeholder="e.g. 5000" min={0}
                    value={s.advancePending}
                    onChange={e => update(idx, 'advancePending', e.target.value)}
                    className={fieldClass(err.advancePending)}
                  />
                  {touched && err.advancePending && (
                    <p className="text-xs text-red-500 mt-1">Required — enter 0 if none</p>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {/* Planned advance for upcoming season */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
          <p className="text-sm font-semibold text-green-800 mb-3">📋 Upcoming Season Plan</p>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              How much advance do you plan to take? (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number" placeholder="e.g. 60000" min={0}
              value={plannedAdvance}
              onChange={e => setPlannedAdvance(e.target.value)}
              className={fieldClass(!isPositiveNumber(plannedAdvance))}
            />
            {touched && !isPositiveNumber(plannedAdvance) && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-700">
            💡 Recalling together helps both partners stay informed about household finances.
          </p>
        </div>

        {touched && !allValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-600">Please fill in all required fields before continuing.</p>
          </div>
        )}

        <Button onClick={handleSubmit} loading={loading} fullWidth>
          Continue →
        </Button>
      </div>
    </div>
  );
};
