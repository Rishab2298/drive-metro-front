import { motion } from 'framer-motion';

const InfoBox = ({ icon, title, description, delay = 0 }) => {
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
      className="p-6 rounded-[30px] bg-bg-secondary/50 border border-border hover:border-primary/30 transition-colors duration-300"
    >
      {icon && (
        <div className="mb-4 text-primary">
          {icon}
        </div>
      )}
      {title && (
        <h5 className="font-heading text-[23px] font-medium leading-[1.215] tracking-[-0.02em] text-text-primary mb-3">
          {title}
        </h5>
      )}
      {description && (
        <p className="text-text-secondary leading-[1.625]">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default InfoBox;
