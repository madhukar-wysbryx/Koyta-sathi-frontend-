import React, { useState, useEffect } from 'react';
import { Button } from '../../components/UI/Button';
import { geminiApi } from '../../api/gemini.api';
import { BackButton } from '../../components/UI/BackButton';

interface GeetaTaiStoryProps {
  onNext: () => void;
  onBack?: () => void;
}

export const GeetaTaiStory: React.FC<GeetaTaiStoryProps> = ({ onNext, onBack }) => {
  const [narratedText, setNarratedText] = useState('');
  const [loading, setLoading] = useState(true);

  const story = `Geeta Tai is a sugarcane cutter from a small village in Maharashtra. 
  She cannot read or write, but she knows how to plan for her family's future. 
  She follows her income and spending closely over time to compare her plan with what really happens. 
  She changes her estimates for the next month based on what she learns.`;

  useEffect(() => {
    const getNarration = async () => {
      try {
        const response = await geminiApi.getWelcomeMessage('Geeta Tai');
        setNarratedText(response || story);
      } catch (error) {
        setNarratedText(story);
      } finally {
        setLoading(false);
      }
    };
    getNarration();
  }, []);

  const budgetSteps = [
    "Set financial goals",
    "Estimate amount of income",
    "Decide how much to save",
    "List all expenses",
    "Ensure expenses are not more than income",
    "Follow the budget"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-50 py-8">
      <div className="container-custom">
        <BackButton onBack={onBack ?? (() => {})} />
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step 2 of 5</span>
            <span>Budgeting 101</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="w-2/5 bg-green-500 h-1 rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-4xl">👩‍🌾</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Geeta Tai's Story</h2>
          <p className="text-gray-500">Learn from her wisdom</p>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed italic">
              "{narratedText}"
            </p>
          )}
        </div>

        {/* Budget Steps */}
        <div className="bg-green-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-green-800 mb-3">📝 STEPS TO MAKE A BUDGET:</h3>
          <div className="space-y-2">
            {budgetSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="text-center mb-8">
          <p className="text-amber-700 font-medium">
            "Geeta Tai knows how to plan for her family's future, even without reading or writing."
          </p>
        </div>

        <Button onClick={onNext} fullWidth>
          Understand the Lesson →
        </Button>
      </div>
    </div>
  );
};