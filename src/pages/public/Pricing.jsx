import { Link } from 'react-router-dom'
import { useState } from 'react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import useReveal from '../components/useReveal'

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

const CHECK = (
  <svg className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
)

const CHECK_WHITE = (
  <svg className="w-4 h-4 shrink-0 text-apple-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
)

const mainFeatures = [
  '6-Week Trailing Report Processing',
  'PPS Daily Report Analysis',
  'DVIC Inspection Report',
  'Download PDF Scorecards',
  'SMS & Email Distribution to Drivers',
  'Engagement Tracking & Analytics',
  'CSV, XLSX & PDF import (all formats)',
  'Mobile scorecard link per driver',
  '30-day free trial included',
]

const aiFeatures = [
  'AI-Powered Coaching Notes per driver',
  'Personalized performance feedback',
  'Actionable improvement tips',
  'Generated weekly with each scorecard',
]

const faqs = [
  {
    q: 'What file formats does DiveMetric support?',
    a: 'DiveMetric supports CSV, XLSX (Excel), and PDF files — including DSP Scorecards, Weekly Overviews, 6-Week Trailing Reports, Customer Feedback, POD Quality, PPS Daily, and DVIC reports.',
  },
  {
    q: 'How do drivers access their scorecards?',
    a: 'Drivers receive a unique link via SMS or email. They simply tap the link to view their mobile-optimized scorecard — no login, password, or app download required.',
  },
  {
    q: 'How does billing work after the trial?',
    a: "Start with a full-access 30-day free trial — no credit card needed. After the trial, you'll be billed $24.99 weekly. You can cancel anytime with no questions asked.",
  },
  {
    q: 'What is the AI Coaching Add-on?',
    a: "Our AI analyzes each driver's performance metrics and generates personalized coaching notes with actionable improvement tips. It's an optional add-on at $9.99/week, available anytime from your billing page.",
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We use AWS infrastructure with encryption at rest and in transit. Driver data is processed in isolated environments with token-based access controls. We never share your data.',
  },
  {
    q: 'Can I track if drivers viewed their scorecards?',
    a: "Yes. When a driver opens their scorecard link, an eye icon appears next to their name in the master scorecard drivers list. Once they acknowledge it, the eye is replaced with a tick mark — giving you a clear at-a-glance view of who has seen their scorecard.",
  },
]

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <>
      <Header />
      <div className="pt-16">

        {/* ── Hero ── */}
        <section className="bg-white border-b border-apple-border/40 py-14 md:py-20 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-4 animate-fade-up">
              Pricing
            </p>
            <h1 className="text-[36px] sm:text-[48px] md:text-[64px] font-black tracking-[-3px] text-apple-dark mb-5 animate-fade-up leading-[1.0]" style={{ animationDelay: '80ms' }}>
              Simple,<br />
              <span className="text-apple-blue">transparent pricing.</span>
            </h1>
            <p className="text-[17px] text-apple-mid leading-relaxed animate-fade-up" style={{ animationDelay: '160ms' }}>
              One plan. Everything included. No per-driver fees, no feature gating.
              Start free for 30 days — no credit card required.
            </p>
          </div>
        </section>

        {/* ── Plans ── */}
        <section className="bg-apple-gray py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">

              {/* Main plan */}
              <Reveal>
                <div className="bg-apple-dark rounded-3xl overflow-hidden shadow-apple-xl flex flex-col h-full">
                  {/* Card header */}
                  <div className="px-8 pt-8 pb-6 border-b border-white/10">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-4">DiveMetric Plan</p>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-[44px] sm:text-[56px] font-black leading-none tracking-[-2px] text-white">$24.99</span>
                      <span className="text-[18px] font-medium text-white/50 mb-2">/week</span>
                    </div>
                    <p className="text-[13px] text-white/40">Billed weekly after 30-day free trial</p>
                  </div>

                  {/* Features */}
                  <div className="px-8 py-6 flex-1">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-white/30 mb-4">What's included</p>
                    <ul className="space-y-3">
                      {mainFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[14px] text-white/75">
                          {CHECK_WHITE}
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="px-8 pb-8">
                    <Link
                      to="/sign-up"
                      className="block w-full text-center py-3.5 bg-apple-blue hover:bg-apple-blueDark text-white text-[15px] font-semibold rounded-full shadow-[0_2px_8px_rgba(0,122,255,0.35)] hover:shadow-[0_4px_16px_rgba(0,122,255,0.4)] transition-all duration-200 active:scale-[0.98] mb-3"
                    >
                      Start 30-Day Free Trial →
                    </Link>
                    <p className="text-center text-[12px] text-white/30">No credit card required · Cancel anytime</p>
                  </div>
                </div>
              </Reveal>

              {/* AI Add-on */}
              <Reveal delay={80}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-apple border border-apple-border/60 flex flex-col h-full">
                  {/* Card header */}
                  <div className="px-8 pt-8 pb-6 border-b border-apple-border/40">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-full text-[12px] font-bold text-violet-600 mb-4">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Optional Add-on
                    </div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-apple-light mb-4">AI Coaching</p>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-[18px] font-bold text-apple-mid">+</span>
                      <span className="text-[44px] sm:text-[56px] font-black leading-none tracking-[-2px] text-apple-dark">$9.99</span>
                      <span className="text-[18px] font-medium text-apple-light mb-2">/week</span>
                    </div>
                    <p className="text-[13px] text-apple-light">Add to your plan anytime from billing</p>
                  </div>

                  {/* Features */}
                  <div className="px-8 py-6 flex-1">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-apple-light mb-4">AI Features</p>
                    <ul className="space-y-3 mb-6">
                      {aiFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[14px] text-apple-mid">
                          {CHECK}
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                      <p className="text-[13px] text-violet-700 leading-relaxed">
                        Our AI analyzes each driver's metrics and writes a personalised coaching note — every single week, automatically.
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-8 pb-8">
                    <div className="w-full text-center py-3.5 bg-apple-gray text-apple-mid text-[14px] font-medium rounded-full border border-apple-border/60">
                      Add from your billing page after signup
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Trust strip */}
            <Reveal delay={160}>
              <div className="flex flex-wrap justify-center items-center gap-6 py-5 px-8 bg-white rounded-2xl border border-apple-border/60 shadow-apple">
                {[
                  { icon: '🛡', text: '30-day free trial' },
                  { icon: '💳', text: 'No credit card required' },
                  { icon: '✕', text: 'Cancel anytime' },
                  { icon: '⚡', text: 'Setup in under 5 minutes' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <span className="text-[16px]">{icon}</span>
                    <span className="text-[13px] font-medium text-apple-mid">{text}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── What you get ── */}
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">The full picture</p>
                <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-black tracking-[-2px] text-apple-dark">
                  Everything you need to hit Fantastic+ every week.
                </h2>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: '📤',
                  bg: 'bg-blue-50',
                  title: 'Upload',
                  desc: 'Drop your CSV, XLSX, or PDF scorecard files. We handle all Amazon DSP formats automatically.',
                },
                {
                  icon: '⚡',
                  bg: 'bg-amber-50',
                  title: 'Generate',
                  desc: 'Individual scorecards are created for every driver in seconds. Ranked, scored, and ready to send.',
                },
                {
                  icon: '📱',
                  bg: 'bg-emerald-50',
                  title: 'Distribute',
                  desc: 'Send each DA their scorecard via SMS or email with one click. Drivers open a mobile-optimized link — no app needed.',
                },
              ].map(({ icon, bg, title, desc }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="p-6 bg-apple-gray rounded-3xl h-full">
                    <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center text-xl mb-4`}>
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

        {/* ── FAQ ── */}
        <section className="bg-apple-gray py-20">
          <div className="max-w-2xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-10">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-3">FAQ</p>
                <h2 className="text-[28px] sm:text-[36px] font-black tracking-[-1.5px] text-apple-dark">Common questions.</h2>
              </div>
            </Reveal>

            <div className="space-y-2">
              {faqs.map(({ q, a }, i) => (
                <Reveal key={q} delay={i * 40}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-apple border border-apple-border/40">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-4 py-4 sm:px-6 text-left"
                    >
                      <span className="text-[15px] font-semibold text-apple-dark">{q}</span>
                      <svg
                        className={`w-5 h-5 shrink-0 text-apple-light transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 sm:px-6 sm:pb-5">
                        <p className="text-[14px] text-apple-mid leading-relaxed">{a}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-apple-dark py-20">
          <Reveal>
            <div className="max-w-2xl mx-auto px-6 text-center">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-white/30 mb-4">Get started today</p>
              <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-black tracking-[-2.5px] text-white mb-5 leading-[1.0]">
                Try free for<br />30 days.
              </h2>
              <p className="text-[17px] text-white/50 leading-relaxed mb-8">
                No credit card. No commitment. Full access from day one.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/sign-up"
                  className="px-8 py-4 bg-apple-blue hover:bg-apple-blueDark text-white font-semibold text-[16px] rounded-full shadow-[0_2px_12px_rgba(0,122,255,0.4)] hover:shadow-[0_4px_20px_rgba(0,122,255,0.45)] transition-all duration-200 active:scale-95"
                >
                  Start Free Trial →
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold text-[16px] rounded-full transition-all duration-200"
                >
                  Talk to Us
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

      </div>
      <Footer />
    </>
  )
}
