import AnimatedSection from '../../components/landing/AnimatedSection';
import { Box } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 py-32 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 opacity-50">
        <img src="/landing-images/decor-blur.png" alt="" className="w-96" />
      </div>
      <div className="absolute bottom-20 left-0 opacity-30">
        <img src="/landing-images/decor-dots.png" alt="" className="w-80" />
      </div>

      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <AnimatedSection delay={0}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Box className="w-5 h-5 text-[var(--landing-primary)]" />
            <span className="font-heading text-[19px] font-medium text-[var(--landing-text-meta)]">
              How it works
            </span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h1 className="font-heading text-[57px] md:text-[72px] font-medium leading-[1.105] tracking-[-0.02em] text-[var(--landing-text-primary)] mb-6">
            AI-powered solutions for your business
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-[var(--landing-text-secondary)] text-lg leading-[1.625] mb-8 max-w-2xl mx-auto">
            Empower your business with cutting-edge AI solutions designed to automate processes, enhance decision-making, and drive growth.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <a
            href="#contact"
            className="inline-block py-4 px-10 rounded-[30px] bg-[var(--landing-primary)] hover:bg-[var(--landing-primary-dark)] text-white font-heading font-medium transition-colors duration-300"
          >
            Get Started
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;
