import React from 'react';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  alt?: string;
}

const Logo = ({ 
  className, 
  size = 'md', 
  src = '/logo.svg', 
  alt = 'Xulinos Logo' 
}: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} object-contain ${className || ''}`}
    />
  );
};

export default Logo; 