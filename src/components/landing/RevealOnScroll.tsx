'use client';

import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function RevealOnScroll({ children, direction = 'up', delay = 0, className = '' }: RevealOnScrollProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-20px 0px',
  });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      default: return 'translateY(40px)';
    }
  };

  const styles = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px) translateX(0px)' : getInitialTransform(),
    config: { mass: 1, tension: 280, friction: 20 },
    delay: delay,
  });

  return (
    <animated.div ref={ref} style={styles} className={className}>
      {children}
    </animated.div>
  );
}