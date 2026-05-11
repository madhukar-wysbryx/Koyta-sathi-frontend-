import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeScreen } from './WelcomeScreen';
import { ProfileSetup } from './ProfileSetup';
import { GeetaTaiStory } from './GeetaTaiStory';
import { BudgetQuiz } from './BudgetQuiz';
import { QuizResults } from './QuizResults';
import { PrioritizingGame } from './PrioritizingGame';
import { PastSeasonData } from './PastSeasonData';
import { PersonalizedInfo } from './PersonalizedInfo';
import { PriorityPlanIntro } from './PriorityPlanIntro';
import { PriorityPlanItems } from './PriorityPlanItems';
import { ReadyToTrack } from './ReadyToTrack';
import { userApi } from '../../api/user.api';
import { OnboardingStepContext } from '../../store/onboardingStepContext';

export const Onboarding: React.FC = () => {
  const savedStep = parseInt(localStorage.getItem('onboarding-last-step') || '0', 10);
  const [step, setStep] = useState(savedStep);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [plannedAdvance, setPlannedAdvance] = useState(0);
  const [totalArrears, setTotalArrears]     = useState(0);
  const [priorityAdvance, setPriorityAdvance] = useState(0);
  const [priorityCategories, setPriorityCategories] = useState<{ name: string; isMustHave: boolean }[]>([]);
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

  // Steps:
  // 0 WelcomeScreen
  // 1 ProfileSetup
  // 2 GeetaTaiStory
  // 3 BudgetQuiz
  // 4 QuizResults
  // 5 PrioritizingGame
  // 6 PastSeasonData       ← recall exercise (2 seasons) + planned advance
  // 7 PersonalizedInfo     ← workdays calculation + option to revise
  // 8 PriorityPlanIntro
  // 9 PriorityPlanItems    ← priority-advance plan
  // 10 ReadyToTrack

  const steps = [
    <WelcomeScreen onNext={() => setStep(1)} />,
    <ProfileSetup onNext={() => setStep(2)} />,
    <GeetaTaiStory onNext={() => setStep(3)} onBack={goBack} />,
    <BudgetQuiz onComplete={(answers) => { setQuizAnswers(answers); setStep(4); }} onBack={goBack} />,
    <QuizResults answers={quizAnswers} onNext={() => setStep(5)} onBack={goBack} />,
    <PrioritizingGame onComplete={(cats) => { setPriorityCategories(cats); setStep(6); }} onBack={goBack} />,
    <PastSeasonData onNext={(pa, arrears) => { setPlannedAdvance(pa); setTotalArrears(arrears); setStep(7); }} onBack={goBack} />,
    <PersonalizedInfo plannedAdvance={plannedAdvance} totalArrears={totalArrears} onNext={(ra) => { setPriorityAdvance(ra); setStep(8); }} onBack={goBack} />,
    <PriorityPlanIntro onNext={() => setStep(9)} onBack={goBack} />,
    <PriorityPlanItems onComplete={() => setStep(10)} onBack={goBack} priorityAdvance={priorityAdvance} preselectedCategories={priorityCategories} />,
    <ReadyToTrack onComplete={completeOnboarding} onBack={goBack} />,
  ];

  return (
    <OnboardingStepContext.Provider value={{ step, setStep }}>
      <nav className="hidden lg:flex items-center gap-3 px-8 py-4 bg-white border-b border-gray-200">
        <span className="text-2xl">🌾</span>
        <span className="text-lg font-bold text-green-700">Koyta-Sathi</span>
      </nav>
      {steps[step]}
    </OnboardingStepContext.Provider>
  );
};