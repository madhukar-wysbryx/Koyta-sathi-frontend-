import React, { useState, useEffect } from 'react';
import { Button } from '../../components/UI/Button';
import { Loader } from '../../components/UI/Loader';
import { quizApi } from '../../api/quiz.api';

interface Question {
  id: string;
  questionText: string;
  options: string[];
}

import { BackButton } from '../../components/UI/BackButton';

interface BudgetQuizProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export const BudgetQuiz: React.FC<BudgetQuizProps> = ({ onComplete, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await quizApi.getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedOption) {
      const newAnswers = { ...answers, [questions[currentIndex].id]: selectedOption };
      setAnswers(newAnswers);
      setSelectedOption(null);
      
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete(newAnswers);
      }
    }
  };

  if (loading) return <Loader />;
  if (!questions.length) return <div>No questions available</div>;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container-custom">
        <BackButton onBack={onBack} />
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step 3 of 5</span>
            <span>Question {currentIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-green-500 h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {currentQuestion.questionText}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const optionKey = `option_${String.fromCharCode(97 + idx)}`;
              return (
                <label
                  key={idx}
                  className={`block p-3 border rounded-lg cursor-pointer transition-all
                    ${selectedOption === optionKey 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'}`}
                  onClick={() => setSelectedOption(optionKey)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedOption === optionKey ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                      {selectedOption === optionKey && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={handleNext}
          disabled={!selectedOption}
          fullWidth
        >
          {currentIndex + 1 === questions.length ? 'Submit Quiz →' : 'Next Question →'}
        </Button>
      </div>
    </div>
  );
};