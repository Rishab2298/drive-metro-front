import AnimatedSection from '../../components/landing/AnimatedSection';
import InfoBox from '../../components/landing/InfoBox';
import { BarChart3, Globe, Diamond } from 'lucide-react';

const DigitalSolutions = () => {
  const solutions = [
    {
      icon: <BarChart3 size={32} />,
      title: "Tailored web solutions",
      description: "Elementra delivers secure custom apps that power business success.",
      delay: 0
    },
    {
      icon: <Globe size={32} />,
      title: "Cloud SaaS solutions",
      description: "We build cloud apps that help you grow, adapt, and lead today.",
      delay: 0.1
    },
    {
      icon: <Diamond size={32} />,
      title: "Business portal design",
      description: "Elementra builds smart hubs that boost how teams share and work.",
      delay: 0.2
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <AnimatedSection delay={0} className="text-center mb-12">
          <h6 className="font-heading text-[19px] font-medium text-[var(--landing-text-meta)] mb-4">
            Digital solutions
          </h6>
          <h1 className="font-heading text-[57px] font-medium leading-[1.105] tracking-[-0.02em] text-[var(--landing-text-primary)]">
            We build advanced web experiences
          </h1>
        </AnimatedSection>

        <AnimatedSection stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <InfoBox
              key={index}
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
              delay={solution.delay}
            />
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default DigitalSolutions;
