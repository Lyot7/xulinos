'use client';

import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import IconButton from './IconButton';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { FiUser, FiShoppingCart } from 'react-icons/fi';
import { MdOutlineDesignServices } from 'react-icons/md';

import Logo from './Logo';
import Navbar from './Navbar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Full Desktop Header (xl and up) - Everything visible */}
      <div className="hidden xl:flex justify-between items-center px-8 py-4 bg-dark">
        <Logo size="lg" src="/vercel.svg" alt="Xulinos Logo" />
        <div className="flex items-center gap-4">
          <Navbar />
          <SecondaryButton name="Demander un service" className="hidden lg:inline-flex" />
          <PrimaryButton name="Créer mon couteau" className="hidden lg:inline-flex" />
          <IconButton icon={<FaShoppingCart />} />
          <IconButton icon={<FaUser />} />
        </div>
      </div>

      {/* Large Desktop Header (lg to xl) - Hide navbar, show burger */}
      <div className="hidden lg:flex xl:hidden justify-between items-center px-8 py-4 bg-dark">
        <Logo size="lg" src="/vercel.svg" alt="Xulinos Logo" />
        <div className="flex items-center gap-4">
          <SecondaryButton name="Demander un service" className="hidden lg:inline-flex" />
          <PrimaryButton name="Créer mon couteau" className="hidden lg:inline-flex" />
          <IconButton icon={<FaShoppingCart />} />
          <IconButton icon={<FaUser />} />
          <IconButton 
            icon={isMenuOpen ? <FaTimes /> : <FaBars />} 
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Medium Desktop Header (md to lg) - Hide both action buttons */}
      <div className="hidden md:flex lg:hidden justify-between items-center px-8 py-4 bg-dark">
        <Logo size="lg" src="/vercel.svg" alt="Xulinos Logo" />
        <div className="flex items-center gap-4">
          <SecondaryButton name="Demander un service" className="hidden md:inline-flex" />
          <PrimaryButton name="Créer mon couteau" className="hidden md:inline-flex" />
          <IconButton icon={<FaShoppingCart />} />
          <IconButton icon={<FaUser />} />
          <IconButton 
            icon={isMenuOpen ? <FaTimes /> : <FaBars />} 
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Small Desktop Header (sm to md) - Hide primary button */}
      <div className="hidden sm:flex md:hidden justify-between items-center px-6 py-4 bg-dark">
        <Logo size="md" src="/vercel.svg" alt="Xulinos Logo" />
        <div className="flex items-center gap-4">
          <IconButton icon={<FaShoppingCart />} />
          <IconButton icon={<FaUser />} />
          <IconButton 
            icon={isMenuOpen ? <FaTimes /> : <FaBars />} 
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Mobile Header (less than sm) - Everything in burger */}
      <div className="sm:hidden flex justify-between items-center px-4 py-4 bg-dark">
        <Logo size="md" src="/vercel.svg" alt="Xulinos Logo" />
        <IconButton 
          icon={isMenuOpen ? <FaTimes /> : <FaBars />} 
          onClick={toggleMenu}
        />
      </div>

      {/* Burger Menu Overlay (lg and down) - All buttons grouped at the bottom with uniform spacing */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 bg-dark z-50 flex flex-col">
          {/* Top bar */}
          <div className="flex justify-between items-start px-6 pt-8">
            <div className="flex-1 flex justify-center">
              <Logo size="md" src="/vercel.svg" alt="Xulinos Logo" />
            </div>
            <button onClick={closeMenu} className="text-3xl text-white">
              <FaTimes />
            </button>
          </div>

          {/* Navigation */}
          <div className="mt-16 px-8">
            <Navbar mobile />
          </div>

          {/* All buttons at the bottom, uniform spacing, grid for last two */}
          <div className="mt-auto w-full px-6 pb-8 flex flex-col gap-4">
            <button className="w-full py-4 border border-white rounded-2xl bg-dark text-white text-lg" onClick={closeMenu}>
              Demander un service
            </button>
            <button className="w-full py-4 rounded-2xl bg-white text-dark border border-white text-lg" onClick={closeMenu}>
              Créer mon couteau
            </button>
            <div className="grid grid-cols-2 gap-4 w-full">
              <button className="flex flex-col items-center justify-center h-20 bg-dark rounded-2xl text-white border border-white w-full" onClick={closeMenu}>
                <FiShoppingCart className="text-2xl mb-1" />
                <span className="text-base">Panier</span>
              </button>
              <button className="flex flex-col items-center justify-center h-20 bg-dark rounded-2xl text-white border border-white w-full" onClick={closeMenu}>
                <FiUser className="text-2xl mb-1" />
                <span className="text-base">Mon compte</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;