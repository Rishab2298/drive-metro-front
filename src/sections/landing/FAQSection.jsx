import { useState } from 'react';
import AnimatedSection from '../../components/landing/AnimatedSection';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(1); // Question 2 is open by default

  const faqs = [
    {
      question: "How do I get started with Elementra?",
      answer: "To begin, send us an email or fill out the form on our site. We'll set up a chat to learn about your needs and craft your solution."
    },
    {
      question: "Can I book a virtual meeting with you?",
      answer: "Yes, our team is happy to meet through video calls, so clients from any place can connect with us at their own ease."
    },
    {
      question: "What industries do you usually work with?",
      answer: "Our main clients include tech, retail, and other sectors, with each app built to match the needs of your own company."
    },
    {
      question: "Do you support early-stage companies?",
      answer: "We enjoy working with startups! Our team offers tools and guidance to help new firms grow and reach long-term goals."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-[900px] mx-auto">
        <AnimatedSection delay={0} className="text-center mb-12">
          <h6 className="font-heading text-[19px] font-medium text-[var(--landing-text-meta)] mb-4">
            Need help?
          </h6>
          <h1 className="font-heading text-[57px] font-medium leading-[1.105] tracking-[-0.02em] text-[var(--landing-text-primary)] mb-6">
            Frequently asked questions
          </h1>
          <p className="text-[var(--landing-text-secondary)] leading-[1.625] max-w-2xl mx-auto">
            Elementra helps your business grow online, offering web solutions that fit your goals and keep you ahead in digital trends.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[var(--landing-border)] rounded-[20px] overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left bg-[var(--landing-bg-secondary)]/30 hover:bg-[var(--landing-bg-secondary)]/50 transition-colors duration-300"
              >
                <h5 className="font-heading text-[23px] font-medium text-[var(--landing-text-primary)]">
                  {faq.question}
                </h5>
                <ChevronDown
                  className={`w-6 h-6 text-[var(--landing-primary)] transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-5 bg-[var(--landing-bg-secondary)]/20">
                  <p className="text-[var(--landing-text-secondary)] leading-[1.625]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQSection;
