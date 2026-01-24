// How Scoring Works - Public Explainer Page
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Target,
  TrendingUp,
  Award,
  Package,
  Camera,
  MessageCircle,
  Shield,
  Wrench,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tier badge component
const TierBadge = ({ tier, size = 'md' }) => {
  const colors = {
    Platinum: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300', gradient: 'from-violet-500 to-purple-600' },
    Gold: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', gradient: 'from-amber-400 to-yellow-500' },
    Silver: { bg: 'bg-slate-200', text: 'text-slate-600', border: 'border-slate-300', gradient: 'from-slate-400 to-slate-500' },
    Bronze: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', gradient: 'from-orange-400 to-orange-600' },
    Poor: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', gradient: 'from-red-400 to-red-600' },
  };

  const c = colors[tier] || colors.Silver;
  const sizeClasses = size === 'lg' ? 'text-sm py-2 px-4' : 'text-xs py-1.5 px-3';

  return (
    <span className={cn(
      sizeClasses,
      'font-bold rounded-full border',
      c.bg, c.text, c.border
    )}>
      {tier}
    </span>
  );
};

// Expandable section component
const ExpandableSection = ({ title, icon: Icon, children, defaultOpen = false, accentColor = 'indigo' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorMap = {
    indigo: { bg: 'from-indigo-500 to-violet-600', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    emerald: { bg: 'from-emerald-500 to-green-600', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    amber: { bg: 'from-amber-500 to-yellow-600', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    orange: { bg: 'from-orange-500 to-red-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    violet: { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  };

  const colors = colorMap[accentColor];

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-all",
          colors.light, colors.border,
          isOpen ? "rounded-t-2xl border border-b-0" : "rounded-2xl border"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
            colors.bg
          )}>
            <Icon size={20} className="text-white" />
          </div>
          <span className={cn("text-base font-bold", colors.text)}>{title}</span>
        </div>
        <ChevronDown
          size={20}
          className={cn(
            "transition-transform duration-300",
            colors.text,
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className={cn(
          "p-5 bg-white rounded-b-2xl border border-t-0",
          colors.border
        )}>
          {children}
        </div>
      )}
    </div>
  );
};

// Quality group card
const QualityGroupCard = ({ group, criteria, description, isTop }) => (
  <div className={cn(
    "p-4 rounded-xl border transition-all",
    isTop
      ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
      : "bg-slate-50 border-slate-200"
  )}>
    <div className="flex items-center gap-3 mb-2">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm",
        isTop ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gradient-to-br from-slate-400 to-slate-500"
      )}>
        {group}
      </div>
      <div className={cn("font-semibold", isTop ? "text-emerald-700" : "text-slate-700")}>
        {description}
      </div>
    </div>
    <div className="text-sm text-slate-600 ml-11">
      {criteria}
    </div>
  </div>
);

// Main page component
const HowScoringWorks = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </Link>
          <div className="text-xl font-extrabold text-gradient-brand">
            DiveMetric
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-profile-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
          }}
        />
        <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium text-white/90">Understanding Your Performance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              How Driver Scoring Works
            </h1>
            <p className="text-lg text-indigo-200/90 max-w-2xl mx-auto leading-relaxed">
              A simple guide to understanding how DiveMetric ranks drivers and calculates performance scores based on Amazon DSP metrics.
            </p>
          </div>

          {/* Quick Stats Preview */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto">
            {[
              { label: 'Metrics Used', value: '15+', icon: Target },
              { label: 'Ranking Factors', value: '6', icon: TrendingUp },
              { label: 'Score Range', value: '0-100', icon: Award },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-4 text-center">
                <stat.icon size={20} className="text-indigo-300 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-[10px] text-indigo-200/70 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg">
              <Trophy size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">What is the DiveMetric Score?</h3>
            <p className="text-slate-600 leading-relaxed">
              Your DiveMetric Score (0-100) shows how you compare to other drivers in your DSP. A higher score means better overall performance relative to your peers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 shadow-lg">
              <Target size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">How Rankings Work</h3>
            <p className="text-slate-600 leading-relaxed">
              Drivers are ranked using multiple factors in order of importance. The ranking determines your score - Rank #1 gets 100 points, and scores decrease proportionally.
            </p>
          </div>
        </div>

        {/* The Ranking Process */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <TrendingUp size={20} className="text-white" />
            </div>
            The 6-Step Ranking Process
          </h2>

          <p className="text-slate-600 mb-6">
            Drivers are sorted through these steps in order. If two drivers are tied at one step, we move to the next step to break the tie.
          </p>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                <div className="w-0.5 h-full bg-slate-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-bold text-slate-800 mb-2">Amazon Tier / Standing</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Your overall tier from Amazon is the most important factor. Better tiers rank higher.
                </p>
                <div className="flex flex-wrap gap-2">
                  <TierBadge tier="Platinum" />
                  <ChevronRight size={16} className="text-slate-400 self-center" />
                  <TierBadge tier="Gold" />
                  <ChevronRight size={16} className="text-slate-400 self-center" />
                  <TierBadge tier="Silver" />
                  <ChevronRight size={16} className="text-slate-400 self-center" />
                  <TierBadge tier="Bronze" />
                  <ChevronRight size={16} className="text-slate-400 self-center" />
                  <TierBadge tier="Poor" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                <div className="w-0.5 h-full bg-slate-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-bold text-slate-800 mb-2">Quality Group Classification</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Within each tier, drivers are grouped by their delivery quality metrics. Lower group number = better ranking.
                </p>
                <div className="space-y-2">
                  <QualityGroupCard
                    group="0"
                    description="Perfect Performance"
                    criteria="Zero negative feedback, 100% completion rate, 100% photo acceptance"
                    isTop
                  />
                  <QualityGroupCard
                    group="1"
                    description="Excellent"
                    criteria="Zero negative feedback, completion rate ≥ 99.8%"
                  />
                  <QualityGroupCard
                    group="2"
                    description="Very Good"
                    criteria="Low feedback (DPMO ≤ 1000), perfect completion & photos"
                  />
                  <QualityGroupCard
                    group="3"
                    description="Good"
                    criteria="Zero negative feedback (other cases)"
                  />
                  <QualityGroupCard
                    group="4"
                    description="Needs Improvement"
                    criteria="Has negative feedback (DPMO > 0)"
                  />
                  <QualityGroupCard
                    group="5"
                    description="Photo Quality Issue"
                    criteria="Photo acceptance rate below 99.7%"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold shadow-lg">
                  3
                </div>
                <div className="w-0.5 h-full bg-slate-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-bold text-slate-800 mb-2">Negative Feedback Rate (CDF DPMO)</h3>
                <p className="text-slate-600 text-sm">
                  For drivers with feedback issues, lower DPMO (Defects Per Million Opportunities) ranks higher. This measures how often customers report problems.
                </p>
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-700 text-sm">
                    <Info size={16} />
                    <span className="font-medium">Lower is better!</span>
                  </div>
                  <p className="text-amber-600 text-xs mt-1">
                    DPMO of 1,000 means ~1 complaint per 1,000 deliveries
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg">
                  4
                </div>
                <div className="w-0.5 h-full bg-slate-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-bold text-slate-800 mb-2">Delivery Completion Rate (DCR)</h3>
                <p className="text-slate-600 text-sm">
                  Higher completion rate ranks higher. This measures what percentage of your assigned packages you successfully delivered.
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-sm text-slate-600">Target: 99%+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                  5
                </div>
                <div className="w-0.5 h-full bg-slate-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-bold text-slate-800 mb-2">Vehicle Inspection (DVIC)</h3>
                <p className="text-slate-600 text-sm">
                  Fewer rushed vehicle inspections ranks higher. Inspections under 90 seconds (or 5 minutes for step vans) are considered rushed.
                </p>
                <div className="mt-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-700 text-sm">
                    <AlertTriangle size={16} />
                    <span className="font-medium">Take your time!</span>
                  </div>
                  <p className="text-orange-600 text-xs mt-1">
                    Standard vehicles: minimum 90 seconds • Step vans: minimum 5 minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-bold shadow-lg">
                  6
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-2">Packages Delivered (Tiebreaker)</h3>
                <p className="text-slate-600 text-sm">
                  If everything else is equal, the driver who delivered more packages ranks higher. This rewards those who take on more work.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Formula */}
        <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Award size={28} />
            Your Final Score
          </h2>
          <p className="text-indigo-100 mb-6">
            After all drivers are ranked, your score is calculated based on where you land:
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="text-sm text-indigo-200 uppercase tracking-wider mb-2">Formula</div>
              <div className="text-2xl md:text-3xl font-mono font-bold">
                Score = 100 - ((Rank - 1) ÷ (Total - 1) × 100)
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-3xl font-extrabold text-yellow-300">100</div>
                <div className="text-xs text-indigo-200 mt-1">Rank #1 Score</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-3xl font-extrabold text-indigo-200">50</div>
                <div className="text-xs text-indigo-200 mt-1">Middle Rank Score</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-3xl font-extrabold text-indigo-300">0</div>
                <div className="text-xs text-indigo-200 mt-1">Last Rank Score</div>
              </div>
            </div>
          </div>

          <p className="text-indigo-200 text-sm mt-4">
            <strong className="text-white">Example:</strong> If there are 50 drivers and you're ranked #10, your score would be: 100 - ((10-1) ÷ (50-1) × 100) = <strong className="text-white">81.6</strong>
          </p>
        </div>

        {/* Metrics Deep Dive */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Key Metrics Explained</h2>

        <ExpandableSection title="Driving Safety Metrics" icon={Shield} accentColor="indigo" defaultOpen>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">FICO Score (0-850)</h4>
              <p className="text-slate-600 text-sm">
                Your driving behavior score based on telematics. Factors include acceleration, braking, cornering, phone use, and speeding. <strong>Target: 800+</strong>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Proper Park Sequence (PPS)</h4>
              <p className="text-slate-600 text-sm">
                Measures if you apply the parking brake BEFORE shifting to park. This prevents vehicle rollaways. <strong>Target: 100%</strong>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Safety Events</h4>
              <p className="text-slate-600 text-sm">
                Counts of distractions, speeding, seatbelt violations, following distance issues, and signal violations per 100 trips. <strong>Target: 0</strong>
              </p>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection title="Delivery Quality Metrics" icon={Package} accentColor="emerald">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Delivery Completion Rate (DCR)</h4>
              <p className="text-slate-600 text-sm">
                Percentage of packages delivered vs. dispatched. Uncontrollable factors (dogs, weather, etc.) are excluded. <strong>Target: 99%+</strong>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Photo-On-Delivery (POD) Acceptance</h4>
              <p className="text-slate-600 text-sm">
                Percentage of delivery photos that were clear and usable. Step back, ensure good lighting, and show the package clearly. <strong>Target: 98%+</strong>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Delivered Not Received (DNR)</h4>
              <p className="text-slate-600 text-sm">
                Packages marked delivered but reported not received by customer. Only counts controllable situations. <strong>Target: 0</strong>
              </p>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection title="Customer Feedback Metrics" icon={MessageCircle} accentColor="amber">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">CDF DPMO (Negative Feedback Rate)</h4>
              <p className="text-slate-600 text-sm">
                Defects Per Million Opportunities - measures customer complaints per million deliveries. <strong>Target: ≤1,160 for Fantastic tier</strong>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Customer Escalation Defects</h4>
              <p className="text-slate-600 text-sm">
                Serious incidents like unprofessional behavior, policy violations, or property damage. Higher severity = 3x weight. <strong>Target: 0</strong>
              </p>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection title="Vehicle Inspection (DVIC)" icon={Wrench} accentColor="orange">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Rushed Inspections</h4>
              <p className="text-slate-600 text-sm">
                Count of vehicle inspections completed too quickly. Take at least <strong>90 seconds</strong> for standard vehicles and <strong>5 minutes</strong> for step vans. Inspections under 10 seconds are critical violations.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Why This Matters</h4>
              <p className="text-orange-700 text-sm">
                Thorough vehicle inspections catch safety issues before they become problems on the road. Rushed inspections put you and others at risk.
              </p>
            </div>
          </div>
        </ExpandableSection>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 mt-8">
          <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <CheckCircle2 size={24} />
            Quick Tips to Improve Your Score
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Always apply parking brake FIRST, then shift to Park',
              'Take clear POD photos from 3-4 feet away with good lighting',
              'Read and follow all customer delivery instructions',
              'Spend at least 90 seconds on vehicle inspections',
              'Avoid phone distractions while driving',
              'Stay within speed limits, especially in residential areas',
              'Maintain safe following distance (3-4 seconds)',
              'Deliver to exact GPS location, not approximate',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="text-emerald-800 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12 pb-8">
          <p className="text-slate-500 text-sm mb-4">
            Have questions about your specific scorecard?
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles size={18} />
            Get Started with DiveMetric
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowScoringWorks;
