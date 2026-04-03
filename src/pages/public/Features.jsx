import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import useReveal from '../components/useReveal'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import {
  Upload, Brain, Send, Eye, BarChart3, Trophy, Sparkles,
  Smartphone, Mail, ArrowRight, Layers, ChevronRight,
} from 'lucide-react'

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

/* ── AnimatedSection (framer-motion) ─────────────────────── */
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.05, margin: '0px 0px 80px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── AnimatedBar (scroll-triggered width) ────────────────── */
function AnimatedBar({ value, color, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

/* ── animated chart bar ─────────────────────────────────── */
function ChartBar({ value, colorFrom, colorTo, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      className="flex-1 rounded-t-sm"
      initial={{ height: 4 }}
      animate={isInView ? { height: `${value}%` } : { height: 4 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{ background: `linear-gradient(to top, ${colorFrom}, ${colorTo})` }}
    />
  )
}

/* ── bento card ──────────────────────────────────────────── */
function BentoCard({ icon, title, desc, className = '', accent = 'bg-blue-50' }) {
  return (
    <div className={`bg-white rounded-3xl p-7 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:-translate-y-0.5 ${className}`}>
      <div className={`w-11 h-11 ${accent} rounded-2xl flex items-center justify-center text-xl mb-5`}>
        {icon}
      </div>
      <h3 className="text-[17px] font-bold text-apple-dark mb-2">{title}</h3>
      <p className="text-[14px] text-apple-mid leading-relaxed">{desc}</p>
    </div>
  )
}

/* ── data ────────────────────────────────────────────────── */
const fileTypes = [
  { name: 'CSV',  color: '#10b981' },
  { name: 'PDF',  color: '#f87171' },
  { name: 'XLSX', color: '#60a5fa' },
]

const supportedReports = [
  'DSP Scorecard', 'Weekly Overview', '6-Week Trailing', 'PPS Daily',
]

const mockMetrics = [
  { label: 'Safety',   value: 98, color: '#10b981' },
  { label: 'Delivery', value: 94, color: '#818cf8' },
  { label: 'Customer', value: 96, color: '#c084fc' },
]

const channels = [
  { icon: Smartphone, label: 'SMS',   sent: '2,847', color: '#10b981' },
  { icon: Mail,       label: 'Email', sent: '1,523', color: '#818cf8' },
]

const features = [
  {
    category: 'Scorecard Management',
    icon: '📋',
    color: 'bg-blue-50',
    borderColor: 'border-blue-300',
    dotColor: 'bg-apple-blue',
    items: [
      { title: 'PDF & CSV Import',            desc: 'Upload any Amazon scorecard format. Our OCR extracts every metric instantly — no manual data entry.' },
      { title: 'Auto-Generated Scorecards',   desc: 'Individual driver scorecards built automatically the moment you upload. Ready to send in seconds.' },
      { title: 'Historical Archive',          desc: 'Keep 12 months of scorecard history per driver. Never lose track of progress or regression.' },
      { title: 'Custom Score Thresholds',     desc: 'Set your own alert thresholds so you get notified before Amazon does.' },
    ],
  },
  {
    category: 'Driver Communication',
    icon: '📬',
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    dotColor: 'bg-emerald-500',
    items: [
      { title: 'SMS & Email Delivery',        desc: 'Send scorecards via text or email directly from the dashboard. No app download needed.' },
      { title: 'Mobile-Optimized View',       desc: 'Drivers get a beautiful, readable scorecard on any phone. Designed for the field, not the office.' },
      { title: 'Bulk Send',                   desc: 'Send all driver scorecards simultaneously with a single click. No batch limits.' },
      { title: 'Delivery Receipts',           desc: "See exactly who opened their scorecard and when, so you can follow up with those who haven't." },
    ],
  },
  {
    category: 'AI & Coaching',
    icon: '🤖',
    color: 'bg-purple-50',
    borderColor: 'border-purple-300',
    dotColor: 'bg-purple-500',
    items: [
      { title: 'AI Coaching Notes',           desc: 'Each scorecard includes AI-written, metric-specific coaching points tailored to the individual driver.' },
      { title: 'Coaching History Log',        desc: 'Track all coaching conversations and notes per driver over time. Critical for HR documentation.' },
      { title: 'Performance Predictions',     desc: 'Our AI flags drivers trending toward At Risk status up to 3 weeks in advance.' },
      { title: 'Strength Recognition',        desc: 'Automatically highlights top-performing drivers so you can recognize and retain them.' },
    ],
  },
  {
    category: 'Analytics & Reporting',
    icon: '📊',
    color: 'bg-amber-50',
    borderColor: 'border-amber-300',
    dotColor: 'bg-amber-500',
    items: [
      { title: 'Team Performance Dashboard',  desc: "A bird's eye view of your entire fleet — composite scores, trends, and risk flags at a glance." },
      { title: 'Week-over-Week Trends',       desc: "Visual charts showing each metric's movement over time. Instantly spot patterns." },
      { title: 'Exportable Reports',          desc: 'Download driver reports as PDFs for meetings, HR files, or compliance documentation.' },
      { title: 'Metric Breakdown',            desc: 'Drill into every Amazon metric: DSR, POD, DNR, CE, Seatbelt, Scan Compliance, and more.' },
    ],
  },
]

/* ── PAGE ────────────────────────────────────────────────── */
export default function Features() {
  return (
    <>
      <Header />
      <div className="pt-16">

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-50/80 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[13px] font-semibold text-apple-blue mb-8 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-apple-blue animate-pulse" />
              Platform Features
            </div>

            <h1
              className="text-[36px] sm:text-[48px] md:text-[64px] font-black leading-tight tracking-[-3px] text-apple-dark mb-6 animate-fade-up"
              style={{ animationDelay: '80ms' }}
            >
              Everything your DSP<br />
              <span className="text-apple-blue">needs to win.</span>
            </h1>

            <p
              className="text-[18px] text-apple-mid leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up"
              style={{ animationDelay: '160ms' }}
            >
              From automated scorecard distribution to AI coaching — DiveMetric gives you every tool to build a Fantastic+ operation.
            </p>

            <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
              <Link
                to="/pricing"
                className="px-7 py-4 bg-apple-blue text-white font-semibold text-[16px] rounded-full shadow-apple hover:bg-apple-blueDark hover:shadow-apple-lg transition-all duration-200 active:scale-95"
              >
                Start Free Trial →
              </Link>
              <Link
                to="/contact"
                className="px-7 py-4 bg-apple-gray text-apple-dark font-semibold text-[16px] rounded-full hover:bg-apple-border/30 transition-all duration-200"
              >
                Schedule a Demo
              </Link>
            </div>

            <p className="text-[13px] text-apple-light mt-5 animate-fade-up" style={{ animationDelay: '320ms' }}>
              No credit card required · Setup in under 5 minutes
            </p>
          </div>
        </section>

        {/* ══ PLATFORM CAPABILITIES BENTO ══════════════════════ */}
        <section className="bg-apple-gray py-16 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <AnimatedSection className="text-center mb-16">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">Platform Capabilities</p>
              <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-black leading-tight tracking-[-2.5px] text-apple-dark mb-4">
                The complete DSP<br />
                <span className="text-apple-blue">performance suite.</span>
              </h2>
              <p className="max-w-xl mx-auto text-[17px] text-apple-mid leading-relaxed">
                Six powerful tools working together to transform how you manage driver performance.
              </p>
            </AnimatedSection>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:auto-rows-[180px]">

              {/* Card 1: Smart Data Import — large */}
              <AnimatedSection delay={0.1} className="lg:col-span-7 lg:row-span-2 lg:h-full">
                <div className="relative h-full min-h-[320px] rounded-2xl bg-white border border-apple-border/60 overflow-hidden group hover:border-emerald-400/50 hover:shadow-apple-lg transition-all duration-500 shadow-apple">
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-400/8 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div className="relative h-full p-8 flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-[18px] font-bold text-apple-dark">Smart Data Import</h3>
                          <p className="text-[12px] text-apple-light">Multi-format processing</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {fileTypes.map((t) => (
                          <span
                            key={t.name}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                            style={{ backgroundColor: `${t.color}12`, color: t.color, border: `1px solid ${t.color}30` }}
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 rounded-xl border-2 border-dashed border-apple-border bg-apple-gray/60 flex items-center justify-center group-hover:border-emerald-400/50 group-hover:bg-emerald-50/50 transition-all duration-300">
                      <div className="text-center py-6">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white flex items-center justify-center shadow-apple-sm group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-300">
                          <Upload className="w-7 h-7 text-apple-light group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <p className="text-[13px] text-apple-light group-hover:text-apple-mid transition-colors">Drop your Scorecard reports here</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-xs mx-auto">
                          {supportedReports.map((r) => (
                            <span key={r} className="px-2 py-1 bg-white rounded-lg text-[10px] text-apple-mid border border-apple-border/60">{r}</span>
                          ))}
                          <span className="px-2 py-1 bg-emerald-50 rounded-lg text-[10px] text-emerald-600 border border-emerald-200">+3 more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 2: Unified Scorecards */}
              <AnimatedSection delay={0.15} className="lg:col-span-5 lg:row-span-2 lg:h-full">
                <div className="relative h-full min-h-[320px] rounded-2xl bg-white border border-apple-border/60 overflow-hidden group hover:border-indigo-400/50 hover:shadow-apple-lg transition-all duration-500 shadow-apple">
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/8 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div className="relative h-full p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-apple-dark">Unified Scorecards</h3>
                        <p className="text-[11px] text-apple-light">20+ metrics merged</p>
                      </div>
                    </div>

                    {/* mini scorecard preview */}
                    <div className="flex-1 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-950/90 to-violet-950/90 p-4 overflow-hidden">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                        <div className="w-9 h-9 rounded-lg bg-white/90 flex items-center justify-center text-[12px] font-bold text-indigo-700">JD</div>
                        <div className="flex-1">
                          <div className="text-[13px] font-semibold text-white">John Driver</div>
                          <div className="text-[10px] text-indigo-300/70">Rank #3 of 47</div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/20 rounded text-[10px] font-bold text-emerald-400">Fantastic</span>
                      </div>
                      <div className="space-y-3">
                        {mockMetrics.map((m, i) => (
                          <div key={m.label}>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-white/50">{m.label}</span>
                              <span className="font-bold" style={{ color: m.color }}>{m.value}%</span>
                            </div>
                            <AnimatedBar value={m.value} color={m.color} delay={0.5 + i * 0.2} />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-white/30">Overall Score</span>
                        <span className="text-[22px] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">94.2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 3: AI Coaching */}
              <AnimatedSection delay={0.2} className="lg:col-span-4 lg:h-full">
                <div className="relative h-full min-h-[180px] rounded-2xl bg-white border border-apple-border/60 overflow-hidden group hover:border-violet-400/50 hover:shadow-apple-lg transition-all duration-500 shadow-apple">
                  <div className="absolute -top-8 -right-8 w-28 h-28 bg-violet-400/8 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full p-5 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-[15px] font-bold text-apple-dark">AI Coaching</h3>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="relative bg-violet-50 rounded-xl p-4 border border-violet-100">
                        <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-violet-400" />
                        <p className="text-[12px] text-apple-mid leading-relaxed">
                          "Great safety this week! Focus on reducing DNR rate by double-checking addresses before delivery."
                        </p>
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-violet-100">
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="w-2 h-2 text-white" />
                          </div>
                          <span className="text-[9px] text-violet-500 font-semibold">AI Generated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 4: One-Click Send */}
              <AnimatedSection delay={0.25} className="lg:col-span-4 lg:h-full">
                <div className="relative h-full min-h-[180px] rounded-2xl bg-white border border-apple-border/60 overflow-hidden group hover:border-amber-400/50 hover:shadow-apple-lg transition-all duration-500 shadow-apple">
                  <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-amber-400/8 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full p-5 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-apple-dark">One-Click Send</h3>
                        <p className="text-[10px] text-apple-light">SMS & Email</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      {channels.map(({ icon: Icon, label, sent, color }) => (
                        <div
                          key={label}
                          className="flex-1 bg-apple-gray rounded-xl p-3 text-center border border-apple-border/60 hover:border-amber-300/60 transition-colors"
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                          <div className="text-[17px] font-bold text-apple-dark">{sent}</div>
                          <div className="text-[9px] text-apple-light">{label} Sent</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 5: Engagement Tracking */}
              <AnimatedSection delay={0.3} className="lg:col-span-4 lg:h-full">
                <div className="relative h-full min-h-[180px] rounded-2xl bg-white border border-apple-border/60 overflow-hidden group hover:border-cyan-400/50 hover:shadow-apple-lg transition-all duration-500 shadow-apple">
                  <div className="absolute -top-8 -left-8 w-28 h-28 bg-cyan-400/8 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full p-5 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-apple-dark">Engagement</h3>
                        <p className="text-[10px] text-apple-light">Real-time tracking</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-full grid grid-cols-2 gap-2">
                        <div className="bg-cyan-50 rounded-xl p-3 border border-cyan-100">
                          <div className="text-[22px] font-black text-cyan-500">87%</div>
                          <div className="text-[9px] text-apple-light">Open Rate</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                          <div className="text-[22px] font-black text-emerald-500">4.2k</div>
                          <div className="text-[9px] text-apple-light">Views Today</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 6: Analytics Dashboard — wide */}
              <AnimatedSection delay={0.35} className="lg:col-span-8 lg:h-full">
                <div className="relative h-full min-h-[180px] rounded-2xl bg-white border border-apple-border/60 overflow-hidden group hover:border-pink-400/50 hover:shadow-apple-lg transition-all duration-500 shadow-apple">
                  <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-pink-400/8 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-apple-dark">Analytics Dashboard</h3>
                          <p className="text-[10px] text-apple-light">DSP-wide performance insights</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-apple-light">Live</span>
                      </div>
                    </div>

                    {/* Mini bar chart */}
                    <div className="flex-1 flex items-end gap-1 px-2">
                      {[65, 72, 58, 81, 76, 89, 92, 85, 78, 94, 88, 91].map((value, i) => (
                        <ChartBar
                          key={i}
                          value={value}
                          colorFrom={i >= 10 ? '#ec4899' : i >= 8 ? '#a855f7' : '#818cf8'}
                          colorTo={i >= 10 ? '#fce7f3' : i >= 8 ? '#f3e8ff' : '#eef2ff'}
                          delay={0.5 + i * 0.05}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-apple-border/40">
                      <div className="flex items-center gap-5">
                        <div><span className="text-[15px] font-bold text-apple-dark">47</span><span className="text-[10px] text-apple-light ml-1">Drivers</span></div>
                        <div><span className="text-[15px] font-bold text-emerald-500">92%</span><span className="text-[10px] text-apple-light ml-1">Fantastic+</span></div>
                        <div><span className="text-[15px] font-bold text-pink-500">+12%</span><span className="text-[10px] text-apple-light ml-1">vs Last Week</span></div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View Dashboard</span><ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Card 7: Tier Status */}
              <AnimatedSection delay={0.4} className="lg:col-span-4 lg:h-full">
                <div className="relative h-full min-h-[180px] rounded-2xl bg-white border border-apple-border/60 overflow-hidden group hover:border-amber-400/50 hover:shadow-apple-lg transition-all duration-500 shadow-apple">
                  <div className="absolute -top-8 -right-8 w-28 h-28 bg-amber-400/8 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full p-5 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-apple-dark">Tier Status</h3>
                        <p className="text-[10px] text-apple-light">Real-time standings</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      {[
                        { tier: 'F+',   count: 18, color: '#10b981' },
                        { tier: 'F',    count: 12, color: '#34d399' },
                        { tier: 'G',    count: 9,  color: '#fbbf24' },
                        { tier: 'Fair', count: 5,  color: '#f97316' },
                      ].map((item) => (
                        <div key={item.tier} className="flex-1 text-center">
                          <div
                            className="w-full h-14 rounded-xl flex items-end justify-center pb-2 mb-1"
                            style={{ backgroundColor: `${item.color}12`, border: `1px solid ${item.color}25` }}
                          >
                            <span className="text-[16px] font-black" style={{ color: item.color }}>{item.count}</span>
                          </div>
                          <span className="text-[9px] text-apple-light">{item.tier}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
        <section className="bg-[#E8734A] py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
          <div className="relative max-w-5xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-14">
                <p className="text-white/70 text-[12px] font-semibold uppercase tracking-widest mb-3">Simple Workflow</p>
                <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-black leading-tight tracking-[-2px] text-white">
                  Up and running in minutes.
                </h2>
                <p className="text-white/80 text-[17px] mt-4 max-w-xl mx-auto leading-relaxed">
                  Three steps — from Monday morning chaos to every driver's phone before 9am.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {[
                {
                  step: '01',
                  icon: <Upload className="w-6 h-6 text-white" />,
                  title: 'Upload Your Scorecard',
                  desc: 'Drop your Amazon PDF or CSV into DiveMetric. Our system parses every metric for every driver instantly.',
                },
                {
                  step: '02',
                  icon: <Brain className="w-6 h-6 text-white" />,
                  title: 'AI Builds Each Card',
                  desc: 'Personalized scorecards and coaching notes are auto-generated for every driver — tailored to their exact numbers.',
                },
                {
                  step: '03',
                  icon: <Send className="w-6 h-6 text-white" />,
                  title: 'Send with One Click',
                  desc: 'Hit send. Every driver gets their scorecard via text or email. You get delivery receipts. Done.',
                },
              ].map(({ step, icon, title, desc }, i) => (
                <Reveal key={step} delay={i * 100}>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                    <div className="text-[11px] font-black tracking-widest text-white/40 uppercase mb-5">{step}</div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5 border border-white/20">
                      {icon}
                    </div>
                    <h3 className="text-[18px] font-bold text-white mb-3">{title}</h3>
                    <p className="text-[14px] text-white/75 leading-relaxed">{desc}</p>
                    {i < 2 && (
                      <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 bg-white/20 rounded-full border border-white/30">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="text-center">
                <Link
                  to="/sample-scorecard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-apple-dark text-white text-[14px] font-semibold rounded-full hover:bg-white hover:text-apple-dark transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  See a Sample Scorecard
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ FEATURE CATEGORIES ═══════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-20">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">Full Feature Set</p>
                <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-black leading-tight tracking-[-2px] text-apple-dark">
                  Built for every part<br />of your operation.
                </h2>
              </div>
            </Reveal>

            <div className="space-y-24">
              {features.map(({ category, icon, color, borderColor, dotColor, items }, ci) => (
                <Reveal key={category}>
                  <div className={`grid md:grid-cols-5 gap-10 items-start ${ci % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
                    <div className={`md:col-span-2 ${ci % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                      <div className={`w-14 h-14 ${color} rounded-3xl flex items-center justify-center text-2xl mb-5`}>
                        {icon}
                      </div>
                      <h2 className="text-[28px] font-black tracking-tight text-apple-dark mb-3">{category}</h2>
                      <p className="text-[14px] text-apple-light leading-relaxed mb-5">
                        {items.length} powerful features to help you run a better DSP.
                      </p>
                      <Link
                        to="/pricing"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-apple-gray text-apple-dark text-[14px] font-semibold rounded-full hover:bg-apple-border/40 transition-all duration-200"
                      >
                        Get started <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className={`md:col-span-3 grid sm:grid-cols-2 gap-4 ${ci % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                      {items.map(({ title, desc }, i) => (
                        <Reveal key={title} delay={i * 60}>
                          <div className={`bg-white rounded-2xl p-6 border-l-4 ${borderColor} shadow-apple-sm hover:shadow-apple transition-all duration-300 hover:-translate-y-0.5 h-full`}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                              <h3 className="text-[15px] font-bold text-apple-dark">{title}</h3>
                            </div>
                            <p className="text-[13px] text-apple-mid leading-relaxed">{desc}</p>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>

                  {ci < features.length - 1 && (
                    <div className="border-b border-apple-border/40 mt-20" />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ EVERY METRIC TRACKED ═════════════════════════════ */}
        <section className="bg-apple-gray py-20">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">Full Coverage</p>
                <h2 className="text-[30px] sm:text-[40px] font-black leading-tight tracking-[-1.5px] text-apple-dark">
                  Every Amazon metric, tracked.
                </h2>
                <p className="text-[16px] text-apple-mid mt-4 max-w-xl mx-auto">
                  No metric left behind. DiveMetric surfaces every data point Amazon uses to score your DSP.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  'Delivery Success Rate', 'Photo On Delivery (POD)', 'Delivered Not Attempted (DNA)',
                  'Customer Escalations (CE)', 'Scan Compliance', 'Seatbelt Rate',
                  'Distracted Driving', 'DPMO Rate', 'On-Time Pickup',
                  'Driver App Usage', 'Netradyne Safety Score', 'Attendance Rate',
                  'Package Delivered On Time', 'Return Rate', 'Fantastic Plus Score',
                  'Mentor / Coaching Tier',
                ].map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-apple-border/60 text-[13px] font-medium text-apple-dark hover:shadow-apple-sm hover:border-apple-blue/20 transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-blue shrink-0" />
                    {m}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ STATS BAND ═══════════════════════════════════════ */}
        <section className="py-16" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)' }}>
          <div className="max-w-4xl mx-auto px-6">
            <Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { value: '500+', label: 'DSP owners',           sub: 'across North America' },
                  { value: '35%',  label: 'avg earnings increase', sub: 'per driver coached' },
                  { value: '4 hrs', label: 'saved per week',      sub: 'per operations manager' },
                ].map(({ value, label, sub }) => (
                  <div key={label} className="text-center">
                    <p className="text-[36px] sm:text-[44px] md:text-[52px] font-black tracking-tighter text-white leading-none mb-1">{value}</p>
                    <p className="text-[14px] font-semibold text-white/80">{label}</p>
                    <p className="text-[12px] text-white/40 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════ */}
        <section className="py-24 bg-apple-gray">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="mb-12 text-center">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-4">Get Started</p>
                <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-black leading-tight tracking-[-2.5px] text-apple-dark mb-5">
                  Ready to see it in action?
                </h2>
                <p className="text-[17px] text-apple-mid leading-relaxed max-w-xl mx-auto">
                  Start your free 30-day trial, or let us walk you through the platform live. No pressure, no credit card.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                <Link
                  to="/pricing"
                  className="px-8 py-4 bg-apple-blue text-white font-semibold text-[16px] rounded-full shadow-apple hover:bg-apple-blueDark hover:shadow-apple-lg transition-all duration-200 active:scale-95"
                >
                  Start Free Trial →
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 border-2 border-apple-dark text-apple-dark font-semibold text-[16px] rounded-full hover:bg-apple-dark hover:text-white transition-all duration-200"
                >
                  Schedule a Demo
                </Link>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="grid max-w-2xl grid-cols-3 gap-4 mx-auto">
                {[
                  { value: '500+',    label: 'DSP owners' },
                  { value: '30 days', label: 'Free trial' },
                  { value: '< 5 min', label: 'Setup time' },
                ].map(({ value, label }) => (
                  <div key={label} className="p-6 text-center bg-white rounded-3xl shadow-apple">
                    <p className="text-[20px] sm:text-[28px] font-black tracking-tight text-apple-blue leading-none mb-1">{value}</p>
                    <p className="text-[12px] text-apple-light font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
