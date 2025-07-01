import React from 'react';
import Navbar from './Navbar';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-dark text-white w-full border-t border-white/20">
      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center gap-8">
        {/* Réseaux sociaux */}
        <div className="flex gap-6 justify-center flex-wrap">
          <a href="#" aria-label="Instagram" className="hover:text-white/80 transition"><FaInstagram size={40} /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white/80 transition"><FaLinkedin size={40} /></a>
          <a href="#" aria-label="YouTube" className="hover:text-white/80 transition"><FaYoutube size={40} /></a>
        </div>

        {/* Navigation centrée */}
        <div className="w-full flex flex-col items-center gap-4">
          <Navbar />
        </div>

        
        <Logo />
     

        {/* Liens légaux centrés, wrap horizontal */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm text-white/60">
          <a href="#" className="hover:text-white transition">CGV/CGU</a>
          <span className="text-white/30">—</span>
          <a href="#" className="hover:text-white transition">Mentions Légales</a>
          <span className="text-white/30">—</span>
          <a href="#" className="hover:text-white transition">Confidentialité</a>
        </div>

        {/* Copyright centré */}
        <div className="text-center text-white/60 text-xs mt-2">
          © Xulinos — 2025
        </div>
      </div>
    </footer>
  );
};

export default Footer; 