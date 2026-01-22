import AnimatedSection from '../../components/landing/AnimatedSection';
import { Trophy, TrendingDown } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Quote and Stats */}
          <div>
            <AnimatedSection delay={0}>
              <h5 className="font-heading text-[23px] font-medium leading-[1.215] tracking-[-0.02em] text-[var(--landing-text-secondary)] mb-8">
                Elementra crafts custom web apps that drive change for clients worldwide. Our skilled team turns ideas into secure and smooth digital tools. We help boost growth and build trust through great tech, clear work, and consistent results.
              </h5>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="flex items-center gap-4 mb-12">
                <img
                  src="/landing-images/custom-img-12-copyright.jpg"
                  alt="John Smith"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h6 className="font-heading text-[19px] font-medium text-[var(--landing-text-primary)]">
                    John Smith
                  </h6>
                  <p className="text-[var(--landing-text-meta)] text-sm">
                    Chief officer
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-[30px] bg-[var(--landing-bg-secondary)]/50 border border-[var(--landing-border)]">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="font-heading text-[57px] font-medium text-[var(--landing-text-primary)]">
                    5x
                  </h1>
                  <Trophy className="w-8 h-8 text-[var(--landing-primary)]" />
                </div>
                <h5 className="font-heading text-[23px] font-medium text-[var(--landing-text-primary)] mb-2">
                  Next-level vision
                </h5>
                <p className="text-[var(--landing-text-secondary)]">
                  Building robust, secure, and smooth web solutions.
                </p>
              </div>

              <div className="p-6 rounded-[30px] bg-[var(--landing-bg-secondary)]/50 border border-[var(--landing-border)]">
                <TrendingDown className="w-8 h-8 text-[var(--landing-primary)] mb-3" />
                <h5 className="font-heading text-[23px] font-medium text-[var(--landing-text-primary)] mb-2">
                  Expert web platforms
                </h5>
                <p className="text-[var(--landing-text-secondary)]">
                  Developing web tools to help your business grow fast.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Images */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatedSection delay={0.2}>
              <img
                src="/landing-images/custom-img-23-copyright.jpg"
                alt="About Image 1"
                className="rounded-[30px] w-full"
              />
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <img
                src="/landing-images/custom-img-24-copyright.jpg"
                alt="About Image 2"
                className="rounded-[30px] w-full"
              />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
