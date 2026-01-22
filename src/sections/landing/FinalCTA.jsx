import AnimatedSection from '../../components/landing/AnimatedSection';

const FinalCTA = () => {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-[900px] mx-auto text-center">
        <AnimatedSection delay={0}>
          <h1 className="font-heading text-[57px] md:text-[72px] font-medium leading-[1.105] tracking-[-0.02em] text-[var(--landing-text-primary)] mb-8">
            Unlock growth with custom web solutions now
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
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

export default FinalCTA;
