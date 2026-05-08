import React, { useState, useEffect } from 'react';
import { Button } from '../../components/UI/Button';
import { Loader } from '../../components/UI/Loader';
import { quizApi } from '../../api/quiz.api';
import { geminiApi } from '../../api/gemini.api';

import { BackButton } from '../../components/UI/BackButton';

interface QuizResultsProps {
  answers: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

interface WrongAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ answers, onNext, onBack }) => {
  const [score, setScore] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState<number | null>(null);

  useEffect(() => {
    submitQuiz();
  }, []);

  const submitQuiz = async () => {
    try {
      const result = await quizApi.submitQuiz(answers);
      setScore(result.score);
      setTotal(result.total);
      setWrongAnswers(result.wrongAnswers);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExplanation = async (index: number, wrong: WrongAnswer) => {
    setExplaining(index);
    try {
      const explanation = await geminiApi.explainQuiz(
        wrong.question,
        wrong.userAnswer,
        wrong.correctAnswer
      );
      setExplanations(prev => ({ ...prev, [index]: explanation }));
    } catch (error) {
      setExplanations(prev => ({ ...prev, [index]: wrong.explanation || 'Try again next time!' }));
    } finally {
      setExplaining(null);
    }
  };

  if (loading) return <Loader />;

  const percentage = score && total ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 60;

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container-custom">
        <BackButton onBack={onBack} />
        {/* Progress */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="w-3/5 bg-green-500 h-1 rounded-full" />
          </div>
        </div>

        {/* Score Card */}
        <div className={`rounded-xl p-6 mb-6 text-center ${passed ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <span className="text-5xl mb-3 block">{passed ? '🎉' : '📚'}</span>
          <h2 className="text-2xl font-bold mb-2">
            {passed ? 'Great Job!' : 'Keep Learning!'}
          </h2>
          <p className="text-gray-600 mb-3">
            Your Score: <span className="font-bold text-xl">{score}/{total}</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${passed ? 'bg-green-500' : 'bg-yellow-500'} h-2 rounded-full transition-all`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{percentage}% Correct</p>
        </div>

        {/* Wrong Answers */}
        {wrongAnswers.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">📖 Let's Learn:</h3>
            <div className="space-y-4">
              {wrongAnswers.map((wrong, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="font-medium text-gray-800 mb-2">{wrong.question}</p>
                  <p className="text-sm text-red-600 mb-1">
                    ❌ Your answer: {wrong.userAnswer}
                  </p>
                  <p className="text-sm text-green-600 mb-2">
                    ✅ Correct: {wrong.correctAnswer}
                  </p>
                  {explanations[idx] ? (
                    <div className="bg-blue-50 rounded p-2 mt-2">
                      <p className="text-sm text-blue-700">🤖 {explanations[idx]}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => getExplanation(idx, wrong)}
                      className="text-xs text-blue-500 hover:text-blue-700"
                      disabled={explaining === idx}
                    >
                      {explaining === idx ? 'Loading...' : '🤔 Explain with AI'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={onNext} fullWidth>
          Continue to Prioritizing →
        </Button>
      </div>
    </div>
  );
};