import AnimatedSection from '../../components/landing/AnimatedSection';

const ShowcaseImage = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1920px] mx-auto">
        <AnimatedSection delay={0}>
          <img
            src="/landing-images/custom-img-22-copyright.jpg"
            alt="Showcase"
            className="w-full rounded-[30px]"
          />
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ShowcaseImage;
