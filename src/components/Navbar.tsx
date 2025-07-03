'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavbarProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

const Navbar = ({ mobile = false, onLinkClick }: NavbarProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/couteaux', label: 'Les couteaux' },
    { href: '/affutage-remoulage', label: 'Affûtage & Rémoulage' },
    { href: '/a-propos', label: 'À propos' }
  ];

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className={`flex ${mobile ? 'flex-col items-start' : 'flex-row flex-wrap items-center'} justify-center gap-4 ${mobile ? 'gap-8 w-full' : 'gap-4'}`}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
                        (item.href !== '/' && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            className={
              mobile
                ? `text-white text-3xl font-normal transition-all duration-200 whitespace-nowrap text-left
                  ${isActive ? 'underline underline-offset-8 decoration-2 decoration-white' : ''}
                  hover:text-white/80 active:text-white/60`
                : `text-white whitespace-nowrap text-lg sm:text-base transition-all duration-200
                  ${isActive ? 'underline underline-offset-4 decoration-2 decoration-white' : ''}
                  hover:text-white/80 active:text-white/60`
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default Navbar;