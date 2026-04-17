import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, BadgeCheck, StickyNote, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTutorial } from '@/contexts/TutorialContext';
import { TUTORIAL_STEPS } from '@/config/tutorialConfigs';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';

/**
 * TutorialStep — wraps any element and shows a tutorial tooltip when
 * the current tutorial step matches this page + stepId.
 *
 * When inactive it renders children with zero overhead (no extra DOM).
 */
export function TutorialStep({ page, stepId, children, side, wrapperClassName }) {
  const {
    isStepActive,
    nextStep,
    prevStep,
    skipTutorial,
    currentStepIndex,
    getTotalSteps,
  } = useTutorial();
  const { resolvedTheme } = useTheme();

  const BADGE_ICONS = { BadgeCheck, StickyNote, Sparkles };

  const active = isStepActive(page, stepId);
  const anchorRef = useRef(null);

  const steps = TUTORIAL_STEPS[page] || [];
  const stepData = steps.find((s) => s.id === stepId);
  const totalSteps = getTotalSteps(page);
  const stepNumber = currentStepIndex + 1;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const effectiveSide = side || stepData?.side || 'bottom';

  // Scroll the highlighted element into view when it becomes the active step
  useEffect(() => {
    if (active && anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [active]);

  if (!stepData) return children;

  // Not the active step — render children as-is (no wrapper)
  if (!active) return children;

  return (
    <Popover open={true} modal={false}>
      <PopoverAnchor asChild>
        {/* z-40 sits above backdrop (z-30) but below SiteHeader (z-50) */}
        <div
          ref={anchorRef}
          className={cn(
            "relative z-40 rounded-xl shadow-2xl transition-all duration-300 overflow-visible antialiased",
            resolvedTheme === 'light'
              ? "dark bg-neutral-900 text-neutral-50"
              : "tutorial-light bg-background text-neutral-900",
            wrapperClassName
          )}
        >
          {children}
        </div>
      </PopoverAnchor>

      <PopoverContent
        side={effectiveSide}
        align="start"
        sideOffset={12}
        className="w-72 p-0 shadow-2xl border border-blue-100 dark:border-blue-900/40 z-100 rounded-xl overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-neutral-100 dark:border-neutral-800 bg-blue-50/60 dark:bg-blue-950/30">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Step {stepNumber} of {totalSteps}
          </span>
          <button
            onClick={skipTutorial}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors rounded p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pt-3 pb-2">
          <p className="font-semibold text-sm text-foreground mb-1.5">
            {stepData.title}
          </p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {stepData.description}
          </p>

          {/* Badge icon legend — shown for steps that have a badges array */}
          {stepData.badges && (
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              {stepData.badges.map((badge) => {
                const Icon = BADGE_ICONS[badge.iconName];
                return (
                  <div key={badge.iconName} className="flex items-start gap-2.5">
                    <div className={cn(
                      'flex items-center justify-center w-6 h-6 rounded-md shrink-0 mt-0.5',
                      badge.bg
                    )}>
                      {Icon && <Icon className={cn('w-3 h-3', badge.iconColor)} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-tight">{badge.label}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{badge.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <button
            onClick={skipTutorial}
            className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            Skip tutorial
          </button>
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={prevStep}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <ChevronLeft className="w-3 h-3" />
                Back
              </button>
            )}
            <button
              onClick={nextStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {isLastStep ? 'Done' : 'Next'}
              {!isLastStep && <ChevronRight className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TutorialStep;
