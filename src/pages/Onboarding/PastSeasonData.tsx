import React, { useState, useEffect } from 'react';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { pastSeasonApi } from '../../api/past-season.api';

import { BackButton } from '../../components/UI/BackButton';

interface PastSeasonDataProps {
  onNext: () => void;
  onBack: () => void;
}

export const PastSeasonData: React.FC<PastSeasonDataProps> = ({ onNext, onBack }) => {
  const [seasonYear, setSeasonYear] = useState('2025');
  const [advanceTaken, setAdvanceTaken] = useState('');
  const [daysWorked, setDaysWorked] = useState('');
  const [arrearsAmount, setArrearsAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [seasonOptions, setSeasonOptions] = useState<{ year: string; label: string }[]>([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const options = await pastSeasonApi.getSeasonOptions();
      setSeasonOptions(options);
    } catch (error) {
      setSeasonOptions([
        { year: '2024', label: '2024 Season' },
        { year: '2023', label: '2023 Season' },
        { year: '2022', label: '2022 Season' },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!advanceTaken || !daysWorked) return;
    
    setLoading(true);
    try {
      await pastSeasonApi.addPastSeason({
        seasonYear,
        advanceTaken: parseFloat(advanceTaken),
        daysWorked: parseInt(daysWorked),
        arrearsAmount: parseFloat(arrearsAmount) || 0,
      });
      onNext();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container-custom">
        <BackButton onBack={onBack} />
        <div className="text-center mb-6">
          <span className="text-4xl">📅</span>
          <h2 className="text-2xl font-bold text-gray-800">Past Season {seasonYear}</h2>
          <p className="text-gray-500">Help us understand your past experience</p>
        </div>

        <div className="space-y-4">
          {/* Season Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Season</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={seasonYear}
              onChange={(e) => setSeasonYear(e.target.value)}
            >
              {seasonOptions.map(opt => (
                <option key={opt.year} value={opt.year}>{opt.label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Total Advance Taken (₹)"
            type="number"
            placeholder="e.g., 50000"
            value={advanceTaken}
            onChange={(e) => setAdvanceTaken(e.target.value)}
          />

          <Input
            label="Days Worked"
            type="number"
            placeholder="e.g., 120"
            value={daysWorked}
            onChange={(e) => setDaysWorked(e.target.value)}
          />

          <Input
            label="Remaining Arrears (₹) (Optional)"
            type="number"
            placeholder="e.g., 10000"
            value={arrearsAmount}
            onChange={(e) => setArrearsAmount(e.target.value)}
          />

          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              💡 This helps us give you better advice for the upcoming season!
            </p>
          </div>
        </div>

        <Button
          className="mt-8"
          onClick={handleSubmit}
          loading={loading}
          disabled={!advanceTaken || !daysWorked}
          fullWidth
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};