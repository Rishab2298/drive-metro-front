import AnimatedSection from '../../components/landing/AnimatedSection';
import InfoBox from '../../components/landing/InfoBox';
import { Upload, Zap, Target } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Upload size={32} />,
      title: "Smart upload",
      description: "Effortlessly upload visuals for quick analysis and AI enhancements.",
      delay: 0
    },
    {
      icon: <Zap size={32} />,
      title: "Instant processing",
      description: "Seamlessly upload visuals for fast AI analysis and enhancements.",
      delay: 0.1
    },
    {
      icon: <Target size={32} />,
      title: "Adaptive input",
      description: "Import files and let AI optimize and elevate your content instantly.",
      delay: 0.2
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <AnimatedSection stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <InfoBox
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturesSection;
