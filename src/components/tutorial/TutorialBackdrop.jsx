import { useTutorial } from '@/contexts/TutorialContext';

/**
 * Full-screen blur overlay shown behind the active tutorial element.
 * Add this once inside ClientAppLayout — renders nothing when no tutorial is active.
 */
export function TutorialBackdrop() {
  const { isActive } = useTutorial();

  if (!isActive) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-30 bg-background/60 backdrop-blur-[2px] pointer-events-none transition-all duration-300"
    />
  );
}

export default TutorialBackdrop;
