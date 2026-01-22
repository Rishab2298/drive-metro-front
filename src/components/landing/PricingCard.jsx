import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PricingCard = ({
  name,
  price,
  period = 'month',
  features = [],
  recommended = false,
  delay = 0,
  ctaLink = '#'
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`relative p-8 rounded-[30px] border transition-all duration-300 ${
        recommended
          ? 'bg-bg-secondary border-primary shadow-lg'
          : 'bg-bg-secondary/50 border-border hover:border-primary/30'
      }`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
            Recommended
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h5 className="font-heading text-[23px] font-medium text-text-primary mb-2">
          {name}
        </h5>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-[47px] font-heading font-medium text-text-primary">
            ${price}
          </span>
          <span className="text-text-secondary">/{period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={ctaLink}
        className="block w-full text-center py-4 px-8 rounded-[30px] bg-primary hover:bg-primary-dark text-white font-heading font-medium transition-colors duration-300"
      >
        Select Plan
      </a>
    </motion.div>
  );
};

export default PricingCard;
