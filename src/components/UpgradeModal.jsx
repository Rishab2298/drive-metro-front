import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { cn } from '@/lib/utils';
import {
  X,
  Crown,
  Zap,
  Loader2,
  CreditCard,
  Check,
  Lock,
} from 'lucide-react';

const PREMIUM_BENEFITS = [
  'Premium report uploads (6-Week Trailing, PPS, DVIC, Paw Print)',
  'Download PDF scorecards',
  'Send scorecards via SMS and Email',
  'AI-powered driver feedback',
  'Historical trend analysis',
];

export default function UpgradeModal({ isOpen, onClose, featureName }) {
  const navigate = useNavigate();
  const { createCheckoutSession, isTrialing, trialDaysRemaining } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await createCheckoutSession();
    } catch (err) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
    }
  };

  const handleViewBilling = () => {
    onClose();
    navigate('/billing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 px-6 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Upgrade to Premium</h2>
              <p className="text-sm text-neutral-300">Unlock all features</p>
            </div>
          </div>

          {featureName && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-sm">
                <span className="font-medium">{featureName}</span> requires Premium
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Trial Notice */}
          {isTrialing && trialDaysRemaining > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Your trial ends in {trialDaysRemaining} days.</span>
                {' '}Subscribe now to keep access to all premium features.
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Premium includes:</h3>
            <ul className="space-y-2">
              {PREMIUM_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-foreground">$20</span>
            <span className="text-muted-foreground">/ week</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                'hover:bg-neutral-800 dark:hover:bg-neutral-100',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Subscribe Now
                </>
              )}
            </button>

            <button
              onClick={handleViewBilling}
              className="w-full px-6 py-3 rounded-xl font-semibold text-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            >
              View Billing Details
            </button>

            <button
              onClick={onClose}
              className="w-full px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
