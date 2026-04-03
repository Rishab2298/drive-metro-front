import { Link } from 'react-router-dom'
import useReveal from '../components/useReveal'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

const dashboardImg = '/dashboard.png'
const mobileScorecardImg = '/mobile-scorecard.png'

/* ── Reveal wrapper ──────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ── Scorecard Card ──────────────────────────────────────── */
function ScorecardCard() {
  return (
    <div className="w-full max-w-sm p-6 mx-auto bg-white rounded-3xl shadow-apple-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] font-semibold text-apple-light uppercase tracking-widest">Week 28</p>
          <p className="text-[22px] font-bold text-apple-dark mt-0.5">Marcus Johnson</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-apple-light">Deliveries</p>
          <p className="text-[22px] font-bold text-apple-blue">1,354</p>
        </div>
      </div>
      <div className="flex gap-2 mb-5">
        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-semibold rounded-full">✓ Fantastic</span>
        <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[12px] font-semibold rounded-full">↑ 12th / 98</span>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Delivery Success Rate', val: '98.7%', pct: 98.7, color: 'bg-emerald-400' },
          { label: 'POD Compliance',        val: '95.2%', pct: 95.2, color: 'bg-apple-blue'  },
          { label: 'Scan Compliance',       val: '99.1%', pct: 99.1, color: 'bg-emerald-400' },
          { label: 'CE Rate',               val: '88.0%', pct: 88,   color: 'bg-amber-400'   },
        ].map(({ label, val, pct, color }) => (
          <div key={label}>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="font-medium text-apple-mid">{label}</span>
              <span className="font-semibold text-apple-dark">{val}</span>
            </div>
            <div className="h-1.5 bg-apple-gray rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-4 mt-5 border-t border-apple-border/50">
        <button className="flex-1 py-2.5 bg-apple-blue text-white text-[13px] font-semibold rounded-xl hover:bg-apple-blueDark transition">Send to Driver</button>
        <button className="px-4 py-2.5 border border-apple-border text-[13px] font-semibold text-apple-mid rounded-xl hover:bg-apple-gray transition">Coach</button>
      </div>
    </div>
  )
}

/* ── Testimonial ─────────────────────────────────────────── */
function Testimonial({ quote, name, role, initials, color }) {
  return (
    <div className="transition-shadow duration-300 bg-white rounded-3xl p-7 shadow-apple hover:shadow-apple-lg">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-[14px] text-apple-mid leading-relaxed mb-5">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-[13px] font-bold text-white shrink-0`}>{initials}</div>
        <div>
          <p className="text-[14px] font-semibold text-apple-dark">{name}</p>
          <p className="text-[12px] text-apple-light">{role}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Sparkline SVG ───────────────────────────────────────── */
function Sparkline({ points, color }) {
  const w = 80, h = 28
  const xs = points.map((_, i) => (i / (points.length - 1)) * w)
  const min = Math.min(...points), max = Math.max(...points)
  const ys = points.map(p => h - ((p - min) / (max - min || 1)) * (h - 4) - 2)
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const fill = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ') + ` L${w},${h} L0,${h} Z`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={fill} fill={color} fillOpacity="0.12" />
      <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── PAGE ────────────────────────────────────────────────── */
export default function Home() {
  const dsps = [
    'Easy Report Upload', 'AI-Powered Analysis', 'Automated Coaching', 'Performance Tracking',
    'Driver Mobile Access', 'Trend Insights', 'Easy Report Upload',
    'AI-Powered Analysis', 'Automated Coaching', 'Performance Tracking', 'Driver Mobile Access',
    'Trend Insights', 'Easy Report Upload', 'AI-Powered Analysis', 'Automated Coaching',
    'Performance Tracking', 'Driver Mobile Access', 'Trend Insights',
  ]

  return (
    <>
      <Header />

      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50%       { transform: translateY(-14px) rotate(-1deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .float-a { animation: floatA 4s ease-in-out infinite; }
        .float-b { animation: floatB 5s ease-in-out infinite; }
        .float-c { animation: floatC 3.5s ease-in-out infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 28s linear infinite; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="pt-16">

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white">
          {/* Grid bg */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
          {/* Blue glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-50/90 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* Decorative large "01" watermark */}
          <div className="absolute right-0 top-0 text-[260px] font-black text-apple-blue/[0.03] leading-none select-none pointer-events-none hidden lg:block">01</div>

          <div className="relative max-w-6xl px-6 pt-14 pb-0 md:pt-20 mx-auto">
            <div className="grid items-center gap-12 md:grid-cols-2">

              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[13px] font-semibold text-apple-blue mb-8 animate-fade-up">
                  <span className="w-2 h-2 rounded-full bg-apple-blue animate-pulse" />
                  Trusted by 500+ DSP owners across North America
                </div>

                <h1
                  className="text-[36px] sm:text-[48px] md:text-[60px] font-black leading-[1.05] tracking-[-2.5px] text-apple-dark mb-6 animate-fade-up"
                  style={{ animationDelay: '80ms' }}
                >
                  Turn Scorecard<br />
                  Data into{' '}
                  <span className="text-apple-blue">Driver<br />Excellence.</span>
                </h1>

                <p
                  className="text-[17px] text-apple-mid leading-relaxed mb-8 max-w-md animate-fade-up"
                  style={{ animationDelay: '160ms' }}
                >
                  Send each DA a weekly scorecard to improve performance, save time &amp; put more money in your pocket. Built for Amazon DSPs.
                </p>

                <div className="flex flex-wrap gap-3 mb-6 animate-fade-up" style={{ animationDelay: '240ms' }}>
                  <Link
                    to="/pricing"
                    className="px-7 py-4 bg-apple-blue text-white font-semibold text-[16px] rounded-full shadow-apple hover:bg-apple-blueDark hover:shadow-apple-lg transition-all duration-200 active:scale-95"
                  >
                    Try for 30 Days Free →
                  </Link>
                  <Link
                    to="/features"
                    className="px-7 py-4 bg-apple-gray text-apple-dark font-semibold text-[16px] rounded-full hover:bg-apple-border/30 transition-all duration-200"
                  >
                    See All Features
                  </Link>
                </div>

                <p className="text-[13px] text-apple-light animate-fade-up" style={{ animationDelay: '320ms' }}>
                  No credit card required · Setup in under 5 minutes
                </p>
              </div>

              {/* Right — scorecard with floating badges */}
              <div className="flex items-end justify-center md:justify-end animate-fade-up relative pb-6" style={{ animationDelay: '200ms' }}>
                {/* Glow behind card */}
                <div className="absolute -inset-6 bg-apple-blue/10 rounded-[40px] blur-2xl" />

                {/* Floating metric badges */}
                <div className="float-a absolute -top-4 -left-2 sm:left-2 z-10 bg-white border border-apple-border/60 shadow-apple rounded-2xl px-3 py-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[12px] font-bold text-apple-dark">DSR 98.7%</span>
                </div>
                <div className="float-b absolute top-1/3 -right-3 sm:-right-6 z-10 bg-white border border-apple-border/60 shadow-apple rounded-2xl px-3 py-2 flex items-center gap-2">
                  <span className="text-[12px]">🏆</span>
                  <span className="text-[12px] font-bold text-apple-dark">Rank #3</span>
                </div>
                <div className="float-c absolute bottom-8 -left-4 sm:-left-8 z-10 bg-emerald-50 border border-emerald-200 shadow-apple rounded-2xl px-3 py-2">
                  <span className="text-[12px] font-bold text-emerald-700">✓ POD 95.2%</span>
                </div>
                <div className="float-a absolute -bottom-2 right-4 z-10 bg-apple-blue text-white shadow-apple rounded-2xl px-3 py-2" style={{ animationDelay: '1s' }}>
                  <span className="text-[12px] font-bold">Sent via SMS ✓</span>
                </div>

                <ScorecardCard />
              </div>
            </div>
          </div>

          {/* Category bars */}
          <div className="relative mt-16 overflow-hidden">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-white via-transparent to-white" />
            <div className="flex gap-3 px-6">
              {[
                { bg: 'from-blue-500 to-blue-700',     label: 'Driving Safety'    },
                { bg: 'from-emerald-500 to-emerald-700', label: 'Delivery Quality' },
                { bg: 'from-violet-500 to-violet-700',  label: 'Customer Feedback' },
                { bg: 'from-amber-500 to-amber-700',    label: 'Vehicle Check'    },
                { bg: 'from-rose-500 to-rose-700',      label: 'On-Time Rate'     },
              ].map(({ bg, label, icon }, i) => (
                <div key={i} className={`flex-1 h-32 md:h-40 rounded-t-2xl bg-gradient-to-br ${bg} flex flex-col items-start justify-end p-4 gap-1`}>
                  <span className="text-xl">{icon}</span>
                  <span className="text-white font-bold text-[12px] sm:text-[13px] leading-tight">{label}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-apple-gray to-transparent" />
          </div>
        </section>

        {/* ══ LOGOS STRIP ═══════════════════════════════════════ */}
        <section className="py-10 overflow-hidden bg-apple-gray border-y border-apple-border/40">
          <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-6">
            Trusted by leading DSPs Globally
          </p>
          <div
            className="flex"
            style={{ maskImage: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)' }}
          >
            <div className="flex gap-12 animate-marquee whitespace-nowrap will-change-transform">
              {dsps.map((d, i) => (
                <span key={i} className="text-[15px] font-semibold text-apple-mid shrink-0">{d}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ NUMBERS THAT MATTER ═══════════════════════════════ */}
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-14">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">By the Numbers</p>
                <h2 className="text-[36px] sm:text-[44px] font-black leading-tight tracking-[-2px] text-apple-dark">
                  Results DSP owners actually see.
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  value: '500+',
                  label: 'DSP owners trust DiveMetric',
                  desc: 'Across North America, growing every week.',
                  color: '#007AFF',
                  border: 'border-blue-400',
                  points: [30, 38, 42, 55, 60, 72, 85, 95, 100],
                },
                {
                  value: '4 hrs',
                  label: 'Saved per week, per manager',
                  desc: 'No more manual scorecard building or copy-pasting.',
                  color: '#E8734A',
                  border: 'border-orange-400',
                  points: [10, 20, 18, 30, 28, 38, 42, 40, 48],
                },
                {
                  value: '35%',
                  label: 'Average earnings increase',
                  desc: 'Structured coaching moves DSPs to Fantastic+ faster.',
                  color: '#10b981',
                  border: 'border-emerald-400',
                  points: [20, 22, 28, 30, 33, 38, 40, 42, 45],
                },
                {
                  value: '40%',
                  label: 'Less driver turnover',
                  desc: 'Drivers who receive feedback feel seen — and stay.',
                  color: '#8b5cf6',
                  border: 'border-violet-400',
                  points: [50, 44, 42, 38, 36, 32, 28, 24, 20],
                },
              ].map(({ value, label, desc, color, border, points }, i) => (
                <Reveal key={label} delay={i * 80}>
                  <div className={`bg-white rounded-3xl p-7 border-l-4 ${border} shadow-apple hover:shadow-apple-lg hover:-translate-y-0.5 transition-all duration-300`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[44px] font-black leading-none tracking-tighter" style={{ color }}>{value}</p>
                        <p className="text-[15px] font-bold text-apple-dark mt-1">{label}</p>
                      </div>
                      <Sparkline points={points} color={color} />
                    </div>
                    <p className="text-[13px] text-apple-light leading-relaxed">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ GENERATE IN SECONDS ═══════════════════════════════ */}
        <section className="bg-[#E8734A] py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="max-w-5xl px-6 mx-auto text-center">
            <Reveal>
              <p className="text-white/90 text-[17px] md:text-[20px] font-semibold mb-10">
                Generate Scorecards in seconds, and then<br />
                print or text them to your DAs with one click.
              </p>
            </Reveal>

            {/* Step flow */}
            <Reveal delay={60}>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
                {[
                  { n: '①', label: 'Upload PDF' },
                  { n: '②', label: 'AI Processes' },
                  { n: '③', label: 'Send to Drivers' },
                ].map(({ n, label }, i) => (
                  <div key={label} className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2">
                      <span className="text-white font-bold text-[14px]">{n}</span>
                      <span className="text-white/90 font-semibold text-[13px]">{label}</span>
                    </div>
                    {i < 2 && (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <div className="w-3 h-0.5 bg-white/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Dashboard screenshot */}
            <Reveal delay={120}>
              <div className="overflow-hidden bg-white rounded-2xl shadow-apple-xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-apple-gray/80 border-apple-border/40">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="flex-1 mx-4 bg-white/80 rounded-lg text-[11px] text-apple-light px-3 py-1 text-center">
                    divemetric.com/dashboard
                  </div>
                </div>
                <img src={dashboardImg} alt="DiveMetric Dashboard" className="block w-full" />
              </div>
            </Reveal>

            <Reveal delay={200}>
              <Link
                to="/sample-scorecard"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-apple-dark text-white text-[14px] font-semibold rounded-full hover:bg-white hover:text-apple-dark transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                See an example Scorecard
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ══ THREE BENEFITS ════════════════════════════════════ */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-6xl px-6 mx-auto">
            <Reveal>
              <div className="mb-16 text-center">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">Why DSPs choose us</p>
                <h2 className="text-[36px] sm:text-[40px] md:text-[48px] font-black leading-tight tracking-[-2px] text-apple-dark">
                  Real benefits for real<br />DSP operations.
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-6 mb-12 md:grid-cols-3">
              {[
                {
                  icon: '💰', acc: 'bg-emerald-50', n: '1',
                  title: 'Earn More',
                  desc: "Keep your DSP on track for Fantastic+ so you're not leaving bonus money on the table. Our customers see a 35% increase in per-driver earnings.",
                  stat: '35%', statLabel: 'avg earnings increase', statColor: 'text-emerald-500',
                },
                {
                  icon: '⏱', acc: 'bg-blue-50', n: '2',
                  title: 'Save Time',
                  desc: 'No manually searching for DA scores across multiple reports. DiveMetric allows you or your team to send out individual report cards with focus areas and coaching.',
                  stat: '4hrs', statLabel: 'saved per week', statColor: 'text-apple-blue',
                },
                {
                  icon: '📉', acc: 'bg-amber-50', n: '3',
                  title: 'Lower Attrition',
                  desc: 'Help your DAs address problems before they become bigger issues so they feel successful in their role. Structured coaching reduces turnover by 40%.',
                  stat: '40%', statLabel: 'less driver turnover', statColor: 'text-amber-500',
                },
              ].map(({ icon, acc, n, title, desc, stat, statLabel, statColor }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="relative h-full p-8 transition-shadow duration-300 bg-apple-gray rounded-3xl hover:shadow-apple overflow-hidden">
                    {/* Faint background number */}
                    <div className="absolute -right-3 -bottom-4 text-[120px] font-black text-apple-border/40 leading-none select-none pointer-events-none">{n}</div>
                    <div className={`relative w-12 h-12 ${acc} rounded-2xl flex items-center justify-center text-2xl mb-6`}>{icon}</div>
                    <h3 className="relative text-[20px] font-bold text-apple-dark mb-3">{title}</h3>
                    <p className="relative text-[14px] text-apple-mid leading-relaxed mb-6">{desc}</p>
                    <div className="relative pt-5 border-t border-apple-border/40">
                      <span className={`text-[28px] sm:text-[36px] font-black tracking-tight ${statColor}`}>{stat}</span>
                      <span className="text-[13px] text-apple-light ml-2">{statLabel}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/features" className="px-7 py-3.5 border-2 border-apple-dark text-apple-dark font-semibold text-[15px] rounded-full hover:bg-apple-dark hover:text-white transition-all duration-200">
                  View our Feature List
                </Link>
                <Link to="/pricing" className="px-7 py-3.5 border-2 border-apple-blue bg-apple-blue text-white font-semibold text-[15px] rounded-full hover:bg-apple-blueDark transition-all duration-200">
                  Learn About Pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ MOBILE SCORECARD ══════════════════════════════════ */}
        <section className="py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #fdf6ec 0%, #fef3f8 50%, #eff6ff 100%)' }}>
          <div className="max-w-6xl px-6 mx-auto">
            <div className="grid items-center gap-16 md:grid-cols-2">
              {/* Left text */}
              <Reveal>
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">Driver Experience</p>
                <h2 className="text-[36px] sm:text-[40px] md:text-[48px] font-black leading-tight tracking-[-2px] text-apple-dark mb-6">
                  Beautiful scorecards<br />in every driver's pocket.
                </h2>
                <p className="text-[16px] text-apple-mid leading-relaxed mb-8 max-w-md">
                  Drivers receive a stunning mobile scorecard — no app download, no login. Just a link. They see their rank, score, metrics, and a personalised coaching note from you.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: '📊', text: 'Real-time rank & score out of 100' },
                    { icon: '🧠', text: 'AI-written coaching note per driver' },
                    { icon: '📅', text: '6-week trailing performance view' },
                    { icon: '🔐', text: 'Secure link — no account needed' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="flex items-center justify-center shrink-0 text-lg w-9 h-9 bg-blue-50 rounded-xl">{icon}</div>
                      <span className="text-[14px] font-medium text-apple-mid">{text}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/sample-scorecard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-apple-dark text-white text-[14px] font-semibold rounded-full hover:bg-black transition-all duration-200 active:scale-95"
                >
                  View Sample Scorecard →
                </Link>
              </Reveal>

              {/* Right — phone + floating pills */}
              <Reveal delay={100} className="flex justify-center">
                <div className="relative">
                  {/* Glow */}
                  <div className="absolute -inset-8 bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-pink-200/20 rounded-[48px] blur-3xl pointer-events-none" />

                  {/* Floating callout pills */}
                  <div className="float-b absolute -top-4 -right-4 sm:-right-10 z-10 bg-white rounded-2xl shadow-apple px-3 py-2 border border-apple-border/40">
                    <p className="text-[11px] font-bold text-apple-dark whitespace-nowrap">No app download</p>
                  </div>
                  <div className="float-a absolute top-1/2 -left-6 sm:-left-14 z-10 bg-white rounded-2xl shadow-apple px-3 py-2 border border-apple-border/40">
                    <p className="text-[11px] font-bold text-apple-dark whitespace-nowrap">Works on any phone</p>
                  </div>
                  <div className="float-c absolute -bottom-4 right-0 sm:-right-8 z-10 bg-emerald-50 rounded-2xl shadow-apple px-3 py-2 border border-emerald-100">
                    <p className="text-[11px] font-bold text-emerald-700 whitespace-nowrap">🔒 Secure link</p>
                  </div>

                  {/* Phone shell */}
                  <div className="relative bg-[#1a1a2e] rounded-[44px] p-3 shadow-[0_40px_80px_rgba(0,0,0,0.35)] w-[260px] sm:w-[300px]">
                    <div className="absolute z-10 w-24 h-6 -translate-x-1/2 bg-black rounded-full top-5 left-1/2" />
                    <div className="bg-white rounded-[34px] overflow-hidden" style={{ maxHeight: '560px' }}>
                      <img src={mobileScorecardImg} alt="DiveMetric Mobile Scorecard" className="block w-full" />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)' }}>
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl px-6 mx-auto">
            <Reveal>
              <div className="mb-12 text-center">
                {/* Star rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-white/60 text-[13px] font-semibold ml-2">Rated 4.9 / 5 by DSP owners</span>
                </div>
                <p className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-3">Customer Reviews</p>
                <h2 className="text-[36px] sm:text-[40px] md:text-[48px] font-black leading-tight tracking-[-2px] text-white">
                  What DSP owners say.
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  quote: 'We have used DiveMetric for almost a year now. It has helped us coach and mentor our drivers so that we have achieved Fantastic Plus on every scorecard this year. The service is very affordable and worth every penny.',
                  name: 'Michael R.', role: 'DSP Owner · Sumner, WA', initials: 'MR', color: 'bg-apple-blue',
                },
                {
                  quote: 'I have been using DiveMetric since it launched, and have been very happy with how easy it has made the process of delivering scorecard information to drivers. The team is super responsive and always adding new features.',
                  name: 'Sarah L.', role: 'DSP Owner · Las Vegas, NV', initials: 'SL', color: 'bg-emerald-500',
                },
                {
                  quote: 'Very impressed with how quickly it compiles scores and sends individual scorecards to each driver. My ops team saves hours every week. The ROI is undeniable — we hit Fantastic+ three weeks in a row.',
                  name: 'James W.', role: 'DSP Owner · Dallas, TX', initials: 'JW', color: 'bg-amber-500',
                },
              ].map((t, i) => (
                <Reveal key={t.name} delay={i * 80}>
                  <Testimonial {...t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════ */}
        <section className="py-24 bg-apple-gray overflow-hidden">
          <div className="max-w-6xl px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Left — text & buttons */}
              <Reveal>
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-4">Let's Talk</p>
                <h2 className="text-[36px] sm:text-[40px] md:text-[52px] font-black leading-tight tracking-[-2.5px] text-apple-dark mb-5">
                  Questions?<br />Want to Talk?
                </h2>
                <p className="text-[17px] text-apple-mid leading-relaxed mb-8 max-w-md">
                  We're happy to give you a demo, walk you through the product, and answer any of your questions.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-apple-dark text-white font-semibold text-[16px] rounded-full hover:bg-black transition-all duration-200 shadow-apple hover:shadow-apple-lg active:scale-95"
                  >
                    Schedule a Demo
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-4 border-2 border-apple-dark text-apple-dark font-semibold text-[16px] rounded-full hover:bg-apple-dark hover:text-white transition-all duration-200"
                  >
                    Contact Us
                  </Link>
                </div>

                {/* Mini stats row */}
                <div className="grid grid-cols-3 gap-3 max-w-sm">
                  {[
                    { value: '500+',    label: 'DSP owners' },
                    { value: '30 days', label: 'Free trial' },
                    { value: '< 5 min', label: 'Setup time' },
                  ].map(({ value, label }) => (
                    <div key={label} className="p-4 text-center bg-white rounded-2xl shadow-apple">
                      <p className="text-[18px] sm:text-[22px] font-black tracking-tight text-apple-blue leading-none mb-1">{value}</p>
                      <p className="text-[11px] text-apple-light font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Right — decorative scorecard preview */}
              <Reveal delay={120} className="hidden md:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-apple-blue/5 rounded-[40px] blur-2xl" />
                  <div className="relative bg-white rounded-3xl shadow-apple-lg p-6 border border-apple-border/40">
                    {/* Mini header */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-apple-border/40">
                      <div>
                        <p className="text-[11px] text-apple-light uppercase tracking-widest font-semibold">Week 28 · Your DSP</p>
                        <p className="text-[18px] font-black text-apple-dark mt-0.5">Fleet Overview</p>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-bold rounded-full">Fantastic+</span>
                    </div>
                    {/* Driver rows */}
                    {[
                      { name: 'Marcus J.', score: 98, tier: 'F+',   color: 'bg-emerald-400' },
                      { name: 'Sofia R.',  score: 94, tier: 'F',    color: 'bg-apple-blue'  },
                      { name: 'Carlos M.', score: 87, tier: 'Great', color: 'bg-amber-400'  },
                      { name: 'Aria K.',   score: 92, tier: 'F',    color: 'bg-apple-blue'  },
                    ].map(({ name, score, tier, color }) => (
                      <div key={name} className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                          {name.split(' ').map(w => w[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-[12px] mb-1">
                            <span className="font-semibold text-apple-dark">{name}</span>
                            <span className="font-bold text-apple-mid">{score}</span>
                          </div>
                          <div className="h-1.5 bg-apple-gray rounded-full overflow-hidden">
                            <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-apple-mid shrink-0 w-8 text-right">{tier}</span>
                      </div>
                    ))}
                    {/* Action row */}
                    <div className="mt-5 pt-4 border-t border-apple-border/40 flex gap-2">
                      <button className="flex-1 py-2.5 bg-apple-blue text-white text-[13px] font-semibold rounded-xl">Send All Scorecards</button>
                      <button className="px-3 py-2.5 border border-apple-border text-[13px] text-apple-mid rounded-xl">Export</button>
                    </div>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
