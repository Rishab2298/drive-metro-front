const TestimonialCard = ({ title, quote, authorImage, authorName, location }) => {
  return (
    <div className="p-8 rounded-[30px] bg-bg-secondary/50 border border-border">
      {title && (
        <h2 className="font-heading text-[47px] font-medium leading-[1.13] tracking-[-0.02em] text-text-primary mb-6">
          {title}
        </h2>
      )}

      {quote && (
        <p className="text-[23px] font-heading font-medium leading-[1.215] tracking-[-0.02em] text-text-secondary mb-8">
          {quote}
        </p>
      )}

      <div className="flex items-center gap-4">
        {authorImage && (
          <img
            src={authorImage}
            alt={authorName}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          {authorName && (
            <h6 className="font-heading text-[19px] font-medium text-text-primary mb-1">
              {authorName}
            </h6>
          )}
          {location && (
            <p className="text-text-meta text-sm">
              {location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
