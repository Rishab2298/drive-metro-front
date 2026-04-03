import { useState } from 'react'
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

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`bg-white rounded-2xl shadow-apple-sm overflow-hidden transition-all duration-200 ${
        open ? 'ring-1 ring-apple-blue/20' : ''
      }`}
    >
      <button
        className="w-full text-left flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 hover:bg-apple-gray/30 transition"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[14px] sm:text-[15px] font-semibold text-apple-dark">{q}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          open ? 'bg-apple-blue text-white rotate-180' : 'bg-apple-gray text-apple-mid'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}>
        <p className="px-4 pb-4 sm:px-6 sm:pb-5 text-[14px] text-apple-mid leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

const categories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    faqs: [
      { q: 'What file formats does DiveMetric support?', a: 'We support all Amazon scorecard formats including PDF exports from the DSP portal, CSV weekly reports, and manual data entry. Our OCR engine handles all Amazon scorecard layouts, including historical formats going back to 2020.' },
      { q: 'How long does setup take?', a: 'Most DSP owners are fully set up and have sent their first round of driver scorecards within 15 minutes of signing up. There\'s no complex integration — just upload your scorecard and go.' },
      { q: 'Do my drivers need to create an account?', a: 'No. Drivers receive a link via SMS or email that opens a mobile-optimized view of their scorecard. No login, no app download. It just works.' },
      { q: 'Can I import historical scorecard data?', a: 'Yes. You can upload past Amazon scorecards going back as far as you\'d like. DiveMetric will build out your driver history automatically so you can see trends from day one.' },
    ],
  },
  {
    title: 'Features & Platform',
    icon: '⚙️',
    faqs: [
      { q: 'How does AI coaching work?', a: 'After each scorecard is generated, our AI analyzes the driver\'s performance across all metrics and writes specific, actionable coaching points. These are attached to the scorecard the driver receives and logged in your coaching history.' },
      { q: 'What Amazon metrics does DiveMetric track?', a: 'We track all key Amazon DSP metrics: Delivery Success Rate, POD, DNA, CE, Scan Compliance, Seatbelt Rate, Distracted Driving, DPMO, Netradyne Safety Score, Attendance, and more. As Amazon updates their scorecard, we update too.' },
      { q: 'Can I customize what gets sent to drivers?', a: 'Yes. You can choose which metrics to include, add custom notes, set a personal message, and even brand the scorecard with your company name and logo.' },
      { q: 'How do real-time alerts work?', a: 'You set a score threshold for any metric. When a driver\'s score drops below that threshold — weekly or mid-week — you\'ll receive an immediate email and/or SMS notification so you can intervene before it affects your station\'s performance tier.' },
    ],
  },
  {
    title: 'Billing & Plans',
    icon: '💳',
    faqs: [
      { q: 'Is there really no credit card required for the trial?', a: 'Correct. Your 30-day free trial starts the moment you create an account. We don\'t ask for payment information until you decide to continue after the trial.' },
      { q: 'What happens when my trial ends?', a: 'You\'ll receive a reminder 5 days before your trial ends. At that point you can choose a plan and add payment details, or your account will simply become read-only until you subscribe.' },
      { q: 'Can I cancel anytime?', a: 'Yes. Cancel at any time from your account dashboard. There are no cancellation fees and no long-term contracts. If you cancel a monthly plan, you retain access until the end of your current billing period.' },
      { q: 'Do you offer refunds?', a: 'We offer a pro-rated refund within 14 days of any charge if you\'re not satisfied. Contact our support team and we\'ll make it right.' },
    ],
  },
  {
    title: 'Security & Privacy',
    icon: '🔒',
    faqs: [
      { q: 'Is my data secure?', a: 'Absolutely. All data is encrypted at rest with AES-256 and in transit with TLS 1.3. We are SOC 2 Type II compliant. Your scorecard data is never shared with Amazon or any third parties.' },
      { q: 'Who can see my driver data?', a: 'Only you and the team members you explicitly invite can access your account. Drivers can only see their own individual scorecard via the link you send them — they cannot see other drivers\' data.' },
      { q: 'Where is my data stored?', a: 'All data is stored in AWS data centers located in the United States. We do not store data internationally unless you specifically request it for compliance reasons.' },
    ],
  },
]

export default function FAQ() {
  return (
    <>
    <Header />
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-apple-border/40 py-14 md:py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-apple-light mb-4 animate-fade-up">FAQ</p>
          <h1 className="text-[36px] sm:text-[48px] md:text-[64px] font-black tracking-[-3px] text-apple-dark mb-5 animate-fade-up leading-tight" style={{ animationDelay: '80ms' }}>
            Got questions?<br />
            <span className="text-apple-blue">We have answers.</span>
          </h1>
          <p className="text-[17px] text-apple-mid leading-relaxed animate-fade-up" style={{ animationDelay: '160ms' }}>
            Everything you need to know about DiveMetric. Can't find your answer?{' '}
            <Link to="/contact" className="text-apple-blue hover:underline font-medium">Talk to us</Link>.
          </p>
        </div>
      </section>

      {/* FAQ categories */}
      <section className="bg-apple-gray py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-14">
          {categories.map(({ title, icon, faqs }, ci) => (
            <Reveal key={title}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-apple-sm flex items-center justify-center text-xl">
                    {icon}
                  </div>
                  <h2 className="text-[22px] font-black tracking-tight text-apple-dark">{title}</h2>
                </div>
                <div className="space-y-3">
                  {faqs.map(({ q, a }, i) => (
                    <Reveal key={q} delay={i * 50}>
                      <AccordionItem q={q} a={a} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Still need help */}
      <section className="bg-apple-blue py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <Reveal>
            <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-[16px] text-white/80 mb-8">
              Our team is available Monday–Friday 9am–6pm PT. We typically respond within 2 hours.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/contact" className="px-8 py-4 bg-apple-dark text-white font-semibold rounded-full hover:bg-black transition">
                Schedule a Demo
              </Link>
              <Link to="/contact" className="px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition">
                Contact Support
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
