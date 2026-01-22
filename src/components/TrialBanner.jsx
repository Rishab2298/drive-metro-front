import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { cn } from '@/lib/utils';
import {
  X,
  Clock,
  AlertTriangle,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function TrialBanner() {
  const navigate = useNavigate();
  const {
    isTrialing,
    trialDaysRemaining,
    isTrialExpired,
    isSubscribed,
    isLoading,
  } = useSubscription();

  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if:
  // - Still loading
  // - Already subscribed
  // - User dismissed the banner
  // - Trial has more than 7 days remaining
  if (isLoading || isSubscribed || isDismissed) {
    return null;
  }

  // Only show if trial is expiring soon (7 days or less) or expired
  const showBanner = isTrialExpired || (isTrialing && trialDaysRemaining !== null && trialDaysRemaining <= 7);

  if (!showBanner) {
    return null;
  }

  const handleUpgrade = () => {
    navigate('/billing');
  };

  if (isTrialExpired) {
    return (
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Your free trial has expired. Upgrade now to continue using premium features.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleUpgrade}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Upgrade Now
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded-lg hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trial expiring soon
  return (
    <div className={cn(
      'text-white',
      trialDaysRemaining <= 3 ? 'bg-amber-600' : 'bg-blue-600'
    )}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              {trialDaysRemaining === 0 && 'Your free trial ends today!'}
              {trialDaysRemaining === 1 && 'Your free trial ends tomorrow!'}
              {trialDaysRemaining > 1 && `Your free trial ends in ${trialDaysRemaining} days.`}
              {' '}Upgrade to keep access to all premium features.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleUpgrade}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors',
                trialDaysRemaining <= 3
                  ? 'bg-white text-amber-600 hover:bg-amber-50'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              )}
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className={cn(
                'p-1 rounded-lg transition-colors',
                trialDaysRemaining <= 3 ? 'hover:bg-amber-500' : 'hover:bg-blue-500'
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
