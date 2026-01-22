import { useState } from 'react';
import AnimatedSection from '../../components/landing/AnimatedSection';
import PricingCard from '../../components/landing/PricingCard';
import { motion } from 'framer-motion';

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const monthlyPlans = [
    {
      name: 'Starter',
      price: 25,
      features: [
        'Custom web solutions',
        'Secure data storage',
        'User-first interface',
        'Agile project launch'
      ],
      recommended: false,
      delay: 0.1
    },
    {
      name: 'Professional',
      price: 50,
      features: [
        'Advanced web features',
        'Team collaboration',
        'Priority live support',
        'API and integration'
      ],
      recommended: true,
      delay: 0.2
    },
    {
      name: 'Advanced',
      price: 500,
      features: [
        'Enterprise-grade tools',
        'Custom workflow setup',
        'Full data encryption',
        'Premium onboarding help'
      ],
      recommended: false,
      delay: 0.3
    }
  ];

  const yearlyPlans = [
    {
      name: 'Starter',
      price: 30,
      features: [
        'Essential tools included',
        'Secure app hosting',
        'Responsive web design',
        'Standard email support'
      ],
      recommended: false,
      delay: 0.1
    },
    {
      name: 'Professional',
      price: 65,
      features: [
        'Expanded feature set',
        'Team access controls',
        'Advanced support line',
        'Data analytics tools'
      ],
      recommended: true,
      delay: 0.2
    },
    {
      name: 'Advanced',
      price: 650,
      features: [
        'Full enterprise package',
        'Custom admin panels',
        'Advanced data security',
        'Premium launch support'
      ],
      recommended: false,
      delay: 0.3
    }
  ];

  const plans = billingPeriod === 'monthly' ? monthlyPlans : yearlyPlans;

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <AnimatedSection delay={0} className="text-center mb-8">
          <h6 className="font-heading text-[19px] font-medium text-[var(--landing-text-meta)] mb-4">
            Pricing plans
          </h6>
          <h1 className="font-heading text-[57px] font-medium leading-[1.105] tracking-[-0.02em] text-[var(--landing-text-primary)]">
            Choose a plan that fits your goals
          </h1>
        </AnimatedSection>

        {/* Billing Period Switcher */}
        <AnimatedSection delay={0.1} className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-[var(--landing-bg-secondary)] border border-[var(--landing-border)] rounded-[30px] p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-8 py-3 rounded-[30px] font-heading font-medium transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-[var(--landing-primary)] text-white'
                  : 'text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-8 py-3 rounded-[30px] font-heading font-medium transition-all duration-300 ${
                billingPeriod === 'yearly'
                  ? 'bg-[var(--landing-primary)] text-white'
                  : 'text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)]'
              }`}
            >
              Yearly
            </button>
          </div>
        </AnimatedSection>

        {/* Pricing Cards */}
        <motion.div
          key={billingPeriod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedSection stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                name={plan.name}
                price={plan.price}
                period={billingPeriod === 'monthly' ? 'month' : 'year'}
                features={plan.features}
                recommended={plan.recommended}
                delay={plan.delay}
                ctaLink="#pricing"
              />
            ))}
          </AnimatedSection>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
