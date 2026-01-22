import AnimatedSection from '../../components/landing/AnimatedSection';

const DigitalVision = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection delay={0}>
            <div>
              <h6 className="font-heading text-[19px] font-medium text-[var(--landing-text-meta)] mb-4">
                Digital vision
              </h6>
              <h1 className="font-heading text-[57px] font-medium leading-[1.105] tracking-[-0.02em] text-[var(--landing-text-primary)] mb-6">
                Power your future with purpose
              </h1>
              <p className="text-[var(--landing-text-secondary)] leading-[1.625] mb-8">
                Elementra builds web apps that help firms excel, merging smart design with strong code to fuel results.
              </p>
              <a
                href="#about"
                className="inline-block py-4 px-10 rounded-[30px] bg-[var(--landing-primary)] hover:bg-[var(--landing-primary-dark)] text-white font-heading font-medium transition-colors duration-300"
              >
                Learn More
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <img
              src="/landing-images/custom-img-20-copyright.jpg"
              alt="Digital Vision"
              className="rounded-[30px] w-full"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default DigitalVision;
