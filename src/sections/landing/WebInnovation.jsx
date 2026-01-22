import AnimatedSection from '../../components/landing/AnimatedSection';

const WebInnovation = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection delay={0} className="lg:order-2">
            <div>
              <h6 className="font-heading text-[19px] font-medium text-[var(--landing-text-meta)] mb-4">
                Web innovation
              </h6>
              <h1 className="font-heading text-[57px] font-medium leading-[1.105] tracking-[-0.02em] text-[var(--landing-text-primary)] mb-6">
                Innovating web for real impact
              </h1>
              <p className="text-[var(--landing-text-secondary)] leading-[1.625] mb-8">
                We help firms thrive through web design, agile builds, and tech that sparks growth and drives teams.
              </p>
              <a
                href="#pricing"
                className="inline-block py-4 px-10 rounded-[30px] bg-[var(--landing-primary)] hover:bg-[var(--landing-primary-dark)] text-white font-heading font-medium transition-colors duration-300"
              >
                Learn More
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="lg:order-1">
            <img
              src="/landing-images/custom-img-21-copyright.jpg"
              alt="Web Innovation"
              className="rounded-[30px] w-full"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default WebInnovation;
