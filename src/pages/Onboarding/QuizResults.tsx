import React, { useState, useEffect } from 'react';
import { Button } from '../../components/UI/Button';
import { Loader } from '../../components/UI/Loader';
import { quizApi } from '../../api/quiz.api';
import { BackButton } from '../../components/UI/BackButton';

interface QuizResultsProps {
  answers: Record<string, string>;
  onNext: () => void;
  onBack?: () => void;
}

interface WrongAnswer {
  question: string;
  options: string[];
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ answers, onNext, onBack }) => {
  const [score, setScore]               = useState<number | null>(null);
  const [total, setTotal]               = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => { submitQuiz(); }, []);

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

  if (loading) return <Loader />;

  const passed = (score ?? 0) >= Math.ceil(total / 2);

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container-custom">
        <BackButton onBack={onBack ?? (() => {})} />

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="w-3/5 bg-green-500 h-1 rounded-full" />
          </div>
        </div>

        {/* Score card */}
        <div className="bg-white rounded-xl p-6 mb-6 text-center border border-gray-100 shadow-sm">
          <span className="text-5xl mb-3 block">{passed ? '🎉' : '📚'}</span>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {passed ? 'Great Job!' : 'Keep Learning!'}
          </h2>
          <p className="text-gray-500 mb-1">Your Score</p>
          <p className="text-4xl font-bold text-green-700">{score} / {total}</p>
          <p className="text-sm text-gray-400 mt-1">
            {score} correct answer{score !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Wrong answers with full option list */}
        {wrongAnswers.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">📖 Let's Learn:</h3>
            <div className="space-y-5">
              {wrongAnswers.map((wrong, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="font-medium text-gray-800 mb-3">{wrong.question}</p>

                  {/* All options rendered with highlighting */}
                  <div className="space-y-2">
                    {(wrong.options || []).map((option, oIdx) => {
                      const optionKey = `option_${String.fromCharCode(97 + oIdx)}`;
                      const isCorrect  = optionKey === wrong.correctAnswer;
                      const isWrong    = optionKey === wrong.userAnswer;

                      let containerClass = 'border-gray-200 bg-gray-50 opacity-60';
                      let textClass      = 'text-gray-500';
                      let icon           = null;

                      if (isCorrect) {
                        containerClass = 'border-green-500 bg-green-50';
                        textClass      = 'text-green-800 font-semibold';
                        icon = (
                          <span className="shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        );
                      } else if (isWrong) {
                        containerClass = 'border-red-400 bg-red-50';
                        textClass      = 'text-red-700';
                        icon = (
                          <span className="shrink-0 w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </span>
                        );
                      } else {
                        icon = <span className="shrink-0 w-5 h-5 rounded-full border-2 border-gray-300" />;
                      }

                      return (
                        <div key={oIdx} className={`flex items-center gap-3 border-2 rounded-lg px-3 py-2 ${containerClass}`}>
                          {icon}
                          <span className={`text-sm ${textClass}`}>{option}</span>
                          {isCorrect && <span className="ml-auto text-xs font-semibold text-green-600 shrink-0">✓ Correct</span>}
                          {isWrong  && <span className="ml-auto text-xs font-semibold text-red-500 shrink-0">Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
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
