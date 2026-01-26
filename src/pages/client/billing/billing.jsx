import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Loader2,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Zap,
  Shield,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

const PREMIUM_FEATURES = [
  { name: '6-Week Trailing Report', description: 'Historical overview data for trend analysis' },
  { name: 'PPS Daily Report', description: 'Proper Park Sequence compliance metrics' },
  { name: 'DVIC Inspection Report', description: '7-day vehicle inspection timing data' },
  { name: 'Paw Print Compliance', description: 'At-stop safety notification compliance' },
  { name: 'Download PDF Scorecards', description: 'Generate professional PDF reports' },
  { name: 'Send SMS/Email', description: 'Share scorecards with drivers directly' },
  { name: 'AI-Powered Feedback', description: 'Personalized coaching for each driver' },
];

const FREE_FEATURES = [
  { name: 'DSP Scorecard Upload', description: 'Weekly performance scorecard PDF' },
  { name: 'Weekly Overview Report', description: 'Dashboard export with driver metrics' },
  { name: 'Customer Feedback Report', description: 'Negative delivery feedback breakdown' },
  { name: 'POD Quality Report', description: 'Photo on Delivery metrics' },
  { name: 'Basic Analytics', description: 'View driver scorecards and metrics' },
];

export default function Billing() {
  const [searchParams] = useSearchParams();
  const {
    subscription,
    isLoading,
    hasPremiumAccess,
    isTrialing,
    trialDaysRemaining,
    isTrialExpired,
    isSubscribed,
    createCheckoutSession,
    openCustomerPortal,
    refreshSubscription,
  } = useSubscription();

  const [isProcessing, setIsProcessing] = useState(false);

  // Handle success/cancel from Stripe checkout
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast.success('Subscription activated! Thank you for subscribing.');
      refreshSubscription();
    } else if (canceled === 'true') {
      toast.info('Checkout canceled. You can try again anytime.');
    }
  }, [searchParams, refreshSubscription]);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await createCheckoutSession();
    } catch (err) {
      toast.error(err.message || 'Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsProcessing(true);
    try {
      await openCustomerPortal();
    } catch (err) {
      toast.error(err.message || 'Failed to open billing portal. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          <p className="text-sm text-muted-foreground">Loading billing information...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (isSubscribed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4" />
          Active Subscription
        </span>
      );
    }
    if (isTrialing && trialDaysRemaining > 7) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <Clock className="w-4 h-4" />
          Free Trial
        </span>
      );
    }
    if (isTrialing && trialDaysRemaining <= 7) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4" />
          Trial Expiring Soon
        </span>
      );
    }
    if (isTrialExpired || subscription?.status === 'CANCELED' || subscription?.status === 'EXPIRED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <AlertTriangle className="w-4 h-4" />
          {subscription?.status === 'CANCELED' ? 'Canceled' : 'Expired'}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Subscription</h1>
              <p className="text-muted-foreground">Manage your subscription and billing details</p>
            </div>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Current Plan Card */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
          </div>
          <div className="p-6">
            {isTrialing && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">30-Day Free Trial</h3>
                      <p className="text-sm text-muted-foreground">Full access to all premium features</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{trialDaysRemaining}</p>
                    <p className="text-sm text-muted-foreground">days remaining</p>
                  </div>
                </div>

                {/* Trial Progress Bar */}
                <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full transition-all',
                      trialDaysRemaining > 14 ? 'bg-blue-500' :
                      trialDaysRemaining > 7 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, (trialDaysRemaining / 30) * 100))}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Trial started on {subscription?.trialStartDate ? new Date(subscription.trialStartDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            )}

            {isSubscribed && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Premium Plan</h3>
                    <p className="text-sm text-muted-foreground">Full access to all features</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">$24.99</p>
                  <p className="text-sm text-muted-foreground">per week</p>
                </div>
              </div>
            )}

            {(isTrialExpired || subscription?.status === 'CANCELED' || subscription?.status === 'EXPIRED') && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Free Plan</h3>
                    <p className="text-sm text-muted-foreground">Limited features</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">$0</p>
                  <p className="text-sm text-muted-foreground">forever</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isSubscribed && (
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all',
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
                      Upgrade to Premium - $24.99/week
                    </>
                  )}
                </button>
              )}

              {(isSubscribed || subscription?.stripeCustomerId) && (
                <button
                  onClick={handleManageSubscription}
                  disabled={isProcessing}
                  className={cn(
                    'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                    'border border-neutral-200 dark:border-neutral-700',
                    'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    isSubscribed ? 'flex-1' : ''
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  Manage Subscription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Features */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold text-foreground">Free Features</h3>
              <p className="text-sm text-muted-foreground">Always available</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature.name} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium Features */}
          <div className="rounded-2xl border-2 border-neutral-900 dark:border-white overflow-hidden">
            <div className="bg-neutral-900 dark:bg-white px-6 py-4 border-b border-neutral-900 dark:border-white">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 dark:text-amber-500" />
                <h3 className="font-semibold text-white dark:text-neutral-900">Premium Features</h3>
              </div>
              <p className="text-sm text-neutral-400 dark:text-neutral-500">Unlock with subscription</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature.name} className="flex gap-3">
                    <Zap className={cn(
                      'w-5 h-5 flex-shrink-0 mt-0.5',
                      hasPremiumAccess ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-600'
                    )} />
                    <div>
                      <p className="font-medium text-foreground text-sm">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ / Info */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="font-semibold text-foreground mb-4">Billing FAQ</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-foreground">When will I be charged?</p>
              <p className="text-muted-foreground">You'll be charged $24.99 weekly after subscribing. The first charge occurs immediately.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Can I cancel anytime?</p>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time through the billing portal. Your access will continue until the end of your current billing period.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">What payment methods are accepted?</p>
              <p className="text-muted-foreground">We accept all major credit cards, debit cards, and some digital wallets through Stripe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
