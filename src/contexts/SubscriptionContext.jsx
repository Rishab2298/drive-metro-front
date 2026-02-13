import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { getToken, isSignedIn } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscription = useCallback(async () => {
    if (!isSignedIn) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/subscription`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If no DSP found, user might still be onboarding
        if (response.status === 404) {
          setSubscription(null);
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to fetch subscription status');
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isSignedIn]);

  // Fetch subscription on mount and when auth changes
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Helper: Does user have premium access (active subscription or valid trial)?
  const hasPremiumAccess = subscription?.hasPremiumAccess ?? false;

  // Helper: Is user currently trialing?
  const isTrialing = subscription?.isTrialing ?? false;

  // Helper: Days remaining in trial
  const trialDaysRemaining = subscription?.daysRemaining ?? null;

  // Helper: Is trial about to expire (7 days or less)?
  const isTrialExpiringSoon = isTrialing && trialDaysRemaining !== null && trialDaysRemaining <= 7;

  // Helper: Has the trial expired?
  const isTrialExpired = subscription?.status === 'EXPIRED';

  // Helper: Is subscription active (paid)?
  const isSubscribed = subscription?.status === 'ACTIVE';

  // Helper: Has AI addon access?
  const hasAIAccess = subscription?.hasAIAccess ?? false;

  // Helper: AI addon status
  const aiAddonStatus = subscription?.aiAddonStatus ?? null;

  // Helper: AI trial info (for users on trial/grace period, not paid)
  const aiTrialInfo = subscription?.aiTrialInfo ?? null;

  // Helper: Is AI access from trial/grace period (not paid)?
  const isAiTrial = hasAIAccess && aiAddonStatus !== 'ACTIVE' && aiTrialInfo !== null;

  // Helper: Create checkout session and redirect to Stripe
  const createCheckoutSession = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/billing/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  };

  // Helper: Open Stripe customer portal
  const openCustomerPortal = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/billing/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error creating portal session:', err);
      throw err;
    }
  };

  // Helper: Create AI addon checkout session and redirect to Stripe
  const createAIAddonCheckout = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/billing/create-ai-addon-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create AI addon checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error creating AI addon checkout session:', err);
      throw err;
    }
  };

  const value = {
    subscription,
    isLoading,
    error,
    hasPremiumAccess,
    isTrialing,
    trialDaysRemaining,
    isTrialExpiringSoon,
    isTrialExpired,
    isSubscribed,
    hasAIAccess,
    aiAddonStatus,
    aiTrialInfo,
    isAiTrial,
    refreshSubscription: fetchSubscription,
    createCheckoutSession,
    openCustomerPortal,
    createAIAddonCheckout,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export default SubscriptionContext;
