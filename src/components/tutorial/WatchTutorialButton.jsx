import { PlayCircle, BookOpen } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';

/**
 * WatchTutorialButton — shown in page headers.
 * Starts (or restarts) the tutorial for the given page.
 */
export function WatchTutorialButton({ page }) {
  const { isActive, activePage, startTutorial } = useTutorial();
  const isThisPageActive = isActive && activePage === page;

  return (
    <button
      onClick={() => startTutorial(page)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        isThisPageActive
          ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
          : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200'
      }`}
    >
      {isThisPageActive ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Tutorial Active
        </>
      ) : (
        <>
          <BookOpen className="w-3.5 h-3.5" />
          Watch Tutorial
        </>
      )}
    </button>
  );
}

export default WatchTutorialButton;
