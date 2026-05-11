import { createContext, useContext, useState } from 'react';

interface OnboardingStepContextType {
  step: number;
  setStep: (step: number) => void;
}

export const OnboardingStepContext = createContext<OnboardingStepContextType>({
  step: 0,
  setStep: () => {},
});

export const useOnboardingStep = () => useContext(OnboardingStepContext);

export const useOnboardingStepState = () => {
  const [step, setStep] = useState(0);
  return { step, setStep };
};
