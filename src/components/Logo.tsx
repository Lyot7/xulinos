'use client';

import { useRouter } from 'next/navigation';

interface LogoProps {
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({
  color = "var(--color-pure-white)", 
  className = "",
  width = 74,
  height = 71 
}: LogoProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <img 
      src="/branding/logo/combination-mark-hand.svg"
      alt="Xulinos Logo"
      width={width}
      height={height}
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
    />
  );
}