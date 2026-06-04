'use client';

import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';

interface UnifiedParallaxBackgroundProps {
  imageUrl: string;
  speed?: number;
  children: React.ReactNode;
}

export function UnifiedParallaxBackground({
  imageUrl,
  speed = 0.2,
  children,
}: UnifiedParallaxBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { y } = useSpring({
    y: scrollY * speed,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  return (
    <div className="relative">
      <animated.div
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: y.to((y) => `translateY(${y}px)`),
        }}
      />
      {children}
    </div>
  );
}