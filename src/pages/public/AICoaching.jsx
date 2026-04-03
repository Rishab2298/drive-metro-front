import { Link } from 'react-router-dom'
import useReveal from '../components/useReveal'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

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

const coachingFeatures = [
  {
    icon: '🧠',
    title: 'Metric-Specific Notes',
    desc: 'Every coaching note is generated from the driver\'s actual numbers — not a generic template. If their POD is slipping, the note addresses POD specifically.',
  },
  {
    icon: '📈',
    title: 'Trend-Aware Feedback',
    desc: 'The AI reads 6 weeks of history before writing. Consistent issues get different coaching than sudden drops — context that humans often miss.',
  },
  {
    icon: '💬',
    title: 'Tone You Control',
    desc: 'Set your coaching tone: encouraging, direct, or firm. The AI matches your voice so every note sounds like it came from you.',
  },
  {
    icon: '⚠️',
    title: 'At-Risk Early Warnings',
    desc: 'The AI flags drivers trending toward At Risk up to 3 weeks before Amazon does — giving you time to intervene, not react.',
  },
  {
    icon: '🏆',
    title: 'Strength Recognition',
    desc: 'Not all coaching is corrective. The AI automatically calls out genuine improvements so top performers feel seen and motivated.',
  },
  {
    icon: '📋',
    title: 'Coaching Log',
    desc: 'Every AI note is stored in a per-driver history. Build a documented coaching record that protects you in HR situations.',
  },
]

const aiFeedback = [
  {
    n: 1,
    text: 'Your FICO score of 782 is solid but there\'s room to reach 800+. Focus on smoother braking and acceleration patterns during deliveries.',
  },
  {
    n: 2,
    text: 'Following distance events (3.5 per 100) are critically above target. Maintain at least 3–4 seconds behind vehicles, especially in residential areas.',
  },
  {
    n: 3,
    text: 'Photo-On-Delivery acceptance dropped to 94.8%. Step back 3–4 feet and ensure packages are clearly visible in the frame.',
  },
  {
    n: 4,
    text: 'Customer instructions feedback: 2 incidents this week. Always read delivery notes before approaching each stop.',
  },
  {
    n: 5,
    text: 'PPS compliance at 96.5% — remember: FIRST apply parking brake, THEN shift to Park at every stop.',
  },
]

export default function AICoaching() {
  return (
    <>
    <Header />
    <div className="pt-16">
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text-animated {
          background: linear-gradient(270deg, #6366f1, #8b5cf6, #ec4899, #3b82f6, #6366f1);
          background-size: 300% 300%;
          animation: gradientShift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-bg-animated {
          background: linear-gradient(270deg, #6366f1, #8b5cf6, #ec4899, #3b82f6, #6366f1);
          background-size: 300% 300%;
          animation: gradientShift 4s ease infinite;
        }
      `}</style>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-violet-50/60 via-blue-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-200 bg-violet-50 text-[13px] font-semibold text-violet-600 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            Powered by AI · Built for DSP Operations
          </div>

          <h1 className="text-[34px] sm:text-[52px] md:text-[72px] font-black leading-[1.0] tracking-[-3px] text-apple-dark mb-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
            Coaching that{' '}
            <span className="gradient-text-animated">actually works.</span>
          </h1>

          <p className="text-[16px] md:text-[18px] text-apple-mid leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '160ms' }}>
            DiveMetric's AI reads every driver's scorecard data and writes personalised, metric-specific coaching notes — automatically. No copy-pasting. No generic feedback. Just coaching that drives real improvement.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <Link
              to="/pricing"
              className="gradient-bg-animated px-8 py-4 text-white font-bold text-[16px] rounded-full shadow-lg hover:opacity-90 transition active:scale-95"
            >
              Start Free Trial →
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-apple-gray text-apple-dark font-semibold text-[16px] rounded-full hover:bg-apple-border/40 transition"
            >
              See a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sample coaching notes ─────────────────────────── */}
      <section className="bg-apple-dark py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-3">Live Example</p>
              <h2 className="text-[30px] sm:text-[40px] md:text-[48px] font-black leading-tight tracking-[-2px] text-white">
                What drivers actually receive.
              </h2>
            </div>
          </Reveal>

          <div className="max-w-2xl mx-auto">
            <Reveal delay={80}>
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                {/* Card header */}
                <div className="gradient-bg-animated px-6 py-5 flex items-center gap-4">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-white font-black text-[15px] shrink-0">
                    MJ
                  </div>
                  <div>
                    <p className="text-white font-bold text-[16px]">Marcus Johnson</p>
                    <p className="text-white/70 text-[12px]">Week 12 · FICO 782 · Great tier</p>
                  </div>
                </div>

                {/* Feedback list */}
                <div className="px-6 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-4">AI Feedback to Improve</p>
                  <div className="space-y-4">
                    {aiFeedback.map(({ n, text }) => (
                      <div key={n} className="flex gap-4 items-start">
                        <span className="w-6 h-6 rounded-full gradient-bg-animated flex items-center justify-center text-white text-[11px] font-black shrink-0 mt-0.5">
                          {n}
                        </span>
                        <p className="text-white/80 text-[14px] leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full gradient-bg-animated shrink-0" />
                    <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">Generated by DiveMetric AI</span>
                  </div>
                  <span className="text-[11px] text-white/30">03/04/2026</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────── */}
      <section className="bg-apple-gray py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">How It Works</p>
              <h2 className="text-[30px] sm:text-[40px] md:text-[48px] font-black tracking-[-2px] text-apple-dark">
                Not just AI. Smart AI.
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {coachingFeatures.map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="bg-white rounded-3xl p-7 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-2xl mb-5">
                    {icon}
                  </div>
                  <h3 className="text-[17px] font-bold text-apple-dark mb-2">{title}</h3>
                  <p className="text-[14px] text-apple-mid leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How-it-works steps ────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-[30px] sm:text-[40px] font-black tracking-[-2px] text-apple-dark">
                Three steps. Zero effort.
              </h2>
            </div>
          </Reveal>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Upload your Amazon scorecard', desc: 'Drop your weekly PDF or CSV into DiveMetric. Our parser extracts every metric for every driver in seconds.' },
              { step: '02', title: 'AI generates personalised notes', desc: 'For each driver, the AI analyses their scores, compares to history, and writes a tailored coaching note — in under a minute for your entire fleet.' },
              { step: '03', title: 'Send with one click', desc: 'Review notes (edit anything you like), then hit Send All. Drivers receive their scorecard + coaching note via SMS or email instantly.' },
            ].map(({ step, title, desc }, i) => (
              <Reveal key={step} delay={i * 80}>
                <div className="flex gap-6 items-start bg-apple-gray rounded-3xl p-7">
                  <div className="gradient-bg-animated w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-[18px] flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-apple-dark mb-2">{title}</h3>
                    <p className="text-[14px] text-apple-mid leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="gradient-bg-animated py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-black tracking-[-2px] text-white mb-5">
              Ready to coach smarter?
            </h2>
            <p className="text-[17px] text-white/80 mb-10">
              Start your 30-day free trial. AI coaching is included on every plan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/pricing"
                className="px-8 py-4 bg-white text-apple-dark font-bold text-[16px] rounded-full hover:bg-white/90 transition shadow-lg active:scale-95"
              >
                Start Free Trial →
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white/40 text-white font-semibold text-[16px] rounded-full hover:bg-white/10 transition"
              >
                Schedule a Demo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
    <Footer />
    </>
  )
}
