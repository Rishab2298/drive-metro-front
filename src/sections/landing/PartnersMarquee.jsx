import AnimatedSection from '../../components/landing/AnimatedSection';
import MarqueeContainer from '../../components/landing/MarqueeContainer';

const PartnersMarquee = () => {
  const partnerLogos = [
    'custom-img-01-copyright.png',
    'custom-img-02-copyright.png',
    'custom-img-03-copyright.png',
    'custom-img-04-copyright.png',
    'custom-img-06-copyright.png',
    'custom-img-05-copyright.png',
    'custom-img-19-copyright.png',
    'custom-img-18-copyright.png',
    'custom-img-16-copyright.png',
    'custom-img-17-copyright.png'
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <AnimatedSection delay={0}>
          <h6 className="font-heading text-[19px] font-medium text-[var(--landing-text-meta)] text-center mb-12">
            Trusted partners
          </h6>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <MarqueeContainer speed={1} direction="left">
            {partnerLogos.map((logo, index) => (
              <div key={index} className="px-6 flex-shrink-0">
                <img
                  src={`/landing-images/${logo}`}
                  alt={`Partner ${index + 1}`}
                  className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </MarqueeContainer>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PartnersMarquee;
