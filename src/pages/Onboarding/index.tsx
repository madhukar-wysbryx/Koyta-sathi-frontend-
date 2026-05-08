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

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const steps = [
    <WelcomeScreen onNext={() => setStep(1)} />,
    <ProfileSetup onNext={() => setStep(2)} />,
    <GeetaTaiStory onNext={() => setStep(3)} />,
    <BudgetQuiz onComplete={(answers) => {
      setQuizAnswers(answers);
      setStep(4);
    }} />,
    <QuizResults answers={quizAnswers} onNext={() => setStep(5)} />,
    <PrioritizingGame onComplete={() => setStep(6)} />,
    <PastSeasonData onNext={() => setStep(7)} />,
    <PriorityPlanIntro onNext={() => setStep(8)} />,
    <PriorityPlanItems onComplete={() => setStep(9)} />,
    <ReadyToTrack onComplete={() => navigate('/dashboard')} />,
  ];

  return <>{steps[step]}</>;
};