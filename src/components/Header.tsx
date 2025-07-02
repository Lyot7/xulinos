'use client';

import React, { useState, useEffect } from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import IconButton from './IconButton';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import Navbar from './Navbar';
import Logo from './Logo';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Fermer le menu quand on redimensionne vers 1090px+
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1090) { // Exactement 1090px
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Empêcher le scroll quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header principal avec responsive design intelligent */}
      <header className="relative bg-dark px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />
          
          {/* Navigation desktop + Actions - alignées à droite à partir de 1090px */}
          <div className="hidden min-[1090px]:flex items-center gap-6">
            <Navbar />
            <div className="flex items-center gap-4">
              <SecondaryButton 
                name="Demander un service" 
                className="inline-flex"
              />
              <PrimaryButton 
                name="Créer mon couteau" 
                className="inline-flex"
                onClick={() => handleNavigation('/configurateur')}
              />
              <IconButton 
                icon={<FaShoppingCart />} 
                aria-label="Panier"
              />
              <IconButton 
                icon={<FaUser />} 
                aria-label="Mon compte"
              />
            </div>
          </div>
          
          {/* Actions responsive - masquées à partir de 1090px */}
          <div className="flex min-[1090px]:hidden items-center gap-3 sm:gap-4">
            {/* Boutons d'action - masqués progressivement sur petits écrans */}
            <SecondaryButton 
              name="Demander un service" 
              className="hidden md:inline-flex"
            />
            <PrimaryButton 
              name="Créer mon couteau" 
              className="hidden md:inline-flex"
              onClick={() => handleNavigation('/configurateur')}
            />
            
            {/* Icônes utilisateur - toujours visibles */}
            <IconButton 
              icon={<FaShoppingCart />} 
              className="flex"
              aria-label="Panier"
            />
            <IconButton 
              icon={<FaUser />} 
              className="flex"
              aria-label="Mon compte"
            />
            
            {/* Menu burger */}
            <IconButton 
              icon={isMenuOpen ? <FaTimes /> : <FaBars />}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            />
          </div>
        </div>
      </header>

      {/* Menu mobile overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="min-[1090px]:hidden fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
          />
          
          {/* Menu content */}
          <div className="min-[1090px]:hidden fixed inset-0 bg-dark z-[9999] flex flex-col">
            {/* Header du menu */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <Logo />
              <IconButton 
                icon={<FaTimes />}
                onClick={closeMenu}
                className="text-white hover:bg-white/10"
                aria-label="Fermer le menu"
              />
            </div>
            
            {/* Navigation mobile - centrée */}
            <div className="flex-1 px-6 py-8 flex flex-col justify-center">
              <nav className="flex flex-col items-start space-y-8">
                <Navbar mobile />
              </nav>
            </div>
            
            {/* Actions du menu mobile */}
            <div className="px-6 pb-8 space-y-4 border-t border-white/10 pt-6">
              {/* Boutons principaux */}
              <div className="space-y-3">
                <SecondaryButton 
                  name="Demander un service" 
                  onClick={closeMenu}
                  className="w-full justify-center py-3 text-lg"
                />
                <PrimaryButton 
                  name="Créer mon couteau" 
                  onClick={() => {
                    closeMenu();
                    handleNavigation('/configurateur');
                  }}
                  className="w-full justify-center py-3 text-lg"
                />
              </div>
              
              {/* Icônes utilisateur pour tous les écrans */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={closeMenu}
                  className="flex flex-col items-center justify-center p-4 bg-transparent border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
                >
                  <FaShoppingCart className="mb-2 text-xl" />
                  <span className="text-sm">Panier</span>
                </button>
                <button 
                  onClick={closeMenu}
                  className="flex flex-col items-center justify-center p-4 bg-transparent border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
                >
                  <FaUser className="mb-2 text-xl" />
                  <span className="text-sm">Mon compte</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;