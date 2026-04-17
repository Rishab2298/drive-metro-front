import { createContext, useContext, useState, useCallback } from 'react';
import { TUTORIAL_STEPS } from '@/config/tutorialConfigs';

const TutorialContext = createContext(null);

export function TutorialProvider({ children }) {
  const [activePage, setActivePage] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const startTutorial = useCallback((page) => {
    localStorage.removeItem(`tutorial_done_${page}`);
    setActivePage(page);
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    const steps = TUTORIAL_STEPS[activePage] || [];
    if (currentStepIndex >= steps.length - 1) {
      localStorage.setItem(`tutorial_done_${activePage}`, 'true');
      setIsActive(false);
      setCurrentStepIndex(0);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [activePage, currentStepIndex]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const skipTutorial = useCallback(() => {
    if (activePage) {
      localStorage.setItem(`tutorial_done_${activePage}`, 'true');
    }
    setIsActive(false);
  }, [activePage]);

  const isStepActive = useCallback(
    (page, stepId) => {
      if (!isActive || activePage !== page) return false;
      const steps = TUTORIAL_STEPS[page] || [];
      return steps[currentStepIndex]?.id === stepId;
    },
    [isActive, activePage, currentStepIndex]
  );

  const getTotalSteps = useCallback(
    (page) => (TUTORIAL_STEPS[page] || []).length,
    []
  );

  const getCurrentStepNumber = useCallback(
    () => currentStepIndex + 1,
    [currentStepIndex]
  );

  const isTutorialActiveForPage = useCallback(
    (page) => isActive && activePage === page,
    [isActive, activePage]
  );

  return (
    <TutorialContext.Provider
      value={{
        activePage,
        currentStepIndex,
        isActive,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        isStepActive,
        getTotalSteps,
        getCurrentStepNumber,
        isTutorialActiveForPage,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error('useTutorial must be used within TutorialProvider');
  return ctx;
}
