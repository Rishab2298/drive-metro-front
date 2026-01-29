import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Shield, Mail, ArrowLeft } from 'lucide-react';

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const GlassCard = ({ children, className = '' }) => (
  <div
    className={`
      relative rounded-2xl overflow-hidden
      bg-white dark:bg-white/[0.03] backdrop-blur-xl
      border border-slate-200 dark:border-white/10
      shadow-lg dark:shadow-none
      ${className}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 dark:from-white/5 via-transparent to-transparent pointer-events-none" />
    <div className="relative">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Personal Information We Collect',
      content: (
        <>
          <p className="mb-4">
            <strong className="text-slate-900 dark:text-white">Personal Information You Provide:</strong> We collect the following categories of personal information from you when you interact with and/or use the Service:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Identification Information:</strong> We collect your name, email address and phone number.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Financial Information:</strong> Our payment processor(s) will collect the financial information necessary to process your payments, such as your payment card number and authentication details. Please note, however, that we store only a tokenized version of such information and do not maintain payment card information on our servers.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Communication Information:</strong> We may collect information when you contact us with questions or concerns and when you voluntarily respond to questionnaires, surveys or requests for market research seeking your opinion and feedback.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Commercial Information:</strong> We may retain a history of the products you browse and/or purchase using the Service.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Social Media Information:</strong> We have pages on social media sites like Instagram, Facebook, Medium, Twitter, and LinkedIn. When you interact with our Social Media Pages, we will collect personal information that you elect to provide to us.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Internet Activity Information:</strong> When you visit, use, and interact with the Service, we may receive certain information about your visit, use, or interactions including browser type, pages visited, and navigation patterns.</span>
            </li>
          </ul>
          <p className="mb-4">In particular, the following information is created and automatically logged in our systems:</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Log Information:</strong> Your Internet Protocol address, browser type and settings, date and time of your request, and how you interacted with the Site.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Device Information:</strong> Device name, operating system, and browser you are using.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Usage Information:</strong> Types of content you view or engage with, features you use, actions you take, and duration of your activities.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Location Information:</strong> We derive a rough estimate of your location from your IP address.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: 'Cookies',
      content: (
        <>
          <p className="mb-4">
            We use cookies to operate and administer our Site, gather usage data on our Site, and improve your experience on it. A "cookie" is a piece of information sent to your browser by a website you visit. Cookies can be stored on your computer for different periods of time.
          </p>
          <p className="mb-4">
            On most web browsers, you will find a "help" section on the toolbar. Please refer to this section for information on how to receive a notification when you are receiving a new cookie and how to turn cookies off.
          </p>
          <p>
            Please note that if you limit the ability of websites to set cookies, you may be unable to access certain parts of the Site and you may not be able to benefit from the full functionality of the Site.
          </p>
        </>
      ),
    },
    {
      title: 'Analytics',
      content: (
        <p>
          We use Google Analytics, a web analytics service provided by Google, Inc. ("Google"). Google Analytics uses cookies to help us analyze how users use the Site and enhance your experience when you use the Site. For more information on how Google uses this information, please visit Google's privacy policy.
        </p>
      ),
    },
    {
      title: 'How We Use Personal Information',
      content: (
        <>
          <p className="mb-4">We may use personal information for the following purposes:</p>
          <ul className="space-y-2 mb-6">
            {[
              'To provide you with the Service, including responding to your inquiries, comments, feedback, or questions',
              'To send administrative information to you, such as information regarding the Service and changes to our terms, conditions, and policies',
              'To analyze how you interact with our Service',
              'To maintain and improve the Service',
              'To develop new products and services',
              'To prevent fraud, criminal activity, or misuses of our Service',
              'To comply with legal obligations and protect our rights, privacy, safety, or property',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mb-4">
            <strong className="text-slate-900 dark:text-white">Marketing:</strong> We may use your personal information to contact you about products or services we believe may be of interest to you. You may opt out of receiving marketing emails by following the instructions in each promotional email.
          </p>
        </>
      ),
    },
    {
      title: 'Sharing and Disclosure of Personal Information',
      content: (
        <>
          <p className="mb-4">
            We do not sell your personal information. In certain circumstances we may share the categories of personal information described above with the following third parties:
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Vendors and Service Providers:</strong> To assist us in meeting business operations needs and to perform certain services and functions.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your personal information may be transferred.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Legal Requirements:</strong> If required to do so by law or in the good faith belief that such action is necessary to comply with legal obligations.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900 dark:text-white">Affiliates:</strong> We may share personal information with our current and future affiliates.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: 'Data Retention',
      content: (
        <p>
          We keep personal information for as long as reasonably necessary for the purposes described in this Privacy Policy, while we have a business need to do so, or as required by law (e.g. for tax, legal, accounting, or other purposes), whichever is longer.
        </p>
      ),
    },
    {
      title: 'Security',
      content: (
        <p>
          You use the Service at your own risk. We implement commercially reasonable technical, administrative, and organizational measures to protect personal information both online and offline from loss, misuse, and unauthorized access, disclosure, alteration, or destruction. However, no Internet or e-mail transmission is ever fully secure or error free.
        </p>
      ),
    },
    {
      title: 'International Users',
      content: (
        <p>
          The Service is based in the United States. By using our Service, you understand and acknowledge that your personal data will be transferred from your location to our facilities and servers in the United States, where data protection laws may differ from those in your jurisdiction.
        </p>
      ),
    },
    {
      title: 'Your Choices',
      content: (
        <p>
          In certain circumstances providing personal information is optional. However, if you choose not to provide personal information that is needed to use some features of our Service, you may be unable to use those features. You can also contact us to request updates or corrections to your personal information.
        </p>
      ),
    },
    {
      title: 'Changes to the Privacy Policy',
      content: (
        <p>
          The Service and our business may change from time to time. As a result we may change this Privacy Policy at any time. When we do we will post an updated version on this page. By continuing to use our Service after we have posted an updated Privacy Policy, you consent to the revised Privacy Policy.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-[#0c0a1d] dark:to-slate-950" />
        <div className="absolute -top-[40%] -left-[20%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-500/5 dark:from-indigo-600/20 to-violet-500/5 dark:to-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/5 dark:from-violet-600/15 to-fuchsia-500/5 dark:to-fuchsia-600/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <AnimatedSection>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </AnimatedSection>

          {/* Header */}
          <AnimatedSection delay={0.1}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 mb-6 shadow-lg shadow-indigo-500/25">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
              </p>
            </div>
          </AnimatedSection>

          {/* Intro Card */}
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-8 mb-8">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong className="text-slate-900 dark:text-white">Kilimanjaro Innovation Labs Inc.</strong> ("Company," "we," "us," or "our") operates <strong className="text-indigo-600 dark:text-indigo-400">DiveMetric</strong> and has prepared this Privacy Policy to explain what personal information we collect, how we use and share that information, and your choices concerning our information practices in connection with our website at <a href="https://divemetric.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">divemetric.com</a> (the "Site"), our mobile application (the "App"), and the services made available through the Site and the App (collectively, the "Service").
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                This Privacy Policy is incorporated into and forms part of our <Link to="/terms-of-service" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</Link>.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Before using the Service or submitting any personal information to us, please review this Privacy Policy carefully. By using the Service, you agree to the practices described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not access the Site or otherwise use the Service.
              </p>
            </GlassCard>
          </AnimatedSection>

          {/* Sections */}
          {sections.map((section, index) => (
            <AnimatedSection key={section.title} delay={0.1 + index * 0.05}>
              <GlassCard className="p-8 mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/30 dark:to-violet-500/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {section.content}
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}

          {/* Contact Section */}
          <AnimatedSection delay={0.6}>
            <GlassCard className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/30 dark:to-violet-500/30 mb-4">
                <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Contact Us
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                If you have any questions about our Privacy Policy or information practices, please feel free to contact us at:
              </p>
              <a
                href="mailto:hello@divemetric.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-4 h-4" />
                hello@divemetric.com
              </a>
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-600">
                DiveMetric is a brand of Kilimanjaro Innovation Labs Inc.
              </p>
            </GlassCard>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
