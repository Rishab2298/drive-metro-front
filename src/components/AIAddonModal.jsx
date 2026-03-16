import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { cn } from '@/lib/utils';
import {
  X,
  Sparkles,
  Loader2,
  CreditCard,
  Check,
  Lock,
  Brain,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';

const AI_BENEFITS = [
  { icon: Brain, text: 'Personalized driver coaching notes' },
  { icon: TrendingUp, text: 'Performance improvement suggestions' },
  { icon: MessageSquare, text: 'Actionable feedback for each driver' },
];

export default function AIAddonModal({ isOpen, onClose, featureName }) {
  const navigate = useNavigate();
  const { createAIAddonCheckout, hasPremiumAccess } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAddAI = async () => {
    setIsProcessing(true);
    try {
      await createAIAddonCheckout();
    } catch (err) {
      console.error('AI addon checkout error:', err);
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
        <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 px-6 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Coaching Add-on</h2>
              <p className="text-sm text-purple-200">Personalized driver feedback</p>
            </div>
          </div>

          {featureName && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20">
              <Lock className="w-4 h-4 text-purple-300" />
              <span className="text-sm">
                <span className="font-medium">{featureName}</span> requires AI add-on
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">AI Coaching includes:</h3>
            <ul className="space-y-3">
              {AI_BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm text-muted-foreground pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How it works */}
          <div className="mb-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-muted-foreground">
              Our AI analyzes each driver's metrics and generates personalized coaching notes
              with actionable improvement tips.
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-foreground">$9.99</span>
            <span className="text-muted-foreground">/ week</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleAddAI}
              disabled={isProcessing || !hasPremiumAccess}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
                'hover:from-purple-700 hover:to-indigo-700',
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
                  Add AI Coaching - $6.99/week
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
