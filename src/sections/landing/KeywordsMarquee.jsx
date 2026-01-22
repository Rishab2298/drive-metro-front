import MarqueeContainer from '../../components/landing/MarqueeContainer';
import { Target } from 'lucide-react';

const KeywordsMarquee = () => {
  const keywords = ['Elementra', 'Secure', 'Growth', 'Digital'];

  return (
    <section className="py-20 px-6 border-y border-[var(--landing-border)]">
      <MarqueeContainer speed={1} direction="left">
        {keywords.map((keyword, index) => (
          <div key={index} className="flex items-center gap-6 px-8">
            <span className="font-heading text-[47px] font-medium text-[var(--landing-text-primary)]">
              {keyword}
            </span>
            <Target className="w-8 h-8 text-[var(--landing-primary)]" />
          </div>
        ))}
      </MarqueeContainer>
    </section>
  );
};

export default KeywordsMarquee;
