import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeScreen } from './WelcomeScreen';
import { ProfileSetup } from './ProfileSetup';
import { GeetaTaiStory } from './GeetaTaiStory';
import { BudgetQuiz } from './BudgetQuiz';
import { QuizResults } from './QuizResults';
import { PrioritizingGame } from './PrioritizingGame';
import { PastSeasonData } from './PastSeasonData';
import { PriorityPlanIntro } from './PriorityPlanIntro';
import { PriorityPlanItems } from './PriorityPlanItems';
import { ReadyToTrack } from './ReadyToTrack';
import { userApi } from '../../api/user.api';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const completeOnboarding = async () => {
    try {
      await userApi.completeOnboarding();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      navigate('/dashboard');
    }
  };

  const goBack = () => setStep(s => Math.max(0, s - 1));

  const steps = [
    <WelcomeScreen onNext={() => setStep(1)} />,
    <ProfileSetup onNext={() => setStep(2)} />,
    <GeetaTaiStory onNext={() => setStep(3)} onBack={goBack} />,
    <BudgetQuiz onComplete={(answers) => { setQuizAnswers(answers); setStep(4); }} onBack={goBack} />,
    <QuizResults answers={quizAnswers} onNext={() => setStep(5)} onBack={goBack} />,
    <PrioritizingGame onComplete={() => setStep(6)} onBack={goBack} />,
    <PastSeasonData onNext={() => setStep(7)} onBack={goBack} />,
    <PriorityPlanIntro onNext={() => setStep(8)} onBack={goBack} />,
    <PriorityPlanItems onComplete={() => setStep(9)} onBack={goBack} />,
    <ReadyToTrack onComplete={completeOnboarding} />,
  ];

  return (
    <>
      <nav className="hidden lg:flex items-center gap-3 px-8 py-4 bg-white border-b border-gray-200">
        <img src="/logo.png" alt="Koyta-Sathi" className="w-8 h-8 object-contain" />
        <span className="text-lg font-bold text-green-700">Koyta-Sathi</span>
      </nav>
      {steps[step]}
    </>
  );
};