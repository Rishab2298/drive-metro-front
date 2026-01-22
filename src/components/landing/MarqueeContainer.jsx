import { useEffect, useRef } from 'react';

const MarqueeContainer = ({ children, speed = 1, direction = 'left' }) => {
  const marqueeRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const content = contentRef.current;
    if (!marquee || !content) return;

    // Clone the content for seamless loop
    const clone = content.cloneNode(true);
    marquee.appendChild(clone);

    let position = 0;
    const contentWidth = content.offsetWidth;
    const pixelsPerFrame = speed;

    const animate = () => {
      if (direction === 'left') {
        position -= pixelsPerFrame;
        if (Math.abs(position) >= contentWidth) {
          position = 0;
        }
      } else {
        position += pixelsPerFrame;
        if (position >= contentWidth) {
          position = 0;
        }
      }

      marquee.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      if (clone && marquee.contains(clone)) {
        marquee.removeChild(clone);
      }
    };
  }, [speed, direction]);

  return (
    <div className="overflow-hidden">
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        <div ref={contentRef} className="flex items-center gap-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MarqueeContainer;
