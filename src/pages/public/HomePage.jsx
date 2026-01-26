import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import {
  ArrowRight,
  ChevronDown,
  Upload,
  Zap,
  Send,
  BarChart3,
  Shield,
  MessageCircle,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  Star,
  Sparkles,
  FileText,
  Brain,
  Crown,
  Infinity,
  Target,
  Award,
  Layers,
  Activity,
  XCircle,
  AlertTriangle,
  Timer,
  Smartphone,
  Mail,
  Eye,
  Trophy,
  Gauge,
  ChevronRight,
  Package,
  PieChart,
  MailCheck,
  MousePointerClick,
  Calendar,
} from 'lucide-react';

// ============================================
// DESIGN TOKENS - Matching DriverPreviewModal.jsx
// ============================================
const colors = {
  indigo: '#6366F1',
  violet: '#8B5CF6',
  pink: '#EC4899',
  emerald: '#6EE7B7',
  amber: '#FCD34D',
  lavender: '#C4B5FD',
  rose: '#FCA5A5',
  cyan: '#22D3EE',
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
};

// ============================================
// ANIMATED BACKGROUND - Premium Dark Theme
// ============================================
const PremiumBackground = ({ variant = 'hero' }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep cosmic base */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-[#0c0a1d] to-slate-950" />

      {/* Animated gradient orbs */}
      <div className="absolute -top-[40%] -left-[20%] w-200 h-[800px] rounded-full bg-linear-to-br from-indigo-600/30 to-violet-600/10 blur-[120px] animate-mesh-1" />
      <div className="absolute top-[20%] -right-[15%] w-200 h-[600px] rounded-full bg-linear-to-br from-violet-600/25 to-fuchsia-600/10 blur-[100px] animate-mesh-2" />
      <div className="absolute -bottom-[30%] left-[20%] w-175 h-[700px] rounded-full bg-linear-to-br from-indigo-500/20 to-cyan-500/5 blur-[110px] animate-mesh-3" />

      {variant === 'hero' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-linear-to-br from-pink-500/15 to-rose-500/5 blur-[80px] animate-pulse-glow" />
      )}

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

// ============================================
// GLASS CARD COMPONENT
// ============================================
const GlassCard = ({ children, className = '', hover = true, glow = false }) => (
  <div
    className={`
      relative rounded-2xl overflow-hidden
      bg-white dark:bg-white/4 backdrop-blur-xl
      border border-slate-200 dark:border-white/8
      shadow-lg dark:shadow-none
      ${hover ? 'transition-all duration-500 hover:bg-slate-50 dark:hover:bg-white/8 hover:border-slate-300 dark:hover:border-white/15 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10' : ''}
      ${glow ? 'shadow-lg shadow-indigo-500/10' : ''}
      ${className}
    `}
  >
    <div className="absolute inset-0 bg-linear-to-br from-slate-100/50 dark:from-white/5 via-transparent to-transparent pointer-events-none" />
    {children}
  </div>
);

// ============================================
// GRADIENT BORDER CARD
// ============================================
const GradientBorderCard = ({ children, className = '' }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-px bg-linear-to-r from-indigo-500/50 via-violet-500/50 to-pink-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
    <div className="absolute -inset-px bg-linear-to-r from-indigo-500/30 via-violet-500/30 to-pink-500/30 rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
    <div className="relative bg-white dark:bg-linear-to-br dark:from-slate-900/95 dark:to-slate-800/95 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden backdrop-blur-sm shadow-lg dark:shadow-none">
      {children}
    </div>
  </div>
);

// ============================================
// ANIMATED COUNTER
// ============================================
const AnimatedCounter = ({ end, suffix = '', prefix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, end, decimals]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}{suffix}
    </span>
  );
};

// ============================================
// SECTION WRAPPER WITH ANIMATION
// ============================================
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// HERO SECTION
// ============================================
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero-specific animated background */}
      <div className="absolute inset-0 z-0">
        {/* Animated grid with perspective */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.8) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Floating gradient orbs - more subtle in light mode */}
        <div className="absolute top-1/4 left-1/4 w-150 h-150 rounded-full bg-linear-to-br from-indigo-500/10 dark:from-indigo-500/25 to-transparent blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-125 h-125 rounded-full bg-linear-to-br from-violet-500/10 dark:from-violet-500/20 to-transparent blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-100 h-100 rounded-full bg-linear-to-br from-pink-500/10 dark:from-pink-500/15 to-transparent blur-[100px]" />

        {/* Center spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_60%)]" />

        {/* Top radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15)_0%,transparent_60%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 mb-8">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">
              Trusted by 200+ DSPs
            </span>
          </div>

          {/* Main Headline */}
          <div className="relative mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              <span className="text-slate-900 dark:text-white">Turn Scorecard Data into</span>
              <br />
              <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
                Driver Excellence
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
            The complete performance management platform for Delivery Service Partners.
            Upload your reports, generate beautiful scorecards, and deliver
            <span className="text-indigo-600 dark:text-indigo-300 font-medium"> AI-powered coaching</span> to every driver.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link to="/sign-up">
              <button className="group relative px-8 py-4 rounded-xl font-bold text-white text-lg overflow-hidden shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500" />
                <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Start 30-Day Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <Link to="/contact" className="group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-slate-700 dark:text-white text-lg border border-slate-300 dark:border-white/20 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                <Calendar className="w-4 h-4 text-slate-700 dark:text-white" />
              </div>
              Book a Demo Session
            </Link>
          </div>

          {/* Quick stats */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-2 rounded-2xl bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
            {[
              { label: '50K+ Drivers', icon: Users, color: 'indigo' },
              { label: '35% Boost', icon: TrendingUp, color: 'emerald' },
              { label: '4.9/5 Rating', icon: Star, color: 'amber' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]"
              >
                <item.icon className={`w-4 h-4 ${
                  item.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                  item.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                  'text-amber-600 dark:text-amber-400'
                }`} />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent pointer-events-none" />
    </section>
  );
};

// ============================================
// KEY FEATURES SECTION - Infinite Scroll
// ============================================
const TrustedBySection = () => {
  const features = [
    { icon: Upload, label: 'Easy Report Upload' },
    { icon: Brain, label: 'AI-Powered Analysis' },
    { icon: Send, label: 'Automated Coaching' },
    { icon: BarChart3, label: 'Performance Tracking' },
    { icon: Smartphone, label: 'Driver Mobile Access' },
    { icon: TrendingUp, label: 'Trend Insights' },
    { icon: Target, label: 'Goal Setting' },
    { icon: Mail, label: 'Email Reports' },
  ];

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      {/* Top border with accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-slate-200 dark:bg-white/6" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* Bottom border with accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200 dark:bg-white/6" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="relative z-10 w-full">
        <AnimatedSection>
          <p className="text-center text-xs text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 font-medium">
            Everything you need to manage driver performance
          </p>

          {/* Infinite scrolling features */}
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee gap-6 items-center">
              {[...features, ...features].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 whitespace-nowrap group hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
};

// ============================================
// SOLUTION SECTION - With DiveMetric
// ============================================
const ProblemSolutionSection = () => {
  const stats = [
    { value: '15', unit: 'min', label: 'Weekly management time' },
    { value: '35', unit: '%', label: 'Average performance boost' },
    { value: '6', unit: '+', label: 'Report types processed' },
  ];

  const checklistItems = [
    'One upload processes all report types instantly',
    'AI generates personalized coaching for each driver',
    'Drivers get mobile scorecards via SMS & Email',
    'Severity alerts highlight who needs attention',
    'Track trends and maintain Fantastic+ status',
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Stats Showcase */}
          <AnimatedSection>
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60" />

              <div className="relative bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-white/10 p-8 sm:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 mb-6">
                  <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">With DiveMetric</span>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-4xl sm:text-5xl font-black bg-linear-to-br from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
                          {stat.value}
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {stat.unit}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                {/* Mini visual */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Performance Tracking</p>
                      <p className="text-xs text-slate-500">Real-time driver insights</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-linear-to-t from-indigo-500 to-violet-500"
                        style={{ height: `${h * 0.4}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right - Content & Checklist */}
          <AnimatedSection delay={0.2}>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                Stop chasing data.
                <br />
                <span className="bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  Start leading.
                </span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                DiveMetric transforms hours of manual work into minutes of actionable insights.
              </p>

              {/* Checklist */}
              <div className="space-y-4">
                {checklistItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-10">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FEATURES SECTION - PREMIUM BENTO GRID
// ============================================
const FeaturesSection = () => {
  // File type pills for upload card
  const fileTypes = [
    { name: 'CSV', color: '#6EE7B7' },
    { name: 'PDF', color: '#F87171' },
    { name: 'XLSX', color: '#60A5FA' },
  ];

  // Supported reports for upload card
  const supportedReports = [
    'DSP Scorecard',
    'Weekly Overview',
    '6-Week Trailing',
    'Customer Feedback',
    'POD Quality',
    'PPS Daily',
    'DVIC Report',
  ];

  // Mock metrics for scorecard preview
  const mockMetrics = [
    { label: 'Safety', value: 98, color: '#6EE7B7' },
    { label: 'Delivery', value: 94, color: '#A5B4FC' },
    { label: 'Customer', value: 96, color: '#C4B5FD' },
  ];

  // Distribution channels
  const channels = [
    { icon: Smartphone, label: 'SMS', sent: '2,847', color: '#6EE7B7' },
    { icon: Mail, label: 'Email', sent: '1,523', color: '#A5B4FC' },
  ];

  return (
    <section id="features" className="relative py-28 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-linear-to-r dark:from-indigo-500/10 dark:to-violet-500/10 border border-indigo-200 dark:border-indigo-500/20 mb-6 shadow-lg shadow-indigo-500/5">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Platform Capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            The Complete DSP
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
              Performance Suite
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Six powerful tools working together to transform how you manage driver performance
          </p>
        </AnimatedSection>

        {/* Premium Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 auto-rows-[180px]">

          {/* Card 1: Multi-Format Upload - Large */}
          <AnimatedSection delay={0.1} className="lg:col-span-7 lg:row-span-2">
            <div className="relative h-full rounded-2xl bg-white dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 shadow-lg dark:shadow-none">
              {/* Background glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="relative h-full p-8 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Data Import</h3>
                        <p className="text-sm text-slate-500">Multi-format processing</p>
                      </div>
                    </div>
                  </div>
                  {/* File type badges */}
                  <div className="flex gap-2">
                    {fileTypes.map((type, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: `${type.color}15`,
                          color: type.color,
                          border: `1px solid ${type.color}30`
                        }}
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Upload zone mockup */}
                <div className="flex-1 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/5 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-200 dark:bg-slate-700/50 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                      <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-sm text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                      Drop your Scorecard reports here
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-xs mx-auto">
                      {supportedReports.slice(0, 4).map((report, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-200 dark:bg-slate-700/50 rounded text-[10px] text-slate-600 dark:text-slate-500">
                          {report}
                        </span>
                      ))}
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-slate-700/50 rounded text-[10px] text-emerald-600 dark:text-emerald-400">
                        +3 more
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Card 2: Unified Scorecards */}
          <AnimatedSection delay={0.15} className="lg:col-span-5 lg:row-span-2">
            <div className="relative h-full rounded-2xl bg-white dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-lg dark:shadow-none">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="relative h-full p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unified Scorecards</h3>
                    <p className="text-xs text-slate-500">20+ metrics merged</p>
                  </div>
                </div>

                {/* Mini scorecard preview */}
                <div className="flex-1 rounded-xl bg-linear-to-br from-indigo-950/80 to-violet-950/80 border border-indigo-500/20 p-4 overflow-hidden">
                  {/* Mini profile header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-white/90 flex items-center justify-center text-sm font-bold text-indigo-700">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">John Driver</div>
                      <div className="text-[10px] text-indigo-300/70">Rank #3 of 47</div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/20 rounded text-[10px] font-bold text-emerald-400">
                      Fantastic
                    </span>
                  </div>

                  {/* Metric bars */}
                  <div className="space-y-3">
                    {mockMetrics.map((metric, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-600 dark:text-slate-400">{metric.label}</span>
                          <span style={{ color: metric.color }} className="font-bold">{metric.value}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: metric.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Score badge */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Overall Score</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">94.2</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Card 3: AI Coaching */}
          <AnimatedSection delay={0.2} className="lg:col-span-4">
            <div className="relative h-full rounded-2xl bg-white dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden group hover:border-violet-500/30 transition-all duration-500">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="relative h-full p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Coaching</h3>
                    <p className="text-[10px] text-slate-500">Powered by Grok</p>
                  </div>
                </div>

                {/* AI message bubble */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="relative bg-linear-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-500/20">
                    <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-violet-400" />
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      &quot;Great safety this week! Focus on reducing DNR rate by double-checking addresses before delivery.&quot;
                    </p>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-violet-500/20">
                      <div className="w-4 h-4 rounded bg-linear-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-[9px] text-violet-400 font-medium">AI Generated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Card 4: Distribution */}
          <AnimatedSection delay={0.25} className="lg:col-span-4">
            <div className="relative h-full rounded-2xl bg-white dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="relative h-full p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">One-Click Send</h3>
                    <p className="text-[10px] text-slate-500">SMS & Email</p>
                  </div>
                </div>

                {/* Channel stats */}
                <div className="flex-1 flex items-center gap-3">
                  {channels.map((channel, i) => (
                    <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700/50 hover:border-amber-500/30 transition-colors">
                      <channel.icon className="w-5 h-5 mx-auto mb-2" style={{ color: channel.color }} />
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{channel.sent}</div>
                      <div className="text-[9px] text-slate-500">{channel.label} Sent</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Card 5: Engagement Tracking */}
          <AnimatedSection delay={0.3} className="lg:col-span-4">
            <div className="relative h-full rounded-2xl bg-white dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="relative h-full p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Engagement</h3>
                    <p className="text-[10px] text-slate-500">Real-time tracking</p>
                  </div>
                </div>

                {/* Engagement stats */}
                <div className="flex-1 flex items-center">
                  <div className="w-full grid grid-cols-2 gap-2">
                    <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
                      <div className="text-2xl font-black text-cyan-400">87%</div>
                      <div className="text-[9px] text-slate-500">Open Rate</div>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                      <div className="text-2xl font-black text-emerald-400">4.2k</div>
                      <div className="text-[9px] text-slate-500">Views Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Card 6: Analytics - Wide */}
          <AnimatedSection delay={0.35} className="lg:col-span-8">
            <div className="relative h-full rounded-2xl bg-white dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden group hover:border-pink-500/30 transition-all duration-500">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="relative h-full p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Analytics Dashboard</h3>
                      <p className="text-[10px] text-slate-500">DSP-wide performance insights</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-500">Live</span>
                  </div>
                </div>

                {/* Mini chart visualization */}
                <div className="flex-1 flex items-end gap-1 px-2">
                  {[65, 72, 58, 81, 76, 89, 92, 85, 78, 94, 88, 91].map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${value}%` }}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
                      className="flex-1 rounded-t-sm"
                      style={{
                        background: `linear-gradient(to top, ${i >= 10 ? '#EC4899' : i >= 8 ? '#A855F7' : '#6366F1'}, transparent)`
                      }}
                    />
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">47</span>
                      <span className="text-[10px] text-slate-500 ml-1">Drivers</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-emerald-400">92%</span>
                      <span className="text-[10px] text-slate-500 ml-1">Fantastic+</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-pink-400">+12%</span>
                      <span className="text-[10px] text-slate-500 ml-1">vs Last Week</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Card 7: Tier Tracking */}
          <AnimatedSection delay={0.4} className="lg:col-span-4">
            <div className="relative h-full rounded-2xl bg-white dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="relative h-full p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Tier Status</h3>
                    <p className="text-[10px] text-slate-500">Real-time standings</p>
                  </div>
                </div>

                {/* Tier distribution mini */}
                <div className="flex-1 flex items-center gap-2">
                  {[
                    { tier: 'F+', count: 18, color: '#10B981' },
                    { tier: 'F', count: 12, color: '#6EE7B7' },
                    { tier: 'G', count: 9, color: '#FCD34D' },
                    { tier: 'Fair', count: 5, color: '#F97316' },
                  ].map((item, i) => (
                    <div key={i} className="flex-1 text-center">
                      <div
                        className="w-full h-16 rounded-lg flex items-end justify-center pb-2 mb-1"
                        style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
                      >
                        <span className="text-lg font-bold" style={{ color: item.color }}>{item.count}</span>
                      </div>
                      <span className="text-[9px] text-slate-500">{item.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
};

// ============================================
// HOW IT WORKS SECTION
// ============================================
const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Reports',
      description: 'Drag and drop your Scorecard reports - we support all major formats including scorecards, weekly overviews, and feedback reports.',
      icon: Upload,
      color: '#6EE7B7',
    },
    {
      step: '02',
      title: 'Auto-Generate Scorecards',
      description: 'Our tool parses and merges data from all sources, creating unified driver scorecards with rankings and tier standings.',
      icon: Zap,
      color: '#FCD34D',
    },
    {
      step: '03',
      title: 'Enable AI Coaching',
      description: 'Use AI-powered suggestions or write your own personalized feedback for each driver based on their metrics.',
      icon: Brain,
      color: '#C4B5FD',
    },
    {
      step: '04',
      title: 'Distribute & Track',
      description: 'Send scorecards via SMS or email with one click. Track opens and engagement in real-time.',
      icon: Send,
      color: '#A5B4FC',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 mb-6">
            <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            From Raw Data to Insights
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
              In Minutes
            </span>
          </h2>
        </AnimatedSection>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-linear-to-r from-emerald-500/20 via-amber-500/20 via-violet-500/20 to-indigo-500/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <GlassCard className="p-6 text-center h-full">
                  <div className="relative inline-block mb-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}25, ${item.color}08)`,
                        border: `2px solid ${item.color}40`,
                      }}
                    >
                      <item.icon className="w-8 h-8" style={{ color: item.color }} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`,
                        color: '#0F0A1F',
                      }}
                    >
                      {item.step}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// BENEFITS SECTION
// ============================================
const BenefitsSection = () => {
  const benefits = [
    {
      icon: Trophy,
      title: 'Earn More',
      subtitle: 'Maximize Your Bonus Potential',
      description: 'Keep your DSP at Fantastic+ status to earn maximum Scorecard bonuses. Our clients see an average 35% improvement in overall performance scores.',
      metric: '35%',
      metricLabel: 'Avg. Performance Boost',
      color: '#FCD34D',
    },
    {
      icon: Clock,
      title: 'Save Time',
      subtitle: 'Eliminate Manual Work',
      description: 'What used to take 4+ hours every week now takes 15 minutes. Upload, generate, and distribute scorecards to your entire team instantly.',
      metric: '4hrs',
      metricLabel: 'Saved Weekly',
      color: '#6EE7B7',
    },
    {
      icon: Users,
      title: 'Lower Attrition',
      subtitle: 'Keep Your Best Drivers',
      description: 'Proactive coaching helps drivers succeed. DSPs using DiveMetric report 40% better driver retention through transparent performance feedback.',
      metric: '40%',
      metricLabel: 'Better Retention',
      color: '#A5B4FC',
    },
  ];

  return (
    <section id="benefits" className="relative py-24 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-6">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Proven Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Real Benefits for
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
              Real DSP Operations
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <GradientBorderCard className="h-full">
                <div className="p-8 h-full flex flex-col">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${benefit.color}25, ${benefit.color}08)`,
                      border: `1px solid ${benefit.color}40`,
                    }}
                  >
                    <benefit.icon className="w-7 h-7" style={{ color: benefit.color }} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm font-medium mb-4" style={{ color: benefit.color }}>{benefit.subtitle}</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-1 mb-6">{benefit.description}</p>

                  <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                    <div className="text-4xl font-black mb-1" style={{ color: benefit.color }}>
                      {benefit.metric}
                    </div>
                    <div className="text-sm text-slate-500">{benefit.metricLabel}</div>
                  </div>
                </div>
              </GradientBorderCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// METRICS SHOWCASE (SCORECARD PREVIEW)
// ============================================
const MetricsShowcase = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 mb-6">
              <Gauge className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span className="text-sm font-semibold text-pink-700 dark:text-pink-300">Comprehensive Metrics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Every Metric That Matters,
              <br />
              <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
                Beautifully Unified
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              DiveMetric consolidates data from multiple Scorecard reports into beautiful,
              mobile-optimized scorecards that drivers actually want to read.
            </p>

            <div className="space-y-3">
              {[
                { text: 'DSP Scorecard metrics and tier standings', icon: Award },
                { text: '6-week trailing averages for trend analysis', icon: Activity },
                { text: 'Customer feedback with detailed breakdowns', icon: MessageCircle },
                { text: 'Photo-on-delivery quality metrics', icon: FileText },
                { text: 'DVIC inspection compliance tracking', icon: Shield },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/[0.06] hover:border-indigo-500/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-violet-500/30 transition-colors">
                    <item.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Right - Scorecard Preview */}
          <AnimatedSection delay={0.2}>
            <GradientBorderCard>
              <div className="p-6">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-black bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">DiveMetric</span>
                  <span className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                    Week 4, 2025
                  </span>
                </div>

                {/* Profile Section - Like DriverPreviewModal */}
                <div
                  className="rounded-xl p-5 mb-5 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)'
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center text-base font-black text-indigo-700">
                        JD
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-slate-900 dark:text-white">John Driver</div>
                        <div className="text-xs text-indigo-200/70">ID: DRV-12345</div>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-xs font-bold text-emerald-300 border border-emerald-400/30">
                        Fantastic
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Rank', value: '#3', color: '#A5B4FC' },
                        { label: 'Score', value: '94.2', color: '#6EE7B7' },
                        { label: 'Packages', value: '1,847', color: '#C4B5FD' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-2 text-center border border-white/10">
                          <div className="text-lg font-bold" style={{ color: stat.color }}>
                            {stat.value}
                          </div>
                          <div className="text-[10px] text-indigo-200/70 uppercase tracking-wide font-semibold">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics Preview */}
                <div className="space-y-2">
                  {[
                    { label: 'Safety Score', value: '98.5%', color: '#6EE7B7', icon: Shield },
                    { label: 'Delivery Quality', value: '99.2%', color: '#A5B4FC', icon: Package },
                    { label: 'Customer Rating', value: '4.9/5', color: '#C4B5FD', icon: Star },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-white/[0.03] rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${metric.color}15, ${metric.color}05)`,
                            border: `1px solid ${metric.color}25`
                          }}
                        >
                          <metric.icon className="w-3.5 h-3.5" style={{ color: metric.color }} />
                        </div>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">{metric.label}</span>
                      </div>
                      <span className="font-bold" style={{ color: metric.color }}>{metric.value}</span>
                    </div>
                  ))}
                </div>

                {/* AI Coaching Preview */}
                <div className="mt-4 p-4 rounded-xl bg-linear-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-semibold text-violet-300">AI Coaching</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    &quot;Great week, John! Your safety score improved 3%. Focus on photo quality for POD to reach Fantastic+.&quot;
                  </p>
                </div>
              </div>
            </GradientBorderCard>
          </AnimatedSection>
        </div>

        {/* View Sample Scorecard Button */}
        <AnimatedSection delay={0.3} className="mt-12 text-center">
          <Link to="/sample-scorecard">
            <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg overflow-hidden shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500" />
              <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-3">
                <Eye className="w-5 h-5" />
                View Sample Scorecard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            See how a driver scorecard looks with AI coaching insights
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// TESTIMONIALS SECTION
// ============================================
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "DiveMetric transformed how we communicate performance to our drivers. The AI coaching notes save us hours every week and drivers actually read their scorecards now.",
      company: "DSP-California",
      metric: "40% more engagement",
    },
    {
      quote: "What used to take our team 4+ hours every week now takes 15 minutes. It's a game-changer for our 50-driver operation. We've maintained Fantastic+ for 6 months straight.",
      company: "DSP-Texas",
      metric: "4 hours saved weekly",
    },
    {
      quote: "Our driver satisfaction scores went up 35% after implementing DiveMetric. They appreciate the personalized feedback and knowing exactly where they stand.",
      company: "DSP-Florida",
      metric: "35% satisfaction increase",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-6">
            <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Customer Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Trusted by DSPs
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
In North America
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 w-fit">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">{t.metric}</span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed flex-1">&quot;{t.quote}&quot;</p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.company.split('-')[1]?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{t.company}</div>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// PRICING SECTION
// ============================================
const PricingSection = () => {
  const premiumFeatures = [
    '6-Week Trailing Report Processing',
    'PPS Daily Report Analysis',
    'DVIC Inspection Report',
    'Download PDF Scorecards',
    'SMS & Email Distribution',
    'AI-Powered Coaching Notes',
    'Engagement Tracking & Analytics',
  ];

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-6">
            <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            One Plan,
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
              Everything Included
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Start with a 30-day free trial. No credit card required.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <GradientBorderCard className="max-w-xl mx-auto">
            <div>
              {/* Header */}
              <div className="relative bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 p-8 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">30-Day Free Trial</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <span className="text-6xl font-black text-white">$24.99</span>
                    <span className="text-xl text-white/70 font-medium">/week</span>
                  </div>
                  <p className="text-white/60 text-sm">Billed weekly after trial</p>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-linear-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Premium Features</span>
                  </div>
                  <div className="space-y-2">
                    {premiumFeatures.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-2">
                        <div className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to="/sign-up">
                  <button className="w-full group relative py-4 rounded-xl font-bold text-white text-lg overflow-hidden shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow">
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500" />
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center gap-2">
                      Start Your Free Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>

                <p className="text-center text-xs text-slate-500 mt-4">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </div>
          </GradientBorderCard>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// FAQ SECTION
// ============================================
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What file formats does DiveMetric support?',
      answer: 'DiveMetric supports CSV, XLSX (Excel), and PDF files from Scorecard Privuders including DSP Scorecards, Weekly Overviews, 6-Week Trailing Reports, Customer Feedback, POD Quality, PPS Daily, and DVIC reports.',
    },
    {
      question: 'How do drivers access their scorecards?',
      answer: 'Drivers receive a unique token link via SMS or email. They simply click the link to view their mobile-optimized scorecard - no login, password, or app download required.',
    },
    {
      question: 'What is AI-powered coaching?',
      answer: "Our AI analyzes each driver's performance metrics and generates personalized improvement suggestions, highlighting strengths and providing actionable tips for areas that need attention.",
    },
    {
      question: 'How does billing work after the trial?',
      answer: "Start with a full-access 30-day free trial - no credit card needed. After the trial, you'll be billed $24.99 weekly. You can cancel anytime with no questions asked.",
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use AWS infrastructure with encryption at rest and in transit. Driver data is processed in isolated environments with token-based access controls. We never share your data.',
    },
    {
      question: 'Can I track if drivers viewed their scorecards?',
      answer: "Yes! Our engagement tracking shows you exactly when drivers open their scorecards via email or SMS, plus view counts. You'll know who's engaged and who needs follow-up.",
    },
  ];

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 mb-6">
            <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Got Questions?
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
              We Have Answers
            </span>
          </h2>
        </AnimatedSection>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <GlassCard hover={false} className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <span className="font-semibold text-slate-900 dark:text-white pr-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${openIndex === i ? 'bg-linear-to-r from-indigo-500 to-violet-500 rotate-180' : 'bg-slate-100 dark:bg-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/10'}`}>
                    <ChevronDown className="w-4 h-4 text-slate-700 dark:text-white" />
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={openIndex === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FINAL CTA SECTION
// ============================================
const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background handled by GlobalBackground */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          {/* Main CTA Card */}
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-[2rem] blur-xl opacity-30 animate-pulse-glow" />
            <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-[2rem] opacity-50" />

            {/* Card content */}
            <div className="relative bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 rounded-[2rem] overflow-hidden">
              {/* Inner gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-violet-500/5 to-pink-500/10" />

              {/* Animated background orbs */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-mesh-1" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] animate-mesh-2" />

              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />

              <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">Limited Time: 30-Day Free Trial</span>
                </div>

                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                  Ready to Transform
                  <br />
                  <span className="bg-linear-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                    Your DSP?
                  </span>
                </h2>

                <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Join <span className="text-white font-semibold">200+ DSPs</span> already using DiveMetric to boost driver performance and maximize bonuses.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                  <Link to="/sign-up">
                    <button className="group relative px-10 py-5 rounded-2xl font-bold text-white text-xl overflow-hidden shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-500 hover:scale-105">
                      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500" />
                      <div className="absolute inset-0 bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.25),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative flex items-center gap-3">
                        <Sparkles className="w-6 h-6" />
                        Start Free Trial
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </Link>
                  <Link to="/contact" className="group flex items-center gap-3 px-8 py-5 rounded-2xl font-semibold text-white text-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                    <Calendar className="w-5 h-5 text-white" />
                    Book a Demo
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Setup in under 5 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// GLOBAL UNIFIED BACKGROUND
// ============================================
const GlobalBackground = () => (
  <div className="fixed inset-0 pointer-events-none -z-10">
    {/* Light mode base */}
    <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-[#0c0a1d] dark:to-slate-950" />

    {/* Large ambient orbs - more subtle in light mode, vibrant in dark */}
    <div className="absolute top-0 left-1/4 w-250 h-250 rounded-full bg-linear-to-br from-indigo-400/10 dark:from-indigo-600/20 to-transparent blur-[150px]" />
    <div className="absolute top-[30%] right-0 w-200 h-200 rounded-full bg-linear-to-br from-violet-400/8 dark:from-violet-600/15 to-transparent blur-[120px]" />
    <div className="absolute top-[60%] left-0 w-225 h-225 rounded-full bg-linear-to-br from-indigo-400/8 dark:from-indigo-500/15 to-transparent blur-[130px]" />
    <div className="absolute bottom-0 right-1/4 w-175 h-175 rounded-full bg-linear-to-br from-pink-400/8 dark:from-pink-500/10 to-transparent blur-[100px]" />

    {/* Subtle grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />

    {/* Noise texture */}
    <div
      className="absolute inset-0 opacity-[0.01] dark:opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  </div>
);

// ============================================
// MAIN HOME PAGE
// ============================================
const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden relative isolate">
      {/* Single unified background for entire page */}
      <GlobalBackground />

      <Header />
      <main className="relative z-10">
        <HeroSection />
        <TrustedBySection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <MetricsShowcase />
        <BenefitsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
