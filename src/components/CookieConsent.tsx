'use client';

import React, { useState, useEffect } from 'react';
import { FaCookieBite, FaTimes, FaCheck, FaShieldAlt, FaBan } from 'react-icons/fa';
import { useCookieConsent, CookieConsentType } from '@/hooks/useCookieConsent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { hasConsented, setConsent } = useCookieConsent();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    if (!hasConsented) {
      // Afficher la popup après un délai pour ne pas être trop agressive
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasConsented]);

  const handleConsent = (type: CookieConsentType) => {
    setConsent(type);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      {/* Popup */}
      <div className="bg-dark border border-primary/20 rounded-lg shadow-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <div className="flex items-center space-x-3">
            <FaCookieBite className="text-primary text-xl" />
            <h2 className="text-lg font-bold text-white">Gestion des cookies</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-white/80 mb-4 text-sm">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
            Vous pouvez choisir quels types de cookies autoriser.
          </p>

          {/* Cookie Details */}
          <div className="mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-white hover:text-white/80 font-medium text-sm flex items-center"
            >
              {showDetails ? 'Masquer' : 'Voir'} les détails
              <span className={`ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showDetails && (
              <div className="mt-3 space-y-2 text-sm text-white/70">
                <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                  <h4 className="font-medium text-white mb-1">Cookies essentiels</h4>
                  <p>Nécessaires au fonctionnement du site (panier, préférences de langue)</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                  <h4 className="font-medium text-white mb-1">Cookies analytiques</h4>
                  <p>Nous aident à comprendre comment vous utilisez notre site</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                  <h4 className="font-medium text-white mb-1">Cookies marketing</h4>
                  <p>Utilisés pour personnaliser les publicités et le contenu</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Accepter tous */}
            <button
              onClick={() => handleConsent('all')}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm"
            >
              <FaCheck className="text-sm" />
              <span>Accepter tous les cookies</span>
            </button>

            {/* Cookies essentiels seulement */}
            <button
              onClick={() => handleConsent('essential')}
              className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm"
            >
              <FaShieldAlt className="text-sm" />
              <span>Cookies essentiels seulement</span>
            </button>

            {/* Refuser */}
            <button
              onClick={() => handleConsent('none')}
              className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium py-2 px-3 rounded-md transition-colors text-sm"
            >
              <FaBan className="text-sm" />
              <span>Refuser tous les cookies</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-3 text-xs text-white/60 text-center">
            En continuant à utiliser ce site, vous acceptez notre{' '}
            <a href="/privacy" className="text-white hover:underline">
              politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 