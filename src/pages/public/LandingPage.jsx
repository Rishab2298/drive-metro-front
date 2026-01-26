import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
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
  Play,
  FileText,
  Brain,
  Crown,
  Infinity,
  Target,
  Award,
  Layers,
  Activity,
} from 'lucide-react';

// ============================================
// ANIMATED GRID BACKGROUND WITH GLOWING INTERSECTIONS
// ============================================
const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Glowing intersection dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 0%, transparent 2px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Animated scanning line */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute h-px w-full bg-linear-to-r from-transparent via-indigo-500/50 to-transparent animate-grid-scan"
          style={{ top: '20%' }}
        />
        <div
          className="absolute h-px w-full bg-linear-to-r from-transparent via-violet-500/40 to-transparent animate-grid-scan-delayed"
          style={{ top: '60%' }}
        />
      </div>
    </div>
  );
};

// ============================================
// FLOATING PARTICLES
// ============================================
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-indigo-400"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// COSMIC BACKGROUND - ENHANCED
// ============================================
const CosmicBackground = ({ variant = 'hero', showGrid = true, showParticles = true }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base deep gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0F0A1F] via-[#1E1B4B] to-[#312E81]" />

      {/* Animated gradient orbs */}
      <div className="absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] rounded-full bg-linear-to-br from-indigo-600/40 to-violet-600/20 blur-[150px] animate-mesh-1" />
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-linear-to-br from-violet-600/35 to-fuchsia-600/15 blur-[120px] animate-mesh-2" />
      <div className="absolute -bottom-1/4 left-1/4 w-[900px] h-[900px] rounded-full bg-linear-to-br from-blue-600/30 to-cyan-500/10 blur-[130px] animate-mesh-3" />
      <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-linear-to-br from-pink-500/25 to-rose-500/10 blur-[100px] animate-pulse-glow" />

      {variant === 'hero' && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-linear-to-br from-indigo-500/20 to-violet-500/10 blur-[80px] animate-mesh-4" />
        </>
      )}

      {/* Radial glow from center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2)_0%,transparent_60%)]" />

      {/* Top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern */}
      {showGrid && <AnimatedGrid />}

      {/* Floating particles */}
      {showParticles && <FloatingParticles />}
    </div>
  );
};

// ============================================
// GLASS CARD COMPONENT - ENHANCED
// ============================================
const GlassCard = ({ children, className = '', hover = true, glow = false, gradient = false }) => (
  <div
    className={`
      relative rounded-2xl overflow-hidden
      bg-white/[0.06] backdrop-blur-xl
      border border-white/[0.1]
      ${hover ? 'transition-all duration-500 hover:bg-white/[0.1] hover:border-white/[0.2] hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20' : ''}
      ${glow ? 'shadow-lg shadow-indigo-500/20' : ''}
      ${className}
    `}
  >
    {/* Gradient border effect */}
    {gradient && (
      <div className="absolute inset-0 rounded-2xl p-px bg-linear-to-br from-indigo-500/50 via-violet-500/30 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    )}
    {/* Inner shine */}
    <div className="absolute inset-0 bg-linear-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
    {children}
  </div>
);

// ============================================
// GRADIENT BORDER CARD - ENHANCED
// ============================================
const GradientBorderCard = ({ children, className = '', animated = true }) => (
  <div className={`relative group ${className}`}>
    {/* Animated gradient border */}
    {animated && (
      <>
        <div className="absolute -inset-[2px] bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 animate-gradient-xy" />
        <div className="absolute -inset-[1px] bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-gradient-xy" />
      </>
    )}

    {/* Card content */}
    <div className="relative bg-linear-to-br from-[#1E1B4B]/90 to-[#312E81]/90 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible, end, decimals]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}{suffix}
    </span>
  );
};

// ============================================
// HEADER COMPONENT
// ============================================
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-4 md:mx-8 transition-all duration-500 rounded-2xl ${
        isScrolled
          ? 'bg-[#0F0A1F]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-indigo-500/10'
          : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                <div className="relative bg-linear-to-br from-indigo-500 via-violet-500 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
                DiveMetric
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-indigo-200/70 hover:text-white transition-colors duration-300 group"
                >
                  <span className="relative z-10">{link.name}</span>
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-violet-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-violet-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/sign-in">
                <button className="px-5 py-2.5 text-sm font-medium text-indigo-200/70 hover:text-white transition-colors rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
                  Sign In
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="group relative px-6 py-2.5 rounded-xl font-semibold text-white text-sm overflow-hidden shadow-lg shadow-indigo-500/25">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-300" />
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_60%)]" />
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-indigo-200 hover:bg-white/10 transition-all"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mx-4 mt-2 p-4 bg-[#0F0A1F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-indigo-200/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
            <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full py-3 text-sm font-medium text-indigo-200/70 hover:text-white rounded-xl hover:bg-white/5 transition-all">
                Sign In
              </button>
            </Link>
            <Link to="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 shadow-lg shadow-indigo-500/25">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================
// HERO SECTION - ENHANCED
// ============================================
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CosmicBackground variant="hero" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-linear-to-r from-indigo-500/10 to-violet-500/10 backdrop-blur-sm border border-indigo-500/20 mb-8 animate-fade-in-up shadow-lg shadow-indigo-500/10">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </div>
            <span className="text-sm font-semibold bg-linear-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">
              30-Day Free Trial — No Credit Card Required
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-8 tracking-tight">
            <span className="block text-white animate-fade-in-up drop-shadow-2xl" style={{ animationDelay: '0.1s' }}>
              Elevate Driver
            </span>
            <span
              className="block bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent animate-fade-in-up animate-gradient-x"
              style={{ animationDelay: '0.2s', backgroundSize: '200% 200%' }}
            >
              Performance
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-indigo-200/80 mb-14 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Transform raw delivery data into beautiful, actionable scorecards with{' '}
            <span className="font-semibold text-transparent bg-clip-text bg-linear-to-r from-[#A5B4FC] to-[#C4B5FD]">AI-powered insights</span>.
            The smartest way to manage your DSP.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/sign-up">
              <button className="group relative px-10 py-5 rounded-2xl font-bold text-white text-lg overflow-hidden shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-shadow duration-500">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 animate-gradient-x" style={{ backgroundSize: '200% 200%' }} />
                <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_60%)]" />
                <span className="relative flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <button className="group relative px-8 py-5 rounded-2xl font-semibold text-white text-lg overflow-hidden border border-white/20 hover:border-indigo-500/50 transition-all duration-500 hover:bg-white/5">
              <span className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
                Watch Demo
              </span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {[
              { value: 50000, suffix: '+', label: 'Drivers Tracked', icon: Users, color: '#A5B4FC' },
              { value: 2, suffix: 'M+', label: 'Scorecards Generated', icon: FileText, color: '#C4B5FD' },
              { value: 35, suffix: '%', label: 'Performance Boost', icon: TrendingUp, color: '#6EE7B7' },
              { value: 99.9, suffix: '%', label: 'Uptime Guarantee', icon: Shield, color: '#FCD34D', decimals: 1 },
            ].map((stat, i) => (
              <GlassCard key={i} className="p-6 text-center group" glow>
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                    border: `1px solid ${stat.color}30`,
                    boxShadow: `0 0 30px ${stat.color}20`
                  }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{ color: stat.color, textShadow: `0 0 40px ${stat.color}50` }}
                >
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </div>
                <div className="text-sm text-indigo-200/60 font-medium">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-xs text-indigo-300/50 uppercase tracking-widest font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-indigo-400/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-linear-to-b from-indigo-400 to-violet-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FEATURES SECTION - BENTO GRID
// ============================================
const FeaturesSection = () => {
  const features = [
    {
      icon: Upload,
      title: 'Multi-Format Upload',
      description: 'Drag and drop CSVs, PDFs, and Excel files. Our intelligent parsers handle DSP Scorecards, Weekly Overviews, Customer Feedback, and more.',
      color: '#6EE7B7',
      size: 'large',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Serverless processing transforms documents into unified scorecards in seconds.',
      color: '#FCD34D',
      size: 'small',
    },
    {
      icon: Brain,
      title: 'AI Coaching',
      description: 'Personalized improvement suggestions powered by cutting-edge AI.',
      color: '#C4B5FD',
      size: 'small',
    },
    {
      icon: Send,
      title: 'Smart Distribution',
      description: 'One-click delivery via SMS and email with read receipts and engagement analytics.',
      color: '#A5B4FC',
      size: 'medium',
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Track trends and DSP-wide statistics with powerful visualizations.',
      color: '#F9A8D4',
      size: 'medium',
    },
  ];

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <CosmicBackground variant="section" showParticles={false} />

      {/* Section divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-indigo-500/60 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-linear-to-b from-indigo-500/10 to-transparent blur-2xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-linear-to-r from-indigo-500/10 to-violet-500/10 backdrop-blur-sm border border-indigo-500/20 mb-8 shadow-lg shadow-indigo-500/10">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-300">Powerful Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Everything you need,<br />
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              nothing you don&apos;t
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-indigo-200/70">
            A complete toolkit for managing driver performance, from upload to insight delivery.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[220px]">
          {features.map((feature, i) => (
            <GradientBorderCard
              key={i}
              className={`group cursor-pointer
                ${feature.size === 'large' ? 'lg:col-span-2 lg:row-span-2' : ''}
                ${feature.size === 'medium' ? 'lg:col-span-2' : ''}
              `}
            >
              <div className="h-full p-8 flex flex-col relative overflow-hidden">
                {/* Background glow */}
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ background: feature.color }}
                />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}25, ${feature.color}10)`,
                    border: `1px solid ${feature.color}40`,
                    boxShadow: `0 0 30px ${feature.color}20`
                  }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-indigo-200 transition-all duration-300">{feature.title}</h3>
                <p className="text-indigo-200/70 leading-relaxed flex-1">{feature.description}</p>

                {/* Hover hint */}
                <div className="flex items-center gap-2 text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: feature.color }}>
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </GradientBorderCard>
          ))}
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
    { step: '01', title: 'Upload', description: 'Drag and drop your reports', icon: Upload, color: '#6EE7B7' },
    { step: '02', title: 'Process', description: 'AI parses and merges data', icon: Zap, color: '#FCD34D' },
    { step: '03', title: 'Customize', description: 'Add coaching notes', icon: FileText, color: '#C4B5FD' },
    { step: '04', title: 'Distribute', description: 'Send via SMS/Email', icon: Send, color: '#A5B4FC' },
  ];

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <CosmicBackground variant="section" showParticles={false} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-linear-to-r from-violet-500/10 to-pink-500/10 backdrop-blur-sm border border-violet-500/20 mb-8 shadow-lg shadow-violet-500/10">
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-violet-300">Simple Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            From data to insight<br />
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              in minutes
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2">
            <div className="w-full h-1 bg-linear-to-r from-[#6EE7B7]/30 via-[#FCD34D]/30 via-[#C4B5FD]/30 to-[#A5B4FC]/30 rounded-full" />
            <div className="absolute inset-0 w-full h-1 bg-linear-to-r from-[#6EE7B7] via-[#FCD34D] via-[#C4B5FD] to-[#A5B4FC] rounded-full opacity-50 blur-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <div key={i} className="relative group">
                <GlassCard className="p-8 text-center h-full" glow>
                  {/* Step Circle */}
                  <div className="relative inline-block mb-8">
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}30, ${item.color}10)`,
                        border: `2px solid ${item.color}50`,
                        boxShadow: `0 0 50px ${item.color}30`
                      }}
                    >
                      <item.icon className="w-10 h-10" style={{ color: item.color }} />
                    </div>
                    {/* Step Number */}
                    <div
                      className="absolute -top-3 -right-3 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`,
                        color: '#0F0A1F',
                      }}
                    >
                      {item.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-indigo-200/70">{item.description}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// METRICS SHOWCASE SECTION
// ============================================
const MetricsShowcase = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <CosmicBackground variant="section" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-linear-to-r from-pink-500/10 to-rose-500/10 backdrop-blur-sm border border-pink-500/20 mb-8 shadow-lg shadow-pink-500/10">
              <BarChart3 className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-semibold text-pink-300">Comprehensive Metrics</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              Every metric that<br />
              <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                matters, unified
              </span>
            </h2>
            <p className="text-lg text-indigo-200/70 mb-10 leading-relaxed">
              DiveMetric consolidates data from multiple Amazon reports into beautiful, unified scorecards.
            </p>

            <div className="space-y-4">
              {[
                { text: 'DSP Scorecard metrics and tier standings', icon: Award },
                { text: '6-week trailing averages for trend analysis', icon: Activity },
                { text: 'Customer feedback with detailed breakdowns', icon: MessageCircle },
                { text: 'Photo-on-delivery quality metrics', icon: FileText },
                { text: 'DVIC inspection compliance tracking', icon: Shield },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-indigo-100 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Preview Card */}
          <GradientBorderCard>
            <div className="p-8">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl font-black bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">DiveMetric</span>
                <span className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-semibold text-indigo-200 border border-white/10">
                  Week 24, 2024
                </span>
              </div>

              {/* Profile Section - Like DriverPreviewModal */}
              <div
                className="rounded-2xl p-6 mb-6 relative overflow-hidden shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)',
                }}
              >
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)'
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-xl bg-linear-to-br from-white/95 to-slate-100/90 flex items-center justify-center text-xl font-black text-indigo-700 shadow-xl border-2 border-white/30">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-bold text-white">John Driver</div>
                      <div className="text-sm text-indigo-200/70">ID: DRV-12345</div>
                    </div>
                    <span className="px-4 py-2 bg-linear-to-r from-emerald-500/20 to-emerald-400/20 backdrop-blur-md rounded-full text-sm font-bold text-emerald-300 border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
                      Fantastic
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Rank', value: '#3', color: '#A5B4FC' },
                      { label: 'Score', value: '94.2', color: '#6EE7B7' },
                      { label: 'Packages', value: '1,847', color: '#C4B5FD' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl py-4 px-3 text-center border border-white/10 hover:bg-white/15 transition-colors">
                        <div
                          className="text-2xl font-black"
                          style={{ color: stat.color, textShadow: `0 0 25px ${stat.color}60` }}
                        >
                          {stat.value}
                        </div>
                        <div className="text-[10px] text-indigo-200/80 uppercase tracking-widest font-semibold mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics Preview */}
              <div className="space-y-3">
                {[
                  { label: 'Safety Score', value: '98.5%', color: '#6EE7B7', icon: Shield },
                  { label: 'Delivery Quality', value: '99.2%', color: '#A5B4FC', icon: Layers },
                  { label: 'Customer Rating', value: '4.9/5', color: '#C4B5FD', icon: Star },
                ].map((metric, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`,
                          border: `1px solid ${metric.color}30`
                        }}
                      >
                        <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                      </div>
                      <span className="text-indigo-200/70 group-hover:text-indigo-200 transition-colors">{metric.label}</span>
                    </div>
                    <span className="font-bold text-lg" style={{ color: metric.color }}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GradientBorderCard>
        </div>
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
      quote: "DiveMetric transformed how we communicate performance to our drivers. The AI coaching notes save us hours every week.",
      author: "Sarah Chen",
      role: "Operations Manager",
      company: "FastTrack DSP",
      metric: "40% more engagement",
    },
    {
      quote: "What used to take our team 4+ hours every week now takes 15 minutes. Game-changer for our 50-driver operation.",
      author: "Marcus Johnson",
      role: "DSP Owner",
      company: "Elite Delivery",
      metric: "4 hours saved weekly",
    },
    {
      quote: "Our driver satisfaction scores went up 35% after implementing DiveMetric. They appreciate the personalized feedback.",
      author: "Jennifer Martinez",
      role: "Fleet Manager",
      company: "Metro Logistics",
      metric: "35% satisfaction increase",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <CosmicBackground variant="section" showParticles={false} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 mb-8 shadow-lg shadow-amber-500/10">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">Customer Stories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Trusted by DSPs<br />
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              everywhere
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <GlassCard key={i} className="p-8 group">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Metric Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6EE7B7]/10 border border-[#6EE7B7]/20 mb-6 shadow-lg shadow-emerald-500/10">
                <TrendingUp className="w-4 h-4 text-[#6EE7B7]" />
                <span className="text-sm font-bold text-[#6EE7B7]">{t.metric}</span>
              </div>

              <p className="text-indigo-100 mb-8 leading-relaxed text-lg">&quot;{t.quote}&quot;</p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                  {t.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-white">{t.author}</div>
                  <div className="text-sm text-indigo-200/60">{t.role}, {t.company}</div>
                </div>
              </div>
            </GlassCard>
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
    '6-Week Trailing Report',
    'PPS Daily Report',
    'DVIC Inspection Report',
    'Paw Print Compliance',
    'Download PDF Scorecards',
    'Send SMS/Email to Drivers',
    'AI-Powered Coaching Notes',
  ];

  const freeFeatures = [
    'DSP Scorecard Upload',
    'Weekly Overview Report',
    'Customer Feedback Report',
    'POD Quality Report',
    'Basic Analytics Dashboard',
  ];

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <CosmicBackground variant="section" showParticles={false} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-500/10 to-yellow-500/10 backdrop-blur-sm border border-amber-500/20 mb-8 shadow-lg shadow-amber-500/10">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">Simple Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            One plan,<br />
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              everything included
            </span>
          </h2>
          <p className="text-lg text-indigo-200/70">
            Start with a 30-day free trial. No credit card required.
          </p>
        </div>

        {/* Pricing Card */}
        <GradientBorderCard className="max-w-xl mx-auto">
          <div>
            {/* Header */}
            <div className="relative bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 p-10 text-center overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_60%)]" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-5 shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">30-Day Free Trial</span>
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-7xl font-black text-white drop-shadow-lg">$24.99</span>
                  <span className="text-2xl text-white/80 font-medium">/week</span>
                </div>
                <p className="text-white/70 font-medium">Billed weekly after trial</p>
              </div>
            </div>

            {/* Features */}
            <div className="p-8">
              {/* Premium Features */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white text-lg">Premium Features</span>
                </div>
                <div className="space-y-3">
                  {premiumFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-indigo-100 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 my-8" />

              {/* Free Features */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Infinity className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white text-lg">Always Free</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {freeFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <CheckCircle2 className="w-5 h-5 text-[#6EE7B7] shrink-0" />
                      <span className="text-sm text-indigo-200/70 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link to="/sign-up">
                <button className="w-full group relative py-5 rounded-xl font-bold text-white text-lg overflow-hidden shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 animate-gradient-x" style={{ backgroundSize: '200% 200%' }} />
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_60%)]" />
                  <span className="relative flex items-center justify-center gap-3">
                    Start Your Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>

              <p className="text-center text-sm text-indigo-200/50 mt-5 font-medium">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </GradientBorderCard>
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
      answer: 'DiveMetric supports CSV, XLSX (Excel), and PDF files from Amazon logistics systems including DSP Scorecards, Weekly Overviews, Customer Feedback reports, and more.',
    },
    {
      question: 'How do drivers access their scorecards?',
      answer: 'Drivers receive a unique token link via SMS or email. They click the link to view their mobile-optimized scorecard - no login or app download required.',
    },
    {
      question: 'What is AI-powered coaching?',
      answer: "Our AI analyzes each driver's performance metrics and generates personalized improvement suggestions, highlighting strengths and providing actionable tips.",
    },
    {
      question: 'How does billing work?',
      answer: "Start with a 30-day free trial with full access. After the trial, you're billed $24.99 weekly. Cancel anytime.",
    },
    {
      question: 'Is my data secure?',
      answer: 'We use AWS infrastructure with encryption at rest and in transit. Driver data is processed in isolated environments with token-based access controls.',
    },
  ];

  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      <CosmicBackground variant="section" showParticles={false} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-linear-to-r from-indigo-500/10 to-cyan-500/10 backdrop-blur-sm border border-indigo-500/20 mb-8 shadow-lg shadow-indigo-500/10">
            <MessageCircle className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-300">FAQ</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Questions?<br />
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              We&apos;ve got answers
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <GlassCard key={i} hover={false} className="overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className="font-semibold text-white pr-4 text-lg group-hover:text-indigo-200 transition-colors">{faq.question}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-lg ${openIndex === i ? 'bg-linear-to-r from-indigo-500 to-violet-500 rotate-180 shadow-indigo-500/30' : 'bg-white/10 group-hover:bg-white/15'}`}>
                  <ChevronDown className="w-5 h-5 text-white" />
                </div>
              </button>
              <div className={`transition-all duration-500 overflow-hidden ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6">
                  <p className="text-indigo-200/70 leading-relaxed text-lg">{faq.answer}</p>
                </div>
              </div>
            </GlassCard>
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
      <CosmicBackground variant="hero" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">
          Ready to transform your<br />
          <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            driver performance?
          </span>
        </h2>
        <p className="text-xl text-indigo-200/70 mb-14 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of DSPs who trust DiveMetric. Start your 30-day free trial today.
        </p>

        <Link to="/sign-up">
          <button className="group relative px-12 py-6 rounded-2xl font-bold text-white text-xl overflow-hidden shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-shadow duration-500">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 animate-gradient-x" style={{ backgroundSize: '200% 200%' }} />
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_60%)]" />
            <span className="relative flex items-center gap-4">
              <Sparkles className="w-6 h-6" />
              Start Free Trial
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </Link>

        <p className="mt-10 text-indigo-200/50 font-medium">
          30-day free trial. No credit card required. $24.99/week after.
        </p>
      </div>
    </section>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Integrations', href: '#' },
    ],
    Company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
    ],
    Resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'API', href: '#' },
    ],
    Legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
    ],
  };

  return (
    <footer className="relative bg-[#0F0A1F] border-t border-white/10">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-linear-to-br from-indigo-500 via-violet-500 to-pink-500 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                DiveMetric
              </span>
            </Link>
            <p className="text-indigo-200/50 text-sm mb-6 leading-relaxed max-w-xs">
              Transforming last-mile delivery performance through intelligent scorecards and AI-powered insights.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white text-sm mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-indigo-200/50 hover:text-white text-sm transition-colors font-medium">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-indigo-200/40 text-sm font-medium">
            &copy; {new Date().getFullYear()} DiveMetric. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['twitter', 'linkedin', 'github'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-linear-to-r hover:from-indigo-500/20 hover:to-violet-500/20 border border-white/10 hover:border-indigo-500/30 flex items-center justify-center text-indigo-200/50 hover:text-white transition-all duration-300"
              >
                {social === 'twitter' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {social === 'linkedin' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )}
                {social === 'github' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN LANDING PAGE
// ============================================
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0F0A1F] overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <MetricsShowcase />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
