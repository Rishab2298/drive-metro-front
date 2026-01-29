import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { FileText, Mail, ArrowLeft } from 'lucide-react';

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

const TermsConditions = () => {
  const sections = [
    {
      title: 'Introduction',
      content: (
        <>
          <p className="mb-4">
            DiveMetric is a platform provided by <strong className="text-slate-900 dark:text-white">Kilimanjaro Innovation Labs Inc.</strong> ("we", "us", "our"), a company established under the laws of Delaware, USA.
          </p>
          <p className="mb-4">
            These platform terms of use ("Platform Terms") apply to all users of DiveMetric, our software applications, websites, mobile apps, and such other technologies which we may make available (collectively the "Platform").
          </p>
          <p className="mb-4">
            These Platform Terms should be read in conjunction with our <Link to="/privacy-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>, which together make up the "Agreement" between us. By accessing and using DiveMetric, you accept and agree to the terms of this Agreement. If you do not understand or agree with the Agreement, you should not use DiveMetric.
          </p>
          <p>
            From time to time, we may refine or change aspects of the Agreement and any revised terms or policies will be made available to you at <a href="https://divemetric.com/terms-of-service" className="text-indigo-600 dark:text-indigo-400 hover:underline">divemetric.com/terms-of-service</a>. Please take a moment to read the changes. If you continue to use the Platform after we make the changes, you will be deemed to agree to the changes.
          </p>
        </>
      ),
    },
    {
      title: 'Registration',
      content: (
        <>
          <p className="mb-4">
            In order to use certain parts of our Platform you may be required to register for an account by providing your name, phone number, location, email address and password, if applicable.
          </p>
          <p className="mb-4">
            You must ensure that the details provided by you on registration or at any time are correct and complete. You must inform us immediately of any changes to the information that you provide when registering by updating your personal details to ensure we can communicate with you effectively.
          </p>
          <p className="mb-4">
            Names, email addresses and profile pictures must not: (i) be obscene or offensive, (ii) infringe any third party rights, or (iii) otherwise (in our absolute discretion) be considered inappropriate.
          </p>
          <p>
            You may cancel your registration and/or ask us to deactivate your account at any time by submitting a support request to <a href="mailto:hello@divemetric.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">hello@divemetric.com</a>. If you do so, you must immediately stop using the Platform. We will delete your account within 30 days of receiving your request (subject to certain data we need to retain for legal and financial record keeping purposes).
          </p>
        </>
      ),
    },
    {
      title: 'Passwords and Security',
      content: (
        <>
          <p className="mb-4">
            When you register on the Platform, you will be asked to provide and verify your mobile phone number, which we will use to authenticate you and give you access to your account. You may also be asked to create a password, which you should keep confidential and not disclose or share with anyone.
          </p>
          <p className="mb-4">
            We will be entitled to treat any action carried out through your account as being carried out by you. You must notify us immediately if you have reason to believe that your account details may have been compromised or used by any other person.
          </p>
          <p>
            If we have reason to believe that there is or is likely to be any misuse of the Platform or breach of security, we may require you to change your password, require re-verification, and/or suspend your account.
          </p>
        </>
      ),
    },
    {
      title: 'Using the Platform',
      content: (
        <>
          <p className="mb-4">
            Our Platform is intended for use only by those who can access it from within the United States of America. If you choose to access our Platform from locations outside the Territory, you are responsible for compliance with local laws and we make no guarantee that features will be available or work as expected.
          </p>
          <p className="mb-4">
            You are responsible for making all arrangements necessary to access our Platform. In particular, you are responsible for ensuring that your computer and/or portable device is compatible with our Platform.
          </p>
          <p>
            All users must be at least 18 years old to use the DiveMetric platform.
          </p>
        </>
      ),
    },
    {
      title: 'Prohibited Uses',
      content: (
        <>
          <p className="mb-4">You must not (and you must not cause any other person to):</p>
          <ul className="space-y-2">
            {[
              'Use any automated system or software to extract content or data from the Platform for commercial purposes, except where you or any applicable third party has entered into a written agreement with us that permits such activity',
              'Interfere with, damage or disrupt the Platform or any servers or networks connected to the Platform, including by transmitting any worms, viruses, malware, spyware or any other code of a destructive, malicious or disruptive nature',
              'Access the Platform via a means not authorized in writing in advance by us, including but not limited to, automated devices, scripts, bots, spiders, crawlers or scrapers',
              'Attempt to restrict another user of the Platform from using or enjoying the Platform and you must not encourage or facilitate the breach of these Platform Terms by others',
              'Use the Platform for any illegal or unauthorized purpose or in any way that advocates, promotes or assists any unlawful act',
              'Use the Platform in any way that is defamatory, obscene, offensive, or promotes discrimination based on race, sex, religion, nationality, disability, sexual orientation or age',
              'Change, modify, adapt or alter the Platform or change, modify or alter another website so as to inaccurately imply an association with the Platform or us',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      title: 'Intellectual Property',
      content: (
        <>
          <p className="mb-4">
            Our Platform and all information, images, photographs, videos and other content displayed on our Platform ("Materials") are protected by certain rights. These rights include all patents, rights to inventions, copyright, database rights, moral rights, trademarks and service marks, business names and domain names, goodwill, rights in designs and all other intellectual property and proprietary rights ("Rights"). These Rights either belong directly to us or are licensed to us from their respective owners or licensors.
          </p>
          <p className="mb-4">
            You may only view, print out, use, quote from and cite the Platform and the Materials for your own personal, non-commercial use and on the condition that you give appropriate acknowledgment to us where appropriate.
          </p>
          <p className="mb-4">Your use of our Platform and the Materials is subject to the following restrictions. You must not:</p>
          <ul className="space-y-2">
            {[
              'Copy the Platform except where such copying is incidental to normal use of the Platform, or where it is necessary for the purpose of back-up or operational security',
              'Sub-licence or otherwise make available the Platform in whole or in part, in any form to any person without our prior written consent',
              'Remove any copyright or other proprietary notices contained in the Materials',
              'Disassemble, decompile, reverse-engineer or create derivative works based on the whole or any part of the Platform',
              'Use the Platform or Materials in any way that is in contravention of any applicable law or regulation',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      title: 'Uploading Your Content',
      content: (
        <>
          <p className="mb-4">On certain parts of our Platform, you may be invited to upload materials. If you choose to upload such materials, your content must not:</p>
          <ul className="space-y-2 mb-4">
            {[
              'Contain any material which is or may reasonably be considered to be threatening, defamatory, obscene, indecent, offensive, pornographic, abusive, or inflammatory',
              'Be illegal or infringe the Rights of any third party, in any country in the world',
              'Be technically harmful (including computer viruses, logic bombs, Trojan horses, worms, harmful components, corrupted data or other malicious software)',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            By uploading your content to the Platform, you hereby grant us an irrevocable non-exclusive license (which is unlimited in time) to view and use your content without restriction, including for commercial purposes.
          </p>
        </>
      ),
    },
    {
      title: 'Links to Third Party Websites',
      content: (
        <>
          <p className="mb-4">
            The Platform may include links to third party websites, applications and/or other digital properties ("Third Party Properties") that are controlled and maintained by third parties. If you decide to visit any Third Party Property, you do so at your own risk.
          </p>
          <p>
            Your interaction with any Third Party Property is subject to the relevant third party's own terms and policies. Please read all applicable terms and policies of the relevant third party before using a Third Party Property.
          </p>
        </>
      ),
    },
    {
      title: 'Availability of the Platform',
      content: (
        <>
          <p className="mb-4">
            We provide the Platform on an "as is" and "as available" basis. We give no warranty that the Platform will be free of defects and/or faults, that defects will be corrected or that the Platform or the server that makes it available are free of viruses or anything else which may be harmful or destructive.
          </p>
          <p className="mb-4">
            We may update some or all of the Platform and/or any of the services and/or content made available through it at any time and for any reason. If you choose not to install such updates, you may not be able to continue using the Platform or functionality may be impaired.
          </p>
          <p>
            We reserve the right to alter, suspend or discontinue any part (or the whole of) the Platform. Access to the Platform is permitted on a temporary basis and we reserve the right to withdraw access from the Platform for any reason and without notice.
          </p>
        </>
      ),
    },
    {
      title: 'Liability',
      content: (
        <>
          <p className="mb-4">Nothing in these Platform Terms affects your statutory rights. In particular, we do not exclude our liability for:</p>
          <ul className="space-y-2 mb-4">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Death or personal injury caused by negligence</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Any matter for which it would be illegal for us to limit or exclude our liability</span>
            </li>
          </ul>
          <p className="mb-4">
            We will not be liable to you in respect of any losses arising out of any event or circumstance beyond our reasonable control.
          </p>
          <p className="mb-4">
            You will be responsible for all claims, liabilities, damages, costs and expenses suffered or incurred by us as a result of your breach of these Platform Terms.
          </p>
          <p>
            To the maximum extent permitted by law, our maximum liability to you in respect of your use of our Platform or any matter arising under or in connection with these Platform Terms is $50.
          </p>
        </>
      ),
    },
    {
      title: 'General Provisions',
      content: (
        <ul className="space-y-3">
          {[
            'If any court or competent authority finds that any provision of these Platform Terms is invalid, illegal or unenforceable, the validity and enforceability of the other provisions will not be affected.',
            'You may not assign, sub-license or otherwise transfer any rights under these Platform Terms.',
            'Nothing in these Platform Terms will establish any partnership or joint venture between us.',
            'These Platform Terms do not give rise to any rights to any third party to enforce any term of this Agreement.',
            'If we fail to exercise any right or remedy under our Platform Terms, our failure does not constitute a waiver of that right or remedy.',
            'Any notice to be delivered in relation to these Platform Terms must be in writing and delivered to the registered address or sent by email.',
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
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
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Please read these terms carefully before using the DiveMetric platform.
              </p>
            </div>
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
                Enquiries & Complaints
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                If you have an enquiry or complaint about our Platform, please contact us. We will try to answer your inquiry or resolve any complaint as soon as possible.
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

export default TermsConditions;
