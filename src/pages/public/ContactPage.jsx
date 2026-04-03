import { useState } from 'react'
import {
  Mail, Phone, Send, CheckCircle2, Building2,
  User, MessageSquare, Clock, ArrowRight, Users, Zap, Star,
} from 'lucide-react'
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

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '', subject: '', message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004'
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send message')
      setIsSubmitted(true)
    } catch (err) {
      console.error('Contact form error:', err)
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "w-full px-4 py-3.5 bg-apple-gray border border-apple-border/60 rounded-xl text-[14px] text-apple-dark placeholder:text-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition"
  const inputWithIconClass = "w-full pl-11 pr-4 py-3.5 bg-apple-gray border border-apple-border/60 rounded-xl text-[14px] text-apple-dark placeholder:text-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition"
  const labelClass = "block text-[12px] font-semibold text-apple-mid uppercase tracking-wide mb-1.5"

  return (
    <>
      <Header />
      <div className="pt-16">

        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-50/90 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* Subtle side glows */}
          <div className="absolute top-16 left-0 w-72 h-72 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-16 right-0 w-72 h-72 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[13px] font-semibold text-apple-blue mb-8 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-apple-blue animate-pulse" />
              Talk to a DSP Specialist
            </div>

            <h1
              className="text-[36px] sm:text-[48px] md:text-[64px] font-black leading-tight tracking-[-3px] text-apple-dark mb-5 animate-fade-up"
              style={{ animationDelay: '80ms' }}
            >
              Let's talk<br />
              <span className="text-apple-blue">DSP performance.</span>
            </h1>

            <p
              className="text-[17px] text-apple-mid leading-relaxed mb-10 animate-fade-up"
              style={{ animationDelay: '160ms' }}
            >
              Schedule a live demo, ask a question, or get a walkthrough<br className="hidden md:block" /> with one of our DSP specialists.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
              {[
                { icon: Users, value: '500+', label: 'DSP owners trust us' },
                { icon: Zap,   value: '35%',  label: 'avg performance boost' },
                { icon: Clock, value: '< 2hr', label: 'response time' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-apple-border/60 shadow-apple-sm">
                  <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-apple-blue" />
                  </div>
                  <div className="text-left">
                    <div className="text-[15px] font-bold text-apple-dark leading-none">{value}</div>
                    <div className="text-[11px] text-apple-light mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ── Form + Sidebar ─────────────────────────────────── */}
        <section className="bg-apple-gray py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid lg:grid-cols-5 gap-8 items-start">

              {/* Form */}
              <Reveal className="lg:col-span-3">
                <div className="bg-white rounded-3xl shadow-apple-lg overflow-hidden">
                  {/* Blue accent top bar */}
                  <div className="h-1.5 bg-apple-blue w-full" />

                  <div className="p-8">
                    {isSubmitted ? (
                      <div className="text-center py-14">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
                          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-[26px] font-black text-apple-dark mb-3">Message sent!</h3>
                        <p className="text-[15px] text-apple-mid leading-relaxed max-w-sm mx-auto mb-8">
                          We'll be in touch within 2 hours. In the meantime, feel free to{' '}
                          <a href="/pricing" className="text-apple-blue hover:underline">start your free trial</a>.
                        </p>
                        <button
                          onClick={() => {
                            setIsSubmitted(false)
                            setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' })
                          }}
                          className="px-7 py-3.5 bg-apple-gray text-apple-dark font-semibold text-[14px] rounded-full hover:bg-apple-border/40 transition"
                        >
                          Send another message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="mb-7">
                          <h2 className="text-[22px] font-black text-apple-dark">Get in touch</h2>
                          <p className="text-[13px] text-apple-light mt-1">We'll respond within 2 business hours.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Full Name *</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-light" />
                              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className={inputWithIconClass} />
                            </div>
                          </div>
                          <div>
                            <label className={labelClass}>Email *</label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-light" />
                              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@yourdsp.com" className={inputWithIconClass} />
                            </div>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Company / DSP Name</label>
                            <div className="relative">
                              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-light" />
                              <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="FleetPro DSP" className={inputWithIconClass} />
                            </div>
                          </div>
                          <div>
                            <label className={labelClass}>Phone</label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-light" />
                              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={inputWithIconClass} />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Topic *</label>
                          <select name="subject" required value={formData.subject} onChange={handleChange} className={inputClass}>
                            <option value="">Select a topic</option>
                            <option value="demo">Request a Demo</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="sales">Sales Question</option>
                            <option value="partnership">Partnership Opportunity</option>
                            <option value="feedback">Feedback</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>Message *</label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-apple-light" />
                            <textarea
                              name="message" rows={5} required value={formData.message} onChange={handleChange}
                              placeholder="Tell us about your fleet size, current challenges, or what you'd like to see in the demo..."
                              className={`${inputWithIconClass} resize-none`}
                            />
                          </div>
                        </div>

                        {error && (
                          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
                            {error}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-full font-bold text-[16px] text-white transition-all duration-200 shadow-apple hover:shadow-apple-lg active:scale-[0.98] ${
                            isSubmitting ? 'bg-apple-light cursor-not-allowed' : 'bg-apple-blue hover:bg-apple-blueDark'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Message
                            </>
                          )}
                        </button>

                        <p className="text-center text-[12px] text-apple-light">
                          We respect your privacy. Your information is never shared.
                        </p>
                      </form>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-4">

                {/* Response time card */}
                <Reveal>
                  <div className="bg-apple-blue rounded-3xl p-7 text-white relative overflow-hidden">
                    {/* Subtle pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[16px] font-bold">Quick Response</p>
                          <p className="text-white/60 text-[12px]">Mon–Fri, 9am–6pm PT</p>
                        </div>
                      </div>
                      <p className="text-[44px] font-black tracking-tight leading-none mb-1">{'< 2hrs'}</p>
                      <p className="text-white/60 text-[13px] mb-5">typical response during business hours</p>
                      <div className="pt-5 border-t border-white/20 space-y-2.5">
                        {['Dedicated support team', 'Personalized walkthroughs', 'No sales pressure'].map((t) => (
                          <div key={t} className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0" />
                            <span className="text-white/90 text-[13px]">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Email */}
                <Reveal delay={80}>
                  <a
                    href="mailto:hello@divemetric.com"
                    className="flex items-center gap-4 bg-white rounded-3xl p-6 shadow-apple hover:shadow-apple-lg border border-apple-border/40 hover:border-apple-blue/20 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Mail className="w-5 h-5 text-apple-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-apple-dark">Email Us</p>
                      <p className="text-[13px] text-apple-blue truncate">hello@divemetric.com</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-apple-light group-hover:text-apple-blue group-hover:translate-x-0.5 transition-all shrink-0" />
                  </a>
                </Reveal>

                {/* Testimonial */}
                <Reveal delay={160}>
                  <div className="bg-white rounded-3xl p-6 shadow-apple border border-apple-border/40">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[13px] text-apple-mid leading-relaxed mb-4 italic">
                      "The team was super responsive — had a demo booked same day. Within a week we were sending scorecards to all 47 drivers automatically."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-apple-blue flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        MR
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-apple-dark">Michael R.</p>
                        <p className="text-[11px] text-apple-light">DSP Owner · Sumner, WA</p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* FAQ */}
                <Reveal delay={240}>
                  <a
                    href="/faq"
                    className="flex items-center gap-4 bg-white rounded-3xl p-6 shadow-apple hover:shadow-apple-lg border border-apple-border/40 hover:border-amber-300/40 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors text-xl">
                      ❓
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-apple-dark">Browse the FAQ</p>
                      <p className="text-[12px] text-apple-light">Quick answers to common questions</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-apple-light group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </a>
                </Reveal>

              </div>
            </div>
          </div>
        </section>

        {/* ── Orange CTA strip ───────────────────────────────── */}
        <section className="bg-[#E8734A] py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <p className="text-white/80 text-[17px] font-medium mb-3">
                Not ready to talk yet?
              </p>
              <p className="text-white text-[20px] font-bold mb-6">
                Start your free 30-day trial — no credit card, setup in under 5 minutes.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-apple-dark text-white font-semibold text-[15px] rounded-full hover:bg-white hover:text-apple-dark transition-all duration-200"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}

export default ContactPage
