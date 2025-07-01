import React from 'react';
import Navbar from './Navbar';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-dark text-white w-full border-t border-white/20">
      {/* Version desktop */}
      <div className="hidden md:flex justify-between items-start max-w-7xl mx-auto px-8 py-10">
        {/* Réseaux sociaux - à gauche avec copyright en dessous */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex gap-6">
            <a href="#" aria-label="Instagram" className="hover:text-white/80 transition"><FaInstagram size={24} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white/80 transition"><FaLinkedin size={24} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-white/80 transition"><FaYoutube size={24} /></a>
          </div>
          {/* Copyright sous les médias sociaux */}
          <div className="text-white/60 text-xs">
            © Xulinos — 2025
          </div>
        </div>

        {/* Navigation - au centre */}
        <div className="flex flex-col items-center gap-6">
          <Navbar />
          
          {/* Liens légaux centrés en dessous de la navbar */}
          <div className="flex flex-row items-center gap-4 text-xs text-white/60">
            <a href="#" className="hover:text-white transition">CGV/CGU</a>
            <span className="text-white/30">—</span>
            <a href="#" className="hover:text-white transition">Mentions Légales</a>
            <span className="text-white/30">—</span>
            <a href="#" className="hover:text-white transition">Confidentialité</a>
          </div>
        </div>

        {/* Logo - à droite */}
        <div>
          <Logo width={90} height={86} />
        </div>
      </div>

      {/* Version mobile/tablette (existante) */}
      <div className="md:hidden max-w-3xl mx-auto px-4 py-10 flex flex-col items-center gap-8">
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
      </div>

      {/* Liens légaux et copyright - uniquement pour mobile */}
      <div className="md:hidden max-w-7xl mx-auto px-4 pb-10 flex flex-col items-center gap-4">
        {/* Liens légaux centrés, wrap horizontal */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm text-white/60">
          <a href="#" className="hover:text-white transition">CGV/CGU</a>
          <span className="text-white/30">—</span>
          <a href="#" className="hover:text-white transition">Mentions Légales</a>
          <span className="text-white/30">—</span>
          <a href="#" className="hover:text-white transition">Confidentialité</a>
        </div>

        {/* Copyright centré - visible uniquement sur mobile */}
        <div className="text-center text-white/60 text-xs mt-2">
          © Xulinos — 2025
        </div>
      </div>
    </footer>
  );
};

export default Footer; 