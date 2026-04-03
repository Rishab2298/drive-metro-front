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

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', drivers: '', message: '', type: 'demo' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
    <Header />
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-50/80 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[13px] font-semibold text-apple-blue mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-apple-blue animate-pulse" />
            Talk to a DSP Specialista
          </div>
          <h1 className="text-[52px] md:text-[64px] font-black leading-tight tracking-[-3px] text-apple-dark mb-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
            Let's talk<br />
            <span className="text-apple-blue">DSP performance.</span>
          </h1>
          <p className="text-[17px] text-apple-mid leading-relaxed animate-fade-up" style={{ animationDelay: '160ms' }}>
            Schedule a live demo, ask a question, or get a walkthrough with one of our DSP specialists.
          </p>
        </div>
      </section>

      <section className="bg-apple-gray py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 items-start">

            {/* Contact info */}
            <div className="md:col-span-2 space-y-5">
              <Reveal>
                <div className="bg-white rounded-3xl p-7 shadow-apple">
                  <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-xl mb-4">📅</div>
                  <h3 className="text-[16px] font-bold text-apple-dark mb-2">Schedule a Demo</h3>
                  <p className="text-[13px] text-apple-mid leading-relaxed">
                    See DiveMetric live with a DSP specialist who will walk you through your specific use case.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="bg-white rounded-3xl p-7 shadow-apple">
                  <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl mb-4">💬</div>
                  <h3 className="text-[16px] font-bold text-apple-dark mb-2">Live Chat Support</h3>
                  <p className="text-[13px] text-apple-mid leading-relaxed">
                    Available Monday–Friday 9am–6pm PT. Typical response time: under 2 hours.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="bg-white rounded-3xl p-7 shadow-apple">
                  <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center text-xl mb-4">✉️</div>
                  <h3 className="text-[16px] font-bold text-apple-dark mb-2">Email Us</h3>
                  <p className="text-[13px] text-apple-mid leading-relaxed">
                    <a href="mailto:hello@divemetric.com" className="text-apple-blue hover:underline">
                      hello@divemetric.com
                    </a>
                    <br />We respond to all emails within one business day.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="bg-apple-blue rounded-3xl p-7 text-white">
                  <p className="text-[13px] font-semibold text-white/70 uppercase tracking-widest mb-3">Average Response</p>
                  <p className="text-[40px] font-black tracking-tight mb-1">{'< 2hrs'}</p>
                  <p className="text-[13px] text-white/70">during business hours</p>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="md:col-span-3">
              <Reveal>
                <div className="bg-white rounded-3xl p-8 shadow-apple-lg">
                  {sent ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
                      <h3 className="text-[24px] font-black text-apple-dark mb-3">Message sent!</h3>
                      <p className="text-[15px] text-apple-mid leading-relaxed max-w-sm mx-auto">
                        We'll be in touch within 2 hours. In the meantime, feel free to{' '}
                        <a href="/pricing" className="text-apple-blue hover:underline">start your free trial</a>.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <h2 className="text-[22px] font-black text-apple-dark mb-6">Get in touch</h2>

                      {/* Request type */}
                      <div className="flex gap-3">
                        {[
                          { val: 'demo',    label: '📅 Schedule Demo' },
                          { val: 'support', label: '💬 Get Support' },
                          { val: 'other',   label: '✉️ General' },
                        ].map(({ val, label }) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setForm({ ...form, type: val })}
                            className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                              form.type === val
                                ? 'bg-apple-blue text-white shadow-apple-sm'
                                : 'bg-apple-gray text-apple-mid hover:bg-apple-border/40'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-semibold text-apple-mid uppercase tracking-wide mb-1.5">Name *</label>
                          <input
                            name="name" required value={form.name} onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 bg-apple-gray border border-apple-border/60 rounded-xl text-[14px] text-apple-dark placeholder:text-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-apple-mid uppercase tracking-wide mb-1.5">Email *</label>
                          <input
                            name="email" type="email" required value={form.email} onChange={handleChange}
                            placeholder="you@yourdsp.com"
                            className="w-full px-4 py-3 bg-apple-gray border border-apple-border/60 rounded-xl text-[14px] text-apple-dark placeholder:text-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-semibold text-apple-mid uppercase tracking-wide mb-1.5">Company / DSP Name</label>
                          <input
                            name="company" value={form.company} onChange={handleChange}
                            placeholder="FleetPro DSP"
                            className="w-full px-4 py-3 bg-apple-gray border border-apple-border/60 rounded-xl text-[14px] text-apple-dark placeholder:text-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-apple-mid uppercase tracking-wide mb-1.5">Number of Drivers</label>
                          <select
                            name="drivers" value={form.drivers} onChange={handleChange}
                            className="w-full px-4 py-3 bg-apple-gray border border-apple-border/60 rounded-xl text-[14px] text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition"
                          >
                            <option value="">Select range</option>
                            <option>1–20</option>
                            <option>21–50</option>
                            <option>51–100</option>
                            <option>100+</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-apple-mid uppercase tracking-wide mb-1.5">Message</label>
                        <textarea
                          name="message" value={form.message} onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your current challenges or what you'd like to see in the demo..."
                          className="w-full px-4 py-3 bg-apple-gray border border-apple-border/60 rounded-xl text-[14px] text-apple-dark placeholder:text-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue transition resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-apple-blue text-white font-bold text-[16px] rounded-full hover:bg-apple-blueDark transition-all duration-200 shadow-apple hover:shadow-apple-lg active:scale-[0.98]"
                      >
                        Send Message →
                      </button>

                      <p className="text-center text-[12px] text-apple-light">
                        We respect your privacy. Your information is never shared.
                      </p>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  )
}
