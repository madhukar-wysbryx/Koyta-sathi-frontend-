import React, { useState, useEffect } from 'react';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { pastSeasonApi } from '../../api/past-season.api';
import { BackButton } from '../../components/UI/BackButton';

interface PastSeasonDataProps {
  onNext: (plannedAdvance: number, totalArrears: number) => void;
  onBack?: () => void;
}

interface SeasonEntry {
  year: string;
  advanceTaken: string;
  daysWorked: string;
  arrearsAmount: string;
}

const emptyEntry = (): SeasonEntry => ({ year: '', advanceTaken: '', daysWorked: '', arrearsAmount: '' });

export const PastSeasonData: React.FC<PastSeasonDataProps> = ({ onNext, onBack }) => {
  const [seasons, setSeasons] = useState<SeasonEntry[]>([emptyEntry(), emptyEntry()]);
  const [plannedAdvance, setPlannedAdvance] = useState('');
  const [seasonOptions, setSeasonOptions] = useState<{ year: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pastSeasonApi.getSeasonOptions()
      .then(setSeasonOptions)
      .catch(() => setSeasonOptions([
        { year: '2025', label: '2025 Season' },
        { year: '2024', label: '2024 Season' },
        { year: '2023', label: '2023 Season' },
      ]));
  }, []);

  const update = (idx: number, field: keyof SeasonEntry, value: string) => {
    setSeasons(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async () => {
    const valid = seasons.filter(s => s.advanceTaken && s.daysWorked && s.year);
    if (valid.length === 0 || !plannedAdvance) return;
    setLoading(true);
    try {
      await Promise.all(valid.map(s => pastSeasonApi.addPastSeason({
        seasonYear: s.year,
        advanceTaken: parseFloat(s.advanceTaken),
        daysWorked: parseInt(s.daysWorked),
        arrearsAmount: parseFloat(s.arrearsAmount) || 0,
      })));
      const totalArrears = seasons.reduce((sum, s) => sum + (parseFloat(s.arrearsAmount) || 0), 0);
      onNext(parseFloat(plannedAdvance), totalArrears);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = seasons.some(s => s.advanceTaken && s.daysWorked && s.year) && !!plannedAdvance;


  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <BackButton onBack={onBack ?? (() => {})} />

        <div className="text-center mb-6">
          <span className="text-4xl">📅</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Past Season Recall</h2>
          <p className="text-gray-500 text-sm mt-1">Together, recall your last two seasons</p>
        </div>

        {/* Two season entries */}
        {seasons.map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Season {idx + 1}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Season Year</label>
                <select
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={s.year}
                  onChange={e => update(idx, 'year', e.target.value)}
                >
                  <option value="">Select year</option>
                  {seasonOptions.map(opt => (
                    <option key={opt.year} value={opt.year}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <Input label="Advance Taken (₹)" type="number" placeholder="e.g. 50000"
                value={s.advanceTaken} onChange={e => update(idx, 'advanceTaken', e.target.value)} />
              <Input label="Days Worked" type="number" placeholder="e.g. 120"
                value={s.daysWorked} onChange={e => update(idx, 'daysWorked', e.target.value)} />
              <Input label="Arrears Remaining (₹) — Optional" type="number" placeholder="e.g. 10000"
                value={s.arrearsAmount} onChange={e => update(idx, 'arrearsAmount', e.target.value)} />
            </div>
          </div>
        ))}

        {/* Planned advance for upcoming season */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
          <p className="text-sm font-semibold text-green-800 mb-3">📋 Upcoming Season Plan</p>
          <Input
            label="How much advance do you plan to take? (₹)"
            type="number"
            placeholder="e.g. 60000"
            value={plannedAdvance}
            onChange={e => setPlannedAdvance(e.target.value)}
          />
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-700">
            💡 Recalling together helps both partners stay informed about household finances.
          </p>
        </div>

        <Button onClick={handleSubmit} loading={loading} disabled={!canSubmit} fullWidth>
          Continue →
        </Button>
      </div>
    </div>
  );
};
