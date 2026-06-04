'use client';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'image' | 'tag';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-emerald/20 via-emerald/40 to-emerald/20 bg-[length:200%_100%]';
  
  const variants = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    image: 'rounded-lg',
    tag: 'rounded-full',
  };
  
  const style = {
    width: width || (variant === 'text' ? '100%' : variant === 'tag' ? '60px' : 'auto'),
    height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '2rem' : variant === 'tag' ? '24px' : '100px'),
  };
  
  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={style}
    />
  );
}