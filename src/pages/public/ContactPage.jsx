// Contact Us Page
import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Building2,
  User,
  MessageSquare,
  Clock,
  Headphones,
  Sparkles,
  ArrowRight,
  Users,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

// Background component matching HomePage
const GlobalBackground = () => (
  <div className="fixed inset-0 pointer-events-none -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-[#0c0a1d] dark:to-slate-950" />
    <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-indigo-400/10 dark:from-indigo-600/20 to-transparent blur-[150px]" />
    <div className="absolute top-[30%] right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-violet-400/8 dark:from-violet-600/15 to-transparent blur-[120px]" />
    <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-pink-400/8 dark:from-pink-500/10 to-transparent blur-[100px]" />
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
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'support@divemetric.com',
      href: 'mailto:support@divemetric.com',
      color: 'indigo',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      color: 'emerald',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'San Francisco, CA',
      href: null,
      color: 'violet',
    },
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Drivers Managed' },
    { icon: Zap, value: '35%', label: 'Performance Boost' },
    { icon: Clock, value: '24h', label: 'Response Time' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden relative isolate">
      <GlobalBackground />
      <Header />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              We'd love to hear from you
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-slate-900 dark:text-white">Get in </span>
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Have questions about DiveMetric? Want to see a demo? Our team is here to help you
              transform your fleet's performance.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
              >
                <stat.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Methods */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, i) => {
              const colorClasses = {
                indigo: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30',
                emerald: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/30',
                violet: 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 group-hover:bg-violet-200 dark:group-hover:bg-violet-500/30',
              };
              const Wrapper = method.href ? 'a' : 'div';
              return (
                <Wrapper
                  key={i}
                  href={method.href}
                  className={cn(
                    "group p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300",
                    method.href && "cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/30"
                  )}
                >
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors", colorClasses[method.color])}>
                    <method.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{method.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{method.description}</p>
                  {method.href && (
                    <div className="mt-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                      Contact now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Wrapper>
              );
            })}
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-white/5 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-8 md:p-10">
                {isSubmitted ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                      Message Sent!
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
                      }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/25"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Send us a Message
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Fill out the form below and we'll get back to you shortly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Email *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Company Name
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              placeholder="Acme Inc."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Inquiry</option>
                          <option value="demo">Request a Demo</option>
                          <option value="support">Technical Support</option>
                          <option value="sales">Sales Question</option>
                          <option value="partnership">Partnership Opportunity</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Message *
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                          <textarea
                            name="message"
                            rows={5}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                            placeholder="How can we help you?"
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full flex items-center justify-center gap-3 px-8 py-5 rounded-xl font-bold text-white text-lg transition-all",
                          isSubmitting
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-700 hover:via-violet-700 hover:to-pink-700 shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Response time */}
              <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Quick Response</h3>
                    <p className="text-white/80">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span className="text-white/90">Dedicated support team</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span className="text-white/90">Personalized assistance</span>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-white dark:bg-white/5 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Support Hours
                  </h3>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5">
                    <span>Monday - Friday</span>
                    <span className="font-semibold text-slate-900 dark:text-white">9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5">
                    <span>Saturday</span>
                    <span className="font-semibold text-slate-900 dark:text-white">10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span>Sunday</span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Closed</span>
                  </div>
                </div>
              </div>

              {/* FAQ Prompt */}
              <div className="bg-slate-100 dark:bg-white/5 rounded-3xl p-8 border border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Looking for answers?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Check out our help center for quick answers to common questions.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all"
                >
                  Visit Help Center
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
