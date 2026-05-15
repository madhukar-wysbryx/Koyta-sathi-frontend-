import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeScreen } from './WelcomeScreen';
import { GeetaTaiStory } from './GeetaTaiStory';
import { BudgetQuiz } from './BudgetQuiz';
import { QuizResults } from './QuizResults';
import { GauriStory } from './GauriStory';
import { JagdishStory } from './JagdishStory';
import { StoryPrioritizingGame } from './StoryPrioritizingGame';
import { StoryPrioritizingResults } from './StoryPrioritizingResults';
import { PastSeasonData, SeasonEntry, SEASONS, makeEntry } from './PastSeasonData';
import { PersonalizedInfo } from './PersonalizedInfo';
import { PriorityPlanIntro } from './PriorityPlanIntro';
import { PriorityPlanItems, UserItem } from './PriorityPlanItems';
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
  const [storyPriorityItems, setStoryPriorityItems] = useState<{ name: string; isMustHave: boolean }[]>([]);
  const [storyPrioritySkipped, setStoryPrioritySkipped] = useState(false);
  const [pastSeasons, setPastSeasons] = useState<SeasonEntry[]>(SEASONS.map(s => makeEntry(s.year)));
  const [pastPlannedAdvance, setPastPlannedAdvance] = useState('');
  // Lifted state for back-navigation persistence
  const [quizIndex, setQuizIndex]       = useState(0);
  const [quizSavedAnswers, setQuizSavedAnswers] = useState<Record<string, string>>({});
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [storyGameItems, setStoryGameItems] = useState<{ name: string; isMustHave: boolean }[]>([]);
  const [priorityPlanItems, setPriorityPlanItems] = useState<UserItem[]>([]);
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

  const renderStep = () => {
    switch (step) {
      case 0:  return <WelcomeScreen onNext={() => setStep(1)} />;
      case 1:  return <GeetaTaiStory onNext={() => setStep(2)} onBack={goBack} />;
      case 2:  return (
        <BudgetQuiz
          onComplete={(answers) => { setQuizAnswers(answers); setStep(3); }}
          onBack={goBack}
          savedIndex={quizIndex}
          savedAnswers={quizSavedAnswers}
          savedSelected={quizSelected}
          onStateChange={(idx, ans, sel) => { setQuizIndex(idx); setQuizSavedAnswers(ans); setQuizSelected(sel); }}
        />
      );
      case 3:  return <QuizResults answers={quizAnswers} onNext={() => setStep(4)} onBack={goBack} />;
      case 4:  return <GauriStory onNext={() => setStep(5)} onBack={goBack} />;
      case 5:  return <JagdishStory onNext={() => setStep(6)} onBack={goBack} />;
      case 6:  return (
        <StoryPrioritizingGame
          onComplete={(items) => { setStoryPriorityItems(items); setStoryGameItems(items); setStoryPrioritySkipped(false); setStep(7); }}
          onSkip={() => { setStoryPriorityItems([]); setStoryGameItems([]); setStoryPrioritySkipped(true); setStep(7); }}
          onBack={goBack}
          savedItems={storyGameItems}
        />
      );
      case 7:  return (
        <StoryPrioritizingResults
          items={storyPriorityItems}
          skipped={storyPrioritySkipped}
          onNext={() => setStep(8)}
          onBack={goBack}
        />
      );
      case 8:  return (
        <PastSeasonData
          onNext={(pa, arrears) => { setPlannedAdvance(pa); setTotalArrears(arrears); setStep(9); }}
          onBack={goBack}
          seasons={pastSeasons}
          setSeasons={setPastSeasons}
          plannedAdvance={pastPlannedAdvance}
          setPlannedAdvance={setPastPlannedAdvance}
        />
      );
      case 9:  return (
        <PersonalizedInfo
          plannedAdvance={plannedAdvance}
          totalArrears={totalArrears}
          onNext={(ra) => { setPriorityAdvance(ra); setStep(10); }}
          onRevise={() => setStep(8)}
          onBack={goBack}
        />
      );
      case 10: return <PriorityPlanIntro onNext={() => setStep(11)} onBack={goBack} />;
      case 11: return (
        <PriorityPlanItems
          onComplete={() => setStep(12)}
          onBack={goBack}
          priorityAdvance={priorityAdvance}
          savedItems={priorityPlanItems}
          onItemsChange={setPriorityPlanItems}
        />
      );
      case 12: return <ReadyToTrack onComplete={completeOnboarding} onBack={goBack} />;
      default: return null;
    }
  };

  return (
    <OnboardingStepContext.Provider value={{ step, setStep }}>
      <nav className="hidden lg:flex items-center gap-3 px-8 py-4 bg-white border-b border-gray-200">
        <span className="text-2xl">🌾</span>
        <span className="text-lg font-bold text-green-700">Koyta-Sathi</span>
      </nav>
      {renderStep()}
    </OnboardingStepContext.Provider>
  );
};